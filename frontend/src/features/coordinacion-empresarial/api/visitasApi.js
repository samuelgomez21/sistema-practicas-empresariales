import api from '@/lib/axios'

export const visitasApi = {

  // Coordinador — todas las visitas
  getTodas: async () => {
    try {
      const { data } = await api.get('/visitas')
      return data ?? []
    } catch { return [] }
  },

  // Docente o coordinador — solo las mías
  getMisVisitas: async () => {
    try {
      const { data } = await api.get('/visitas/mis-visitas')
      return data ?? []
    } catch { return [] }
  },

  // Por empresa
  getPorEmpresa: async (empresaId) => {
    try {
      const { data } = await api.get(`/visitas/empresa/${empresaId}`)
      return data ?? []
    } catch { return [] }
  },

  // Registrar
  registrar: async (payload) => {
    const { data } = await api.post('/visitas', payload)
    return data
  },

  // Eliminar
  eliminar: async (id) => {
    await api.delete(`/visitas/${id}`)
  },
}

// Motivos comunes predefinidos
export const MOTIVOS_FRECUENTES = [
  'Seguimiento de práctica',
  'Reunión con tutor empresarial',
  'Evaluación de condiciones laborales',
  'Revisión de avances del estudiante',
  'Firma de convenio',
  'Verificación de cumplimiento',
  'Visita de apertura',
  'Visita de cierre',
]