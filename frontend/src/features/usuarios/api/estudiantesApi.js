import api from '@/lib/axios'

export const estudiantesApi = {
  // Combina /estudiantes (datos académicos) con /estudiantes/clasificacion
  // (numeroPractica, docente, empresa) para tener todo en un solo objeto.
  getEstudiantes: async () => {
    const [{ data: lista }, { data: clasif }] = await Promise.all([
      api.get('/estudiantes'),
      api.get('/estudiantes/clasificacion'),
    ])

    const clasifMap = new Map(clasif.map(c => [c.id, c]))

    return lista.map(e => {
      const c = clasifMap.get(e.id)
      return {
        id: e.id,
        nombre: e.nombre,
        email: e.email,
        documento: e.identificacion,
        tipoIdentificacion: e.tipoIdentificacion,
        telefono: e.telefono,
        contactoEmergencia: e.contactoEmergencia,
        programaId: e.programaId,
        nombrePrograma: e.nombrePrograma,
        nombreFacultad: e.nombreFacultad,
        semestre: e.semestre,
        creditosAprobados: e.creditosAprobados,
        promedioAcumulado: Number(e.promedioAcumulado ?? 0),
        estadoAptitud: e.estadoAptitud,
        estadoPractica: e.estadoPractica,
        activo: e.activo,
        numeroPractica: c?.numeroPractica ?? null,
        docenteId: c?.docenteId ?? null,
        docenteNombre: c?.docenteNombre ?? null,
        empresaNombre: c?.empresaNombre ?? null,
        practicaId: c?.practicaId ?? null,
      }
    })
  },

  crearEstudiante: async (data) => {
    const { data: res } = await api.post('/estudiantes', {
      nombre: data.nombre,
      email: data.email,
      tipoIdentificacion: data.tipoIdentificacion,
      identificacion: data.identificacion,
      telefono: data.telefono,
      contactoEmergencia: data.contactoEmergencia,
      programaId: Number(data.programaId),
      semestre: Number(data.semestre),
      creditosAprobados: Number(data.creditosAprobados),
      promedioAcumulado: Number(data.promedioAcumulado),
    })
    return res
  },

  actualizarEstudiante: async (id, data) => {
    const { data: res } = await api.put(`/estudiantes/${id}`, {
      telefono: data.telefono,
      contactoEmergencia: data.contactoEmergencia,
      semestre: data.semestre != null ? Number(data.semestre) : undefined,
      creditosAprobados: data.creditosAprobados != null ? Number(data.creditosAprobados) : undefined,
      promedioAcumulado: data.promedioAcumulado != null ? Number(data.promedioAcumulado) : undefined,
    })
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

  cargaMasivaEstudiantes: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/estudiantes/masivo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
    // [EstudianteResponse, ...] — creados exitosamente
  },
}