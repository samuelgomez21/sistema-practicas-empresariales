import api from '@/lib/axios'



// Quita el prefijo ROLE_ 
function limpiarRol(rol) {
  return rol?.startsWith('ROLE_') ? rol.slice(5) : rol
}

export const authApi = {
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      return {
        token:  data.token,
        email:  data.email,
        nombre: data.nombre,
        rol:    limpiarRol(data.rol),
      }
    } catch (error) {
      const status  = error.response?.status
      const mensaje = error.response?.data?.message || ''

      if (mensaje.includes('DEBE_CAMBIAR_PASSWORD')) {
        const err = new Error('DEBE_CAMBIAR_PASSWORD')
        err.code = 'DEBE_CAMBIAR_PASSWORD'
        err.email = email
        err.currentPassword = password
        throw err
      }

      throw error
    }
  },
  cambiarPasswordInicial: async ({ email, currentPassword, newPassword }) => {
    await api.post('/auth/cambiar-password-inicial', {
      email, currentPassword, newPassword,
    })
  },

  solicitarRecuperacion: async (email) => {
    await api.post('/auth/recuperar-password', { email })
  },

  resetearPassword: async ({ token, newPassword }) => {
    await api.post('/auth/reset-password', { token, newPassword })
  },
}

