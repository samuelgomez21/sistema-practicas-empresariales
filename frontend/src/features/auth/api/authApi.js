import api from '@/lib/axios'

/**
 * API de autenticación.
 * Todos los endpoints corresponden al backend Spring Boot /api/auth/*
 */
export const authApi = {
  login: (data) =>
    api.post('/auth/login', data).then((r) => r.data),

  cambiarPassword: (data) =>
    api.post('/auth/cambiar-password', data).then((r) => r.data),

  solicitarCodigo: (correo) =>
    api.post('/auth/recuperar-password/solicitar', { correo }).then((r) => r.data),

  verificarCodigo: (data) =>
    api.post('/auth/recuperar-password/verificar', data).then((r) => r.data),

  restablecerPassword: (data) =>
    api.post('/auth/recuperar-password/restablecer', data).then((r) => r.data),
}