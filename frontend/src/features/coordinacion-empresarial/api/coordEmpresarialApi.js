import api from '@/lib/axios'

function mapEstudiante(e) {
  return { ...e, correo: e.email ?? e.correo }
}

function mapPostulacion(p) {
  return {
    ...p,
    vacanteTitulo: p.tituloVacante ?? p.vacanteTitulo,
    empresaNombre: p.empresaNombre ?? `Vacante: ${p.tituloVacante}`,
    estado: typeof p.estado === 'object' ? p.estado.name?.() : p.estado,
  }
}

function mapPractica(p) {
  return {
    ...p,
    numero:       p.numeroPractica ?? p.numero,
    periodo:      p.periodo ?? (p.fechaInicio ? p.fechaInicio.substring(0, 7) : '—'),
    empresaNombre: p.nombreEmpresa ?? p.empresaNombre ?? null,
  }
}

export const coordEmpresarialApi = {

  // ── Estudiantes filtrados por programas del coordinador ──────────
  getEstudiantesPorCoordinador: async () => {
    const res = await api.get('/estudiantes/por-coordinador')
    return (res.data ?? []).map(mapEstudiante)
  },

  // ── Seguimiento — compuesto desde el nuevo endpoint ─────────────
  getEstudiantesSeguimiento: async () => {
    const res = await api.get('/coordinacion-empresarial/seguimiento')
    return (res.data ?? []).map(e => ({
      ...mapEstudiante(e),
      postulaciones:      (e.postulaciones ?? []).map(mapPostulacion),
      historialPracticas: (e.historialPracticas ?? []).map(mapPractica),
      checklist:          e.checklist ?? [],
    }))
  },

  getEstudianteHistorial: async (id) => {
    const [estudianteRes, postulacionesRes, practicasRes] = await Promise.all([
      api.get(`/estudiantes/${id}`),
      api.get(`/postulaciones/estudiante/${id}`),
      api.get(`/estudiantes/${id}/practicas`),
    ])
    return {
      ...mapEstudiante(estudianteRes.data),
      postulaciones:      (postulacionesRes.data ?? []).map(mapPostulacion),
      historialPracticas: (practicasRes.data ?? []).map(mapPractica),
    }
  },

  // ── Prácticas activas ─────────────────────────────────────────────
  getPracticasActivas: async () => {
    const res = await api.get('/coordinacion-empresarial/practicas-activas')
    return res.data ?? []
  },

  // ── Postulaciones ─────────────────────────────────────────────────
  crearPostulacion: async ({ vacanteId, estudianteId, observaciones }) => {
    const res = await api.post('/postulaciones', { vacanteId, estudianteId, observaciones })
    return mapPostulacion(res.data)
  },

  actualizarEstadoPostulacion: async (postulacionId, nuevoEstado) => {
    const res = await api.put(`/postulaciones/${postulacionId}/estado`, { estado: nuevoEstado })
    return mapPostulacion(res.data)
  },

  getPostulacionesPorVacante: async (vacanteId) => {
    const res = await api.get(`/postulaciones/vacante/${vacanteId}`)
    return (res.data ?? []).map(mapPostulacion)
  },

  getPostulacionesPorEstudiante: async (estudianteId) => {
    const res = await api.get(`/postulaciones/estudiante/${estudianteId}`)
    return (res.data ?? []).map(mapPostulacion)
  },

  // ── Encuestas ─────────────────────────────────────────────────────
  getPlantillas: async () => {
    const res = await api.get('/encuestas/plantillas')
    return res.data ?? []
  },

  getPlantillaById: async (id) => {
    const res = await api.get(`/encuestas/plantillas/${id}`)
    return res.data
  },

  crearPlantilla: async (data) => {
    const res = await api.post('/encuestas/plantillas', data)
    return res.data
  },

  togglePlantilla: async (id) => {
    await api.patch(`/encuestas/plantillas/${id}/toggle`)
  },

  crearSeccion: async (data) => {
    const res = await api.post('/encuestas/secciones', data)
    return res.data
  },

  eliminarSeccion: async (id) => {
    await api.delete(`/encuestas/secciones/${id}`)
  },

  agregarPregunta: async (seccionId, data) => {
    const res = await api.post(`/encuestas/secciones/${seccionId}/preguntas`, data)
    return res.data
  },

  editarPregunta: async (preguntaId, data) => {
    const res = await api.put(`/encuestas/preguntas/${preguntaId}`, data)
    return res.data
  },

  eliminarPregunta: async (preguntaId) => {
    await api.delete(`/encuestas/preguntas/${preguntaId}`)
  },

  // ── Contratos — pendiente de backend real ────────────────────────
  // Mientras el backend de contratos no exista, estas funciones
  // devuelven arrays vacíos para que las páginas no rompan.
  getEmpresasConSeleccionados: async () => {
    try {
      const res = await api.get('/contratos/empresas-disponibles')
      return res.data ?? []
    } catch {
      return []
    }
  },

  getContratos: async () => {
    try {
      const res = await api.get('/contratos')
      return (res.data ?? []).reverse()
    } catch {
      return []
    }
  },

  generarContrato: async (data) => {
    const res = await api.post('/contratos/generar', {
      estudianteId:  data.estudianteId,
      empresaNombre: data.empresaNombre,
      tipoContrato:  data.tipoContrato,
      fechaInicio:   data.fechaInicio,
      fechaFin:      data.fechaFin,
      valorMensual:  Number(data.valorMensual),
    })
    return res.data
  },

  // ── Visitas — pendiente de backend real ──────────────────────────
  getVisitas: async () => {
    try {
      const res = await api.get('/visitas')
      return (res.data ?? []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    } catch {
      return []
    }
  },

  getEmpresasActivas: async () => {
    const res = await api.get('/empresas')
    return (res.data ?? []).map(e => ({ id: e.id, razonSocial: e.razonSocial }))
  },

  crearVisita: async (data) => {
    const res = await api.post('/visitas', {
      empresaId:        data.empresaId,
      estudianteNombre: data.estudianteNombre || null,
      fecha:            data.fecha,
      duracionHoras:    data.duracionHoras,
      motivo:           data.motivo,
      observaciones:    data.observaciones,
    })
    return res.data
  },
}

export const MOTIVO_VISITA_LABEL = {
  VERIFICACION:        'Verificación de condiciones',
  SEGUIMIENTO:         'Seguimiento académico',
  RENOVACION_CONVENIO: 'Renovación de convenio',
  EVALUACION:          'Evaluación intermedia',
  OTRO:                'Otro',
}

export const ESTADO_POSTULACION_LABEL = {
  POSTULADO:     { label: 'Postulado',    bg: '#e6f0fb', color: '#0B416B' },
  EN_SELECCION:  { label: 'En selección', bg: '#f3e8ff', color: '#6d28d9' },
  EN_ENTREVISTA: { label: 'En entrevista',bg: '#fff8e6', color: '#a07010' },
  SELECCIONADO:  { label: 'Seleccionado', bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADO:     { label: 'Rechazado',    bg: '#fef0f0', color: '#c0392b' },
}