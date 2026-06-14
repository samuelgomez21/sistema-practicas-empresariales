import api from '@/lib/axios'
import { subirArchivo } from '@/lib/cloudinary'

function normalizarPractica(p) {
  if (!p) return null
  return {
    ...p,
    nombrePractica: p.nombre,
    programa:       p.nombrePrograma ?? p.programa,
    numeroPractica: p.numeroPractica ?? p.numero,
    estado:         p.estado,
    empresaId: p.empresaId,
    empresa: p.empresa ?? (
      p.empresaId || p.empresaNombre ? {
        razonSocial:    p.empresaNombre ?? `Empresa #${p.empresaId}`,
        municipio:      p.municipio     ?? '—',
        sector:         p.sector        ?? '—',
        telefono:       p.telefono      ?? '—',
        nombreContacto: p.contactoNombre ?? '—',
        emailContacto:  p.contactoEmail  ?? '—',
      } : null
    ),
    docente: p.docente ?? (p.nombreDocente ? {
      nombre: p.nombreDocente,
      correo: p.emailDocenteAsesor ?? p.correoDocente ?? '—',
      id:     p.docenteAsesorId    ?? null,
    } : null),
    tutor: p.tutor ?? (p.nombreTutor ? {
      nombre:   p.nombreTutor,
      cargo:    p.cargoTutor    ?? '—',
      telefono: p.telefonoTutor ?? '—',
      correo:   p.correoTutor   ?? '—',
    } : null),
    cortes:   p.cortes   ?? p.cortesConfig ?? [],
    planeador: p.planeador ?? (p.planeadorUrl ? {
      url:        p.planeadorUrl,
      fechaCarga: p.fechaCreacion?.split('T')[0],
    } : null),
    notaFinal: p.notaFinal,
  }
}

function normalizarPostulacion(p) {
  return {
    ...p,
    vacanteId:        p.vacanteId,
    tituloVacante:    p.tituloVacante ?? p.vacanteTitulo,
    empresaNombre:    p.empresaNombre ?? `Vacante: ${p.tituloVacante}`,
    modalidad:        p.modalidad  ?? null,
    salario:          p.salario    ?? null,
    horario:          p.horario    ?? null,
    fechaPostulacion: p.fechaPostulacion,
    estado:           typeof p.estado === 'object' ? p.estado.name?.() : p.estado,
    observacion:      p.observaciones ?? null,
  }
}

export const estudianteApi = {

  getMiPractica: async () => {
    try {
      const { data } = await api.get('/estudiantes/mi-practica-activa')
      return normalizarPractica(data)
    } catch {
      return null
    }
  },

  getAvances: async () => {
    try {
      const { data: practicaRaw } = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRaw?.id) return []
      const { data: resp } = await api.get(`/practicas/${practicaRaw.id}/avances`)
      const lista = resp?.data ?? resp ?? []
      return lista.map(a => ({
        id:                a.id,
        titulo:            a.titulo,
        descripcion:       a.descripcion,
        estado:            a.estado,
        archivoUrl:        a.archivoUrl        ?? null,
        fechaEntrega:      a.createdAt         ?? a.fechaEntrega ?? null,
        comentarioDocente: a.comentarioDocente ?? null,
      }))
    } catch {
      return []
    }
  },

  crearAvance: async ({ titulo, corteNumero, descripcion, archivoUrl }) => {
    const practicaRes = await api.get('/estudiantes/mi-practica-activa')
    if (!practicaRes.data?.id) throw new Error('No tienes una práctica activa')
    const { data } = await api.post(`/practicas/${practicaRes.data.id}/avances`, {
      titulo, corteNumero, descripcion, archivoUrl: archivoUrl ?? null,
    })
    return data
  },

  getMisDocumentos: async () => {
    try {
      const practicaRes = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRes.data?.id) return {}
      const { data } = await api.get(`/practicas/${practicaRes.data.id}/documentos`)
      const mapa = {}
      ;(data ?? []).forEach(d => {
        const key = d.categoria?.toLowerCase()
          .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        mapa[key] = {
          url:        d.url,
          nombre:     d.nombre,
          fechaCarga: d.fechaCarga ?? null,
          estado:     d.estado,
        }
      })
      return mapa
    } catch {
      return {}
    }
  },

  subirDocumento: async (categoria, archivo) => {
    const practicaRes = await api.get('/estudiantes/mi-practica-activa')
    if (!practicaRes.data?.id) throw new Error('No tienes una práctica activa')
    const practicaId = practicaRes.data.id
    const formData = new FormData()
    formData.append('archivo', archivo)
    const { data } = await api.post(
      `/practicas/${practicaId}/documentos?categoria=${encodeURIComponent(categoria)}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return { url: data?.informeEjecutivoUrl ?? data?.url ?? null, estado: data?.estado ?? 'PENDIENTE' }
  },

  // ── Checklist — usa checklist-completo que calcula en tiempo real ──────────
  getChecklist: async () => {
    try {
      const practicaRes = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRes.data?.id) return []

      const { data } = await api.get(
        `/cierre/practica/${practicaRes.data.id}/checklist-completo`
      )

      // ChecklistResponse → array de items para el frontend
      return [
        {
          id:        'nota_docente',
          label:     'Nota del docente registrada',
          completado: data.notaDocenteRegistrada ?? false,
        },
        {
          id:        'nota_tutor',
          label:     'Nota del tutor empresarial registrada',
          completado: data.notaTutorRegistrada ?? false,
        },
        {
          id:        'nota_final',
          label:     'Nota final registrada',
          completado: data.notaFinalRegistrada ?? false,
        },
        {
          id:        'encuesta_estudiante',
          label:     'Encuesta de satisfacción completada',
          completado: data.estadoEncuestaEstudiante === 'COMPLETADA',
        },
        {
          id:        'encuesta_tutor',
          label:     'Evaluación del tutor completada',
          completado: data.estadoEncuestaTutor === 'COMPLETADA',
        },
        {
          id:        'documentos',
          label:     'Documentos aprobados (ARL, Planeador, Informe, Presentación)',
          completado: data.documentosAprobados ?? false,
        },
        {
          id:        'informe_final',
          label:     'Documento final aprobado',
          completado: data.informeFinalAprobado ?? false,
        },
      ]
    } catch {
      return []
    }
  },

  getPlantillaEncuesta: async () => {
    try {
      const { data } = await api.get('/encuestas/plantilla/ESTUDIANTE')
      return data
    } catch {
      return null
    }
  },

  getEncuesta: async () => {
    try {
      const practicaRes = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRes.data?.id) return null
      const completada = await api.get(
        `/encuestas/practica/${practicaRes.data.id}/tipo/ESTUDIANTE/completada`
      )
      if (!completada.data?.completada) return null
      const { data } = await api.get(
        `/encuestas/practica/${practicaRes.data.id}/tipo/ESTUDIANTE`
      )
      return data
    } catch {
      return null
    }
  },

  enviarEncuesta: async ({ plantillaId, respuestas, observaciones }) => {
    const practicaRes = await api.get('/estudiantes/mi-practica-activa')
    if (!practicaRes.data?.id) throw new Error('No tienes una práctica activa')
    const { data } = await api.post(
      `/encuestas/practica/${practicaRes.data.id}/tipo/ESTUDIANTE`,
      { plantillaId, respuestas, observaciones: observaciones ?? '' }
    )
    return data
  },

  getMisPostulaciones: async () => {
    try {
      const { data } = await api.get('/postulaciones/mis-postulaciones')
      return (data ?? []).map(normalizarPostulacion)
    } catch {
      return []
    }
  },

  getMiHojaVida: async () => {
    try {
      const { data } = await api.get('/estudiantes/mi-perfil')
      return data?.hojaVidaUrl ? {
        url:        data.hojaVidaUrl,
        fechaCarga: data.fechaCreacion?.split('T')[0],
        nombre:     'Hoja de vida',
      } : null
    } catch {
      return null
    }
  },

  subirHojaVida: async (archivo) => {
    const { data: perfil } = await api.get('/estudiantes/mi-perfil')
    const estudianteId = perfil.id
    const path = `hojas-vida/est_${estudianteId}_${Date.now()}_${archivo.name}`
    const url  = await subirArchivo(archivo, path)
    await api.patch(`/estudiantes/${estudianteId}/hoja-vida`, { hojaVidaUrl: url })
    return {
      url,
      fechaCarga: new Date().toISOString().split('T')[0],
      nombre:     archivo.name,
    }
  },
}

export const PREGUNTAS_ENCUESTA = []