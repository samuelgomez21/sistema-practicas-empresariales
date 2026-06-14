import api from '@/lib/axios'

export const encuestasApi = {

  // ── Plantillas ────────────────────────────────────────────────────────────

  getPlantillas: async () => {
    try {
      const { data } = await api.get('/encuestas/plantillas')
      return data ?? []
    } catch {
      return []
    }
  },

  getPlantilla: async (tipo) => {
    try {
      const { data } = await api.get(`/encuestas/plantilla/${tipo}`)
      return data
    } catch {
      return null
    }
  },

  crearPlantilla: async ({ tipo, version, nombre }) => {
    const { data } = await api.post('/encuestas/plantillas', { tipo, version, nombre })
    return data
  },

  togglePlantilla: async (id) => {
    await api.patch(`/encuestas/plantillas/${id}/toggle`)
  },

  // ── Secciones ─────────────────────────────────────────────────────────────

  crearSeccion: async ({ plantillaId, codigo, titulo, orden }) => {
    const { data } = await api.post('/encuestas/secciones', {
      plantillaId, codigo, titulo, orden,
    })
    return data
  },

  eliminarSeccion: async (seccionId) => {
    await api.delete(`/encuestas/secciones/${seccionId}`)
  },

  // ── Preguntas ─────────────────────────────────────────────────────────────

  agregarPregunta: async (seccionId, { texto, tipo = 'ESCALA' }) => {
    const { data } = await api.post(`/encuestas/secciones/${seccionId}/preguntas`, {
      texto, tipo,
    })
    return data
  },

  editarPregunta: async (preguntaId, { texto, tipo }) => {
    const { data } = await api.put(`/encuestas/preguntas/${preguntaId}`, { texto, tipo })
    return data
  },

  desactivarPregunta: async (preguntaId) => {
    await api.delete(`/encuestas/preguntas/${preguntaId}`)
  },

  // ── Respuestas ────────────────────────────────────────────────────────────

  /**
   * Lista todas las respuestas — requiere endpoint GET /encuestas/respuestas en el backend.
   */
  getRespuestas: async () => {
    try {
      const { data } = await api.get('/encuestas/respuestas')
      return data ?? []
    } catch {
      return []
    }
  },

  getRespuestasPorTipo: async (tipo) => {
    try {
      const { data } = await api.get(`/encuestas/respuestas/tipo/${tipo}`)
      return data ?? []
    } catch {
      return []
    }
  },

  getRespuesta: async (practicaId, tipo) => {
    try {
      const { data } = await api.get(`/encuestas/practica/${practicaId}/tipo/${tipo}`)
      return data
    } catch {
      return null
    }
  },

  estaCompletada: async (practicaId, tipo) => {
    try {
      const { data } = await api.get(
        `/encuestas/practica/${practicaId}/tipo/${tipo}/completada`
      )
      return data?.completada ?? false
    } catch {
      return false
    }
  },
}