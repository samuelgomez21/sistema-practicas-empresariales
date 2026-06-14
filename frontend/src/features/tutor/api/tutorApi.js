import api from '@/lib/axios'

// ── Helpers ────────────────────────────────────────────────────────────────────

const getEmail = () => {
  const { useAuthStore } = require('@/store/authStore')
  return useAuthStore.getState().user?.email
}

// ── API ────────────────────────────────────────────────────────────────────────

export const tutorApi = {

  /**
   * Perfil del tutor autenticado.
   * El tutor tiene usuario propio → GET /usuarios/mi-perfil
   * y sus datos de tutor → buscamos por correo en tutores
   */
  getPerfilTutor: async () => {
    try {
      const { data: usuario } = await api.get('/usuarios/mi-perfil')
      // Buscar el tutor por correo para obtener cargo y empresa
      try {
        const { data: tutores } = await api.get('/empresas/tutores/todos')
        const tutor = (tutores ?? []).find(
          t => t.correo?.toLowerCase() === usuario.email?.toLowerCase()
        )
        return {
          id:           tutor?.id        ?? null,
          nombre:       tutor?.nombre    ?? usuario.nombre,
          correo:       tutor?.correo    ?? usuario.email,
          cargo:        tutor?.cargo     ?? '—',
          telefono:     tutor?.telefono  ?? '—',
          empresaId:    tutor?.empresaId ?? null,
          empresaNombre: tutor?.empresaNombre ?? '—',
        }
      } catch {
        return {
          id:           null,
          nombre:       usuario.nombre,
          correo:       usuario.email,
          cargo:        '—',
          telefono:     '—',
          empresaId:    null,
          empresaNombre: '—',
        }
      }
    } catch {
      return null
    }
  },

  /**
   * Lista las prácticas donde este tutor está asignado.
   * Endpoint: GET /practicas — filtramos por tutorEmpresarialId
   * El tutor no tiene endpoint propio, busca en prácticas activas.
   */
  getMisEstudiantes: async () => {
    try {
      const perfil = await tutorApi.getPerfilTutor()
      if (!perfil?.id) return []

      // Obtener todas las prácticas de la empresa del tutor
      const { data } = await api.get(`/practicas/empresa/${perfil.empresaId}`)
      const lista    = Array.isArray(data) ? data : (data?.data ?? [])

      // Filtrar solo las que tienen asignado este tutor
      const misPracticas = lista.filter(
        p => p.tutorId === perfil.id || p.tutorEmpresarialId === perfil.id
      )

      // Enriquecer con datos del estudiante
      return await Promise.all(misPracticas.map(async p => {
        let encuestaCompletada = false
        try {
          const { data: enc } = await api.get(
            `/encuestas/practica/${p.id}/tipo/TUTOR/completada`
          )
          encuestaCompletada = enc?.completada ?? false
        } catch { /* sin encuesta */ }

        let evaluacion = null
        try {
          const { data: ev } = await api.get(`/evaluaciones/practica/${p.id}`)
          evaluacion = ev
        } catch { /* sin evaluación */ }

        return {
          id:                 p.estudianteId,
          nombre:             p.nombreEstudiante  ?? '—',
          programa:           p.programa          ?? p.nombrePrograma ?? '—',
          semestre:           p.semestre          ?? '—',
          practicaId:         p.id,
          numeroPractica:     p.numeroPractica,
          estado:             p.estado,
          fechaInicio:        p.fechaInicio        ?? null,
          fechaFinEstimada:   p.fechaFin           ?? null,
          correo:             p.emailEstudiante    ?? '—',
          docenteNombre:      p.nombreDocente      ?? '—',
          encuestaCompletada,
          notaTutor:          evaluacion?.notaTutor ?? null,
          observacionesNota:  evaluacion?.observacionesTutor ?? null,
        }
      }))
    } catch {
      return []
    }
  },

  /**
   * Detalle de un estudiante específico.
   */
  getEstudianteDetalle: async (estudianteId) => {
    try {
      const todos = await tutorApi.getMisEstudiantes()
      return todos.find(e => e.id === Number(estudianteId)) ?? null
    } catch {
      return null
    }
  },

  // ── Encuesta tipo TUTOR ────────────────────────────────────────────────────

  getPlantillaEncuestaTutor: async () => {
    try {
      const { data } = await api.get('/encuestas/plantilla/TUTOR')
      return data
    } catch {
      return null
    }
  },

  getEncuestaTutor: async (practicaId) => {
    try {
      const { data: completada } = await api.get(
        `/encuestas/practica/${practicaId}/tipo/TUTOR/completada`
      )
      if (!completada?.completada) return null
      const { data } = await api.get(`/encuestas/practica/${practicaId}/tipo/TUTOR`)
      return data
    } catch {
      return null
    }
  },

  enviarEncuestaTutor: async (practicaId, payload) => {
    const { data } = await api.post(
      `/encuestas/practica/${practicaId}/tipo/TUTOR`,
      payload
    )
    return data
  },

  // ── Nota del tutor ─────────────────────────────────────────────────────────

  getNotaTutor: async (practicaId) => {
    try {
      const { data } = await api.get(`/evaluaciones/practica/${practicaId}`)
      if (!data?.notaTutor) return null
      return {
        nota:          Number(data.notaTutor),
        observaciones: data.observacionesTutor ?? null,
        fecha:         data.fechaEvaluacionTutor ?? null,
      }
    } catch {
      return null
    }
  },

  registrarNotaTutor: async (practicaId, { nota, observaciones }) => {
    const { data } = await api.post(`/evaluaciones/tutor/practica/${practicaId}`, {
      notaTutor:          Number(nota),
      observacionesTutor: observaciones ?? null,
    })
    return data
  },
}

// ── Constantes UI ──────────────────────────────────────────────────────────────

export const ESTADO_PRACTICA_LABEL_TUTOR = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio', bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'En vinculación',   bg: '#e6f0fb', color: '#0B416B' },
  VINCULADA:                 { label: 'Convenio',         bg: '#f3e8ff', color: '#6d28d9' },
  EN_PRACTICA:               { label: 'En práctica',      bg: '#eaf7f0', color: '#1a7a4a' },
  COMPLETADA:                { label: 'Completada',       bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',        bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',        bg: '#fef0f0', color: '#c0392b' },
}