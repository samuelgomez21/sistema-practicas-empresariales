import api from '@/lib/axios'
import { subirArchivo } from '@/lib/cloudinary'
import { useAuthStore } from '@/store/authStore'

// ─── Normalización de práctica ──────────────────────────────────────────────
// PracticaDetalleDto del backend tiene campos distintos al mock anterior.
// Esta función adapta la respuesta al shape que usan las páginas.
function normalizarPractica(p) {
  if (!p) return null
  return {
    ...p,
    // Identificadores usados en las pages
    id:             p.id,
    nombrePractica: p.nombre,
    materiaNucleo:  p.materiaNucleo,
    descripcion:    p.descripcion ?? '',
    programa:       p.nombrePrograma ?? p.programa,
    numeroPractica: p.numeroPractica ?? p.numero,
    semestre:       p.semestre,
    // Estado — el backend usa EstadoPracticaTipo
    estado:         p.estado,
    fechaInicio:    p.fechaInicio,
    fechaFin:       p.fechaFin,
    // Empresa
    empresa: p.empresa ?? (p.empresaNombre ? {
      razonSocial:    p.empresaNombre,
      municipio:      p.municipio   ?? '—',
      sector:         p.sector      ?? '—',
      telefono:       p.telefono    ?? '—',
      nombreContacto: p.contactoNombre ?? '—',
      emailContacto:  p.contactoEmail  ?? '—',
    } : null),
    // Docente
    docente: p.docente ?? (p.nombreDocenteAsesor ? {
      nombre: p.nombreDocenteAsesor,
      correo: p.correoDocente ?? '—',
    } : null),
    // Tutor
    tutor: p.tutor ?? (p.nombreTutorEmpresarial ? {
      nombre:   p.nombreTutorEmpresarial,
      cargo:    p.cargoTutor   ?? '—',
      telefono: p.telefonoTutor ?? '—',
      correo:   p.correoTutor  ?? '—',
    } : null),
    // Cortes de seguimiento
    cortes: p.cortes ?? p.cortesConfig ?? [],
    // Planeador
    planeador: p.planeador ?? (p.planeadorUrl ? {
      url:        p.planeadorUrl,
      fechaCarga: p.fechaCreacion,
    } : null),
    // Nota final
    notaFinal: p.notaFinal,
  }
}

function normalizarPostulacion(p) {
  return {
    ...p,
    vacanteId:       p.vacanteId,
    tituloVacante:   p.tituloVacante ?? p.vacanteTitulo,
    empresaNombre:   p.empresaNombre ?? `Vacante: ${p.tituloVacante}`,
    modalidad:       p.modalidad ?? null,
    salario:         p.salario   ?? null,
    horario:         p.horario   ?? null,
    fechaPostulacion: p.fechaPostulacion,
    estado:          typeof p.estado === 'object' ? p.estado.name?.() : p.estado,
    observacion:     p.observaciones ?? null,
  }
}

// ── API ──────────────────────────────────────────────────────────────────────
export const estudianteApi = {

  // ── Práctica activa ────────────────────────────────────────────────────────
  getMiPractica: async () => {
    try {
      const { data } = await api.get('/estudiantes/mi-practica-activa')
      return normalizarPractica(data)
    } catch {
      return null
    }
  },

  // ── Avances ────────────────────────────────────────────────────────────────
  getAvances: async () => {
    try {
      // El backend expone avances por práctica; necesitamos el id primero
      const practicaRes = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRes.data?.id) return []
      const { data } = await api.get(`/practicas/${practicaRes.data.id}/avances`)
      return (data ?? []).map(a => ({
        id:                a.id,
        practicaId:        a.practicaId,
        corteNumero:       a.corteNumero ?? a.numeroCorte ?? 1,
        titulo:            a.titulo,
        descripcion:       a.descripcion,
        archivoUrl:        a.archivoUrl,
        fechaEntrega:      a.fechaEntrega ?? a.fechaCreacion?.split('T')[0],
        comentarioDocente: a.comentarioDocente ?? a.comentario,
        estado:            a.estado,
      }))
    } catch {
      return []
    }
  },

  crearAvance: async ({ titulo, corteNumero, descripcion, archivoUrl }) => {
    const practicaRes = await api.get('/estudiantes/mi-practica-activa')
    if (!practicaRes.data?.id) throw new Error('No tienes una práctica activa')
    const { data } = await api.post(`/practicas/${practicaRes.data.id}/avances`, {
      titulo,
      corteNumero,
      descripcion,
      archivoUrl: archivoUrl ?? null,
    })
    return data
  },

  /**
   * Sube el archivo de avance a Firebase y luego registra el avance.
   */
  subirAvanceConArchivo: async ({ titulo, corteNumero, descripcion, archivo }) => {
    let archivoUrl = null
    if (archivo) {
      const user = useAuthStore.getState().user
      const path = `avances/${user?.id ?? 'est'}_${Date.now()}_${archivo.name}`
      archivoUrl = await subirArchivo(archivo, path)
    }
    return estudianteApi.crearAvance({ titulo, corteNumero, descripcion, archivoUrl })
  },

  // ── Documentos de la práctica ──────────────────────────────────────────────
  getMisDocumentos: async () => {
    try {
      const practicaRes = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRes.data?.id) return {}
      const { data } = await api.get(`/practicas/${practicaRes.data.id}/documentos`)
      // Agrupar por categoría para el frontend
      const mapa = {}
      ;(data ?? []).forEach(d => {
        const key = d.categoria?.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        mapa[key] = { url: d.url, fechaCarga: d.fechaCarga ?? d.fechaCreacion?.split('T')[0], estado: d.estado }
      })
      return mapa
    } catch {
      return {}
    }
  },

  /**
   * Sube un documento a Firebase y lo registra en el backend.
   * categoria: 'ARL' | 'PLANEADOR' | 'INFORME_EJECUTIVO' | 'PRESENTACION' | 'DOCUMENTO_FINAL'
   */
  subirDocumento: async (categoria, archivo) => {
    const practicaRes = await api.get('/estudiantes/mi-practica-activa')
    if (!practicaRes.data?.id) throw new Error('No tienes una práctica activa')

    const user   = useAuthStore.getState().user
    const path   = `documentos-practica/${practicaRes.data.id}/${categoria}_${Date.now()}_${archivo.name}`
    const url    = await subirArchivo(archivo, path)

    const { data } = await api.post(`/practicas/${practicaRes.data.id}/documentos`, {
      categoria,
      url,
      nombre: archivo.name,
    }, {
      headers: { 'Content-Type': 'application/json' },
    })
    return { url, estado: data?.estado ?? 'PENDIENTE' }
  },

  // ── Checklist ──────────────────────────────────────────────────────────────
  getChecklist: async () => {
    try {
      const practicaRes = await api.get('/estudiantes/mi-practica-activa')
      if (!practicaRes.data?.id) return []
      const { data } = await api.get(`/practicas/${practicaRes.data.id}/checklist`)
      return (data ?? []).map(c => ({
        id:          c.clave ?? c.id,
        label:       c.label,
        completado:  c.completado,
      }))
    } catch {
      return []
    }
  },

  // ── Encuesta ───────────────────────────────────────────────────────────────
  getPlantillaEncuesta: async () => {
    try {
      const { data } = await api.get('/encuestas/plantilla/ESTUDIANTE')
      return data // EncuestaPlantillaDto: { id, tipo, secciones: [{ preguntas: [] }] }
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

  // ── Postulaciones ──────────────────────────────────────────────────────────
  getMisPostulaciones: async () => {
    try {
      const { data } = await api.get('/postulaciones/mis-postulaciones')
      return (data ?? []).map(normalizarPostulacion)
    } catch {
      return []
    }
  },

  // ── Hoja de vida ───────────────────────────────────────────────────────────
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
    // Obtener el id del estudiante desde el perfil
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

// Preguntas de encuesta — se obtienen del backend ahora, pero mantenemos
// el export por compatibilidad con páginas que lo importen directamente.
export const PREGUNTAS_ENCUESTA = []