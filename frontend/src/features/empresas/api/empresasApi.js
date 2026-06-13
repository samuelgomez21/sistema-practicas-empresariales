import api from '@/lib/axios'

export const empresasApi = {

  // ── Empresas ─────────────────────────────────────────────────────────
  getEmpresas: async () => {
    const { data } = await api.get('/empresas')
    return data
    // [{ id, nit, razonSocial, sectorEconomico, direccion, municipio, telefono,
    //    contactoPrincipalNombre, contactoPrincipalEmail, activo, fechaCreacion }]
  },

  getEmpresaById: async (id) => {
    const { data } = await api.get(`/empresas/${id}`)
    return data
  },

  // Perfil propio (rol EMPRESA_VINCULADA)
  getMiEmpresa: async () => {
    const { data } = await api.get('/empresas/mi-perfil')
    return data
  },

  crearEmpresa: async (data) => {
    const { data: res } = await api.post('/empresas', {
      nit:                     data.nit,
      razonSocial:             data.razonSocial,
      sectorEconomico:         data.sectorEconomico,
      direccion:               data.direccion,
      municipio:               data.municipio,
      telefono:                data.telefono,
      contactoPrincipalNombre: data.contactoPrincipalNombre,
      contactoPrincipalEmail:  data.contactoPrincipalEmail,
    })
    return res
  },

  editarEmpresa: async (id, data) => {
    const { data: res } = await api.put(`/empresas/${id}`, {
      razonSocial:             data.razonSocial,
      sectorEconomico:         data.sectorEconomico,
      direccion:               data.direccion,
      municipio:               data.municipio,
      telefono:                data.telefono,
      contactoPrincipalNombre: data.contactoPrincipalNombre,
      contactoPrincipalEmail:  data.contactoPrincipalEmail,
    })
    return res
  },

  desactivarEmpresa: async (id) => {
    await api.delete(`/empresas/${id}`)
    return { id, activo: false }
  },

  // ── Tutores ────────────────────────────────────────────────────────
  getTutoresByEmpresa: async (empresaId) => {
    const { data } = await api.get(`/empresas/${empresaId}/tutores`)
    return data
    // [{ id, nombre, correo, telefono, cargo, empresaId, fechaRegistro }]
  },

  getTodosLosTutores: async () => {
    const { data } = await api.get('/empresas/tutores/todos')
    return data
  },

  crearTutor: async (empresaId, data) => {
    const { data: res } = await api.post(`/empresas/${empresaId}/tutores`, {
      nombre:   data.nombre,
      correo:   data.correo,
      telefono: data.telefono,
      cargo:    data.cargo,
    })
    return res
  },

  editarTutor: async (id, data) => {
    const { data: res } = await api.put(`/empresas/tutores/${id}`, {
      nombre:   data.nombre,
      telefono: data.telefono,
      cargo:    data.cargo,
    })
    return res
  },

  toggleTutor: async (id, activoActual) => {
    if (activoActual) {
      await api.delete(`/empresas/tutores/${id}`)
      return { id, activo: false }
    }
    await api.patch(`/empresas/tutores/${id}/activar`)
    return { id, activo: true }
  },
}