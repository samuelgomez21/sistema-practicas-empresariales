import api from '@/lib/axios'

export const vacantesApi = {

  // ── Vacantes ──────────────────────────────────────────────────
  getVacantes: async () => {
    const { data } = await api.get('/vacantes')
    return data.map(normalizarVacante)
  },

  getVacantesPorEmpresa: async (empresaId) => {
    const { data } = await api.get(`/vacantes/empresa/${empresaId}`)
    return data.map(normalizarVacante)
  },

  getVacantesPendientes: async () => {
    const { data } = await api.get('/vacantes/pendientes')
    return data.map(normalizarVacante)
  },

  getVacanteById: async (id) => {
    const { data } = await api.get(`/vacantes/${id}`)
    return normalizarVacante(data)
  },

  crearVacante: async (data) => {
    const { data: res } = await api.post('/vacantes', {
      empresaId:       data.empresaId,
      titulo:          data.titulo,
      descripcion:     data.descripcion,
      perfilRequerido: data.perfilRequerido,
      requisitos:      data.requisitos || null,
      cuposTotales:    Number(data.cuposTotales),
      programaId:      data.programaId || null,
      modalidad:       data.modalidad,
      salario:         data.salario ? Number(data.salario) : null,
      tipoContrato:    data.tipoContrato,
      horario:         data.horario || null,
      habilidades:     data.habilidades || null, // string separado por comas
      semestreMinimo:  Number(data.semestreMinimo),
    })
    return normalizarVacante(res)
  },

  aprobarVacante: async (id) => {
    const { data } = await api.put(`/vacantes/${id}/aprobar`)
    return normalizarVacante(data)
  },

  rechazarVacante: async (id, motivo) => {
    const { data } = await api.put(`/vacantes/${id}/rechazar`, { motivo })
    return normalizarVacante(data)
  },

  cerrarVacante: async (id) => {
    const { data } = await api.put(`/vacantes/${id}/cerrar`)
    return normalizarVacante(data)
  },

  // ── Postulaciones ─────────────────────────────────────────────
  crearPostulacion: async (vacanteId, estudianteId, observaciones = '') => {
    const { data } = await api.post('/postulaciones', {
      vacanteId, estudianteId, observaciones,
    })
    return data
  },

  getPostulacionesPorVacante: async (vacanteId) => {
    const { data } = await api.get(`/postulaciones/vacante/${vacanteId}`)
    return data
    // [{ id, vacanteId, tituloVacante, estudianteId, nombreEstudiante, estado, fechaPostulacion, observaciones }]
  },

  actualizarEstadoPostulacion: async (postulacionId, estado) => {
    const { data } = await api.put(`/postulaciones/${postulacionId}/estado`, { estado })
    return data
  },

  getEstudiantesAptos: async () => {
    const { data } = await api.get('/estudiantes/aptos')
    return data
    // [{ id, nombre, nombrePrograma, semestre, ... }]
  },
}

// El backend devuelve `habilidades` como string separado por comas.
// Lo normalizamos a array para la UI.
function normalizarVacante(v) {
  return {
    ...v,
    empresaNombre:  v.nombreEmpresa,
    programaNombre: v.nombrePrograma,
    habilidades: typeof v.habilidades === 'string'
      ? v.habilidades.split(',').map(h => h.trim()).filter(Boolean)
      : (v.habilidades ?? []),
  }
}

export const MODALIDAD_LABEL = {
  PRESENCIAL: 'Presencial',
  REMOTA:     'Remota',
  HIBRIDA:    'Híbrida',
}

export const CONTRATO_LABEL = {
  CONTRATO_APRENDIZAJE: 'Contrato aprendizaje',
  PRACTICA:             'Práctica',
  OTRO:                 'Otro',
}

export const ESTADO_VACANTE = {
  PENDIENTE: { label: 'Pendiente aprobación', bg: '#fff8e6', color: '#a07010' },
  APROBADA:  { label: 'Aprobada',             bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADA: { label: 'Rechazada',            bg: '#fef0f0', color: '#c0392b' },
  CERRADA:   { label: 'Cerrada',              bg: '#f0f2f5', color: '#6b7a8d' },
}

export const ESTADO_POSTULACION = {
  POSTULADO:     { label: 'Postulado',                bg: '#e6f0fb', color: '#0B416B' },
  EN_SELECCION:  { label: 'En proceso de selección',  bg: '#f3e8ff', color: '#6d28d9' },
  EN_ENTREVISTA: { label: 'En entrevista',            bg: '#fff8e6', color: '#a07010' },
  SELECCIONADO:  { label: 'Seleccionado',             bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADO:     { label: 'Rechazado',                bg: '#fef0f0', color: '#c0392b' },
}