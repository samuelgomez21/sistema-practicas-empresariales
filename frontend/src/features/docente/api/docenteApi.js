import api from '@/lib/axios'

const getEmail = () => {
  const { useAuthStore } = require('@/store/authStore')
  return useAuthStore.getState().user?.email
}

export const docenteApi = {

  getPerfilDocente: async () => {
    try {
      // Usa el nuevo endpoint que no requiere ID
      const { data } = await api.get('/usuarios/mi-perfil')
      return {
        id:             data.id,
        nombre:         data.nombre,
        correo:         data.email,
        maxEstudiantes: data.maxEstudiantes ?? 0,
        facultad:       data.facultad    ?? 'Sin facultad asignada',
        programa:       data.programa    ?? 'Sin programa asignado',
        dedicacion:     data.dedicacion  ?? 'Docente asesor',
      }
    } catch (err) {
      console.error('Error cargando perfil docente:', err)
      return null
    }
  },

  getMisEstudiantes: async () => {
    try {
      // Usa el endpoint que lee el token directamente
      const { data } = await api.get('/practicas/mis-practicas')
      const lista = Array.isArray(data) ? data : (data?.data ?? [])
      return lista.map(p => ({
        id:       p.estudianteId,
        nombre:   p.nombreEstudiante,
        programa: p.programa ?? p.nombrePrograma ?? '—',
        semestre: p.semestre ?? '—',
        promedioAcumulado: p.promedioAcumulado,
        creditosAprobados: p.creditosAprobados,
        practica: {
          id:               p.id,
          numero:           p.numeroPractica,
          estado:           p.estado,
          empresaNombre:    p.empresaNombre  ?? null,
          tutorNombre:      p.nombreTutor    ?? null,
          fechaInicio:      p.fechaInicio    ?? null,
          fechaFinEstimada: p.fechaFin       ?? null,
          avancesPendientes: 0,
        },
      }))
    } catch (err) {
      console.error('Error cargando estudiantes docente:', err)
      return []
    }
  },

  getEstudianteDetalle: async (estudianteId) => {
    try {
      const { data } = await api.get(`/estudiantes/${estudianteId}`)
      // Buscar práctica activa del estudiante
      let practica = null
      try {
        const { data: pData } = await api.get('/practicas/mis-practicas')
        const lista = Array.isArray(pData) ? pData : (pData?.data ?? [])
        const p = lista.find(
          x => x.estudianteId === Number(estudianteId) &&
               !['COMPLETADA','REPROBADA','CANCELADA'].includes(x.estado)
        )
        if (p) {
          practica = {
            id:               p.id,
            numero:           p.numeroPractica,
            estado:           p.estado,
            empresaNombre:    p.empresaNombre    ?? null,
            tutorNombre:      p.nombreTutor      ?? null,
            fechaInicio:      p.fechaInicio      ?? null,
            fechaFinEstimada: p.fechaFin         ?? null,
          }
        }
      } catch { /* sin práctica */ }

      return {
        id:                data.id,
        nombre:            data.nombre,
        programa:          data.nombrePrograma,
        semestre:          data.semestre,
        promedioAcumulado: Number(data.promedioAcumulado ?? 0),
        creditosAprobados: data.creditosAprobados,
        email:             data.email,
        identificacion:    data.identificacion,
        practica,
      }
    } catch {
      return null
    }
  },

  getAvancesPendientes: async () => {
    try {
      // Primero obtener el perfil para sacar el ID
      const { data: perfil } = await api.get('/usuarios/mi-perfil')
      const { data } = await api.get(`/docentes/${perfil.id}/avances/pendientes`)
      const lista = data?.data ?? data ?? []
      return lista.map(a => ({
        id:                a.id,
        practicaId:        a.practica_id,
        estudianteNombre:  a.estudianteNombre ?? '—',
        titulo:            a.titulo,
        descripcion:       a.descripcion,
        archivoUrl:        a.archivoUrl ?? null,
        archivoNombre:     a.archivoNombre ?? (a.archivoUrl ? 'Archivo adjunto' : null),
        fechaEntrega:      a.createdAt ?? a.fechaEntrega,
        estado:            a.estado,
        comentarioDocente: a.comentarioDocente ?? null,
      }))
    } catch {
      return []
    }
  },

  getAvancesPorPractica: async (practicaId) => {
    if (!practicaId) return []
    try {
      const { data } = await api.get(`/practicas/${practicaId}/avances`)
      const lista = data?.data ?? data ?? []
      return lista.map(a => ({
        id:                a.id,
        practicaId:        a.practica_id,
        estudianteNombre:  a.estudianteNombre ?? '—',
        titulo:            a.titulo,
        descripcion:       a.descripcion,
        archivoUrl:        a.archivoUrl ?? null,
        archivoNombre:     a.archivoNombre ?? (a.archivoUrl ? 'Archivo adjunto' : null),
        fechaEntrega:      a.createdAt ?? a.fechaEntrega,
        estado:            a.estado,
        comentarioDocente: a.comentarioDocente ?? null,
      }))
    } catch {
      return []
    }
  },

  comentarAvance: async (avanceId, comentario) => {
    const { data } = await api.patch(`/avances/${avanceId}/comentario`, { comentario })
    return data?.data ?? data
  },

  // ── Evaluaciones ────────────────────────────────────────────────────────────

  registrarNota: async (practicaId, nota, observaciones) => {
    const { data } = await api.post(
      `/evaluaciones/docente/practica/${practicaId}`,
      { notaDocente: nota, observacionesDocente: observaciones }
    )
    return data
  },

  getEvaluacion: async (practicaId) => {
    try {
      const { data } = await api.get(`/evaluaciones/practica/${practicaId}`)
      return data
    } catch {
      return null
    }
  },

  // Visitas — pendiente backend
  getVisitas:              async () => [],
  crearVisita:             async () => null,
  getEstudiantesConEmpresa: async () => {
    const todos = await docenteApi.getMisEstudiantes()
    return todos.filter(e => e.practica?.empresaNombre)
  },
}

export const ESTADO_PRACTICA_LABEL = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio', bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'Sin empresa',      bg: '#f0f2f5', color: '#6b7a8d' },
  VINCULADA:                 { label: 'Vinculada',        bg: '#e6f0fb', color: '#0B416B' },
  EN_PRACTICA:               { label: 'En práctica',      bg: '#eaf7f0', color: '#1a7a4a' },
  COMPLETADA:                { label: 'Completada',       bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',        bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',        bg: '#fef0f0', color: '#c0392b' },
}

export const MOTIVO_VISITA = {
  SEGUIMIENTO: 'Seguimiento general',
  INDUCCION:   'Verificación de inducción',
  EVALUACION:  'Evaluación intermedia',
  CIERRE:      'Visita de cierre',
  OTRO:        'Otro',
}