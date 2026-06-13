import api from '@/lib/axios'

export const estudiantesApi = {

  getEstudiantes: async () => {
    const { data } = await api.get('/estudiantes')
    return data
  },

  getEstudiantesPorPrograma: async (programaId) => {
    const { data } = await api.get(`/estudiantes/programa/${programaId}`)
    return data
  },

  getEstudianteById: async (id) => {
    const { data } = await api.get(`/estudiantes/${id}`)
    return data
  },

  crearEstudiante: async (data) => {
    const { data: res } = await api.post('/estudiantes', {
      identificacion:     data.identificacion,
      tipoIdentificacion: data.tipoIdentificacion,
      nombre:             data.nombre,
      email:              data.email,
      telefono:           data.telefono,
      contactoEmergencia: data.contactoEmergencia,
      programaId:         data.programaId,
      semestre:           data.semestre,
      creditosAprobados:  data.creditosAprobados,
      promedioAcumulado:  data.promedioAcumulado,
    })
    return res
  },

  editarEstudiante: async (id, data) => {
    const { data: res } = await api.put(`/estudiantes/${id}`, data)
    return res
  },

  desactivarEstudiante: async (id) => {
    await api.delete(`/estudiantes/${id}`)
    return { id, activo: false }
  },

  activarEstudiante: async (id) => {
    await api.patch(`/estudiantes/${id}/activar`)
    return { id, activo: true }
  },

  /**
   * Carga masiva — envía el archivo Excel directo (multipart),
   * el backend lo parsea con Apache POI.
   */
  cargaMasivaEstudiantes: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/estudiantes/masivo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
    // Retorna List<EstudianteResponse> de los creados exitosamente.
    // Las filas con error simplemente se omiten (quedan logueadas en
    // el backend con Logger.WARNING) — no se retorna detalle de errores.
  },
}