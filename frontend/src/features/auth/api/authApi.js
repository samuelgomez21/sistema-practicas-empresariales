import api from '@/lib/axios'

/**
 * Autenticación de usuarios.
 * El backend retorna { token, user: { id, nombre, correo, rol, requiereCambioPassword } }
 */
export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', credentials).then((res) => res.data),

  cambiarPassword: (data) =>
    api.post('/auth/cambiar-password', data).then((res) => res.data),

  solicitarRecuperacion: (correo) =>
    api.post('/auth/recuperar-password', { correo }).then((res) => res.data),
}