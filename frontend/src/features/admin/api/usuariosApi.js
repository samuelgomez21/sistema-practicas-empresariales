import api from '@/lib/axios'
import { etiquetaRol } from '../api/rolesApi'

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
    // DELETE = soft delete según UsuarioController
  },

  activarUsuario: async (id) => {
    const { data } = await api.patch(`/usuarios/${id}/activar`)
    return data
    // Endpoint pendiente en backend — el front asume que existe
  },
}
