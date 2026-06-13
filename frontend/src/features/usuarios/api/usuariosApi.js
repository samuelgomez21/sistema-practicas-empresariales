import api from '@/lib/axios'

export const usuariosApi = {

  getUsuarios: async () => {
    const { data } = await api.get('/usuarios')
    return data
  },

  getUsuarioById: async (id) => {
    const { data } = await api.get(`/usuarios/${id}`)
    return data
  },

  crearUsuario: async (data) => {
    const { data: res } = await api.post('/usuarios', {
      nombre: data.nombre,
      email:  data.email,
      rol:    data.rol,
      activo: true,
      // password: no se envía — el backend la genera y la envía por correo
    })
    return res
  },

  actualizarUsuario: async (id, data) => {
    const { data: res } = await api.put(`/usuarios/${id}`, {
      nombre: data.nombre,
      email:  data.email,
      rol:    data.rol,
      activo: data.activo,
    })
    return res
  },

  desactivarUsuario: async (id) => {
    await api.delete(`/usuarios/${id}`)
    return { id, activo: false }
  },

  activarUsuario: async (id) => {
    const { data } = await api.patch(`/usuarios/${id}/activar`)
    return data
  },

  // ── Programas asignados a coordinadores ───────────────────────────
  getProgramasDeCoordinador: async (usuarioId) => {
    const { data } = await api.get(`/usuarios/${usuarioId}/programas`)
    return data
    // [{ id, nombre }]  — ProgramaResumenDto
  },

  asignarProgramas: async (usuarioId, programaIds) => {
    await api.put(`/usuarios/${usuarioId}/programas`, { programaIds })
  },

  // ── Docentes asesores ──────────────────────────────────────────────
  // El backend no tiene un endpoint dedicado /usuarios?rol=, así que
  // se filtra en frontend a partir del listado completo.
  getDocentes: async () => {
    const { data } = await api.get('/usuarios')
    return data
      .filter(u => u.rol === 'DOCENTE_ASESOR')
      .map(u => ({
        id: u.id,
        nombre: u.nombre,
        correo: u.email,
        telefono: '—', // el backend no expone teléfono en UsuarioDto
        activo: u.activo,
      }))
  },

  crearDocente: async (data) => {
    const { data: res } = await api.post('/usuarios', {
      nombre: data.nombre,
      email:  data.email,
      rol:    'DOCENTE_ASESOR',
      activo: true,
    })
    return res
  },

  actualizarDocente: async (id, data) => {
    const { data: res } = await api.put(`/usuarios/${id}`, {
      nombre: data.nombre,
      email:  data.email,
      rol:    'DOCENTE_ASESOR',
      activo: data.activo,
    })
    return res
  },

  toggleDocente: async (id, activoActual) => {
    if (activoActual) {
      await api.delete(`/usuarios/${id}`)
      return { id, activo: false }
    }
    await api.patch(`/usuarios/${id}/activar`)
    return { id, activo: true }
  },
}