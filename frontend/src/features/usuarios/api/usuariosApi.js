import api from '@/lib/axios'

const ROLES_COORDINACION = ['COORDINADOR_PRACTICA', 'COORDINADOR_ACADEMICO', 'SECRETARIA_COORDINACION']

export const usuariosApi = {

  // ── Internos ───────────────────────────────────────────────────
  getTodos: async () => {
    const { data } = await api.get('/usuarios')
    return data
  },

  // ── Coordinadores (filtra de /usuarios por rol) ────────────────
  getCoordinadores: async () => {
    const todos = await usuariosApi.getTodos()
    return todos.filter(u => ROLES_COORDINACION.includes(u.rol))
  },

  crearCoordinador: async (data) => {
    const { data: res } = await api.post('/usuarios', {
      nombre: data.nombre,
      email:  data.email,
      rol:    data.rol, // COORDINADOR_PRACTICA | COORDINADOR_ACADEMICO | SECRETARIA_COORDINACION
    })
    return res
  },

  editarCoordinador: async (id, data) => {
    const { data: res } = await api.put(`/usuarios/${id}`, data)
    return res
  },

  desactivarCoordinador: async (id) => {
    await api.delete(`/usuarios/${id}`)
    return { id, activo: false }
  },

  activarCoordinador: async (id) => {
    await api.patch(`/usuarios/${id}/activar`)
    return { id, activo: true }
  },

  // ── Programas asignados a un coordinador académico ─────────────
  getProgramasDeCoordinador: async (usuarioId) => {
    const { data } = await api.get(`/usuarios/${usuarioId}/programas`)
    return data
    // [{ id, nombre }]
  },

  asignarProgramas: async (usuarioId, programaIds) => {
    await api.put(`/usuarios/${usuarioId}/programas`, { programaIds })
  },

  // ── Docentes asesores ────────────────────────────────────────────
  getDocentes: async () => {
    const todos = await usuariosApi.getTodos()
    return todos.filter(u => u.rol === 'DOCENTE_ASESOR')
  },

  crearDocente: async (data) => {
    const { data: res } = await api.post('/usuarios', {
      nombre: data.nombre,
      email:  data.email,
      rol:    'DOCENTE_ASESOR',
    })
    return res
  },

  editarDocente: async (id, data) => {
    const { data: res } = await api.put(`/usuarios/${id}`, data)
    return res
  },

  desactivarDocente: async (id) => {
    await api.delete(`/usuarios/${id}`)
    return { id, activo: false }
  },

  activarDocente: async (id) => {
    await api.patch(`/usuarios/${id}/activar`)
    return { id, activo: true }
  },

  crearUsuario: async (data) => {
    const { data: res } = await api.post('/usuarios', {
      nombre: data.nombre,
      email:  data.email,
      rol:    data.rol,
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
}