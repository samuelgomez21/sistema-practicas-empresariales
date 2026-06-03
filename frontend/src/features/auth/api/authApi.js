import api from '@/lib/axios'

// ─────────────────────────────────────────────────────────────────────────
// MOCK — Eliminar cuando el backend esté disponible
// Simula la respuesta del endpoint POST /auth/login
// ─────────────────────────────────────────────────────────────────────────
const USUARIOS_MOCK = {
  'admin@uah.edu.co':        { id: 1, nombre: 'Administrador UAH',       rol: 'ADMINISTRADOR',          requiereCambioPassword: false },
  'academica@uah.edu.co':    { id: 2, nombre: 'Coord. Académica',         rol: 'COORDINACION_ACADEMICA', requiereCambioPassword: false },
  'coordinador@uah.edu.co':  { id: 3, nombre: 'Coord. de Práctica',       rol: 'COORDINADOR_PRACTICA',   requiereCambioPassword: false },
  'secretaria@uah.edu.co':   { id: 4, nombre: 'Secretaria Empresarial',   rol: 'SECRETARIA',             requiereCambioPassword: false },
  'docente@uah.edu.co':      { id: 5, nombre: 'Dr. Ramírez',              rol: 'DOCENTE_ASESOR',         requiereCambioPassword: false },
  'empresa@uah.edu.co':      { id: 6, nombre: 'TechCo S.A.',              rol: 'EMPRESA',                requiereCambioPassword: false },
  'tutor@uah.edu.co':        { id: 7, nombre: 'Ing. Vargas',              rol: 'TUTOR_EMPRESARIAL',      requiereCambioPassword: false },
  'estudiante@uah.edu.co':   { id: 8, nombre: 'Carlos Mendoza',           rol: 'ESTUDIANTE',             requiereCambioPassword: false },
  'direccion@uah.edu.co':    { id: 9, nombre: 'Dirección Académica',      rol: 'DIRECCION',              requiereCambioPassword: false },
  'nuevo@uah.edu.co':        { id: 10, nombre: 'Usuario Nuevo',           rol: 'ESTUDIANTE',             requiereCambioPassword: true  },
}

const loginMock = ({ correo, password }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USUARIOS_MOCK[correo]
      if (user && password === '123456') {
        resolve({ token: 'mock-token-' + user.rol, user })
      } else {
        reject({ response: { data: { mensaje: 'Credenciales incorrectas. Usa contraseña: 123456' } } })
      }
    }, 600) // simula latencia de red
  })

  
/**
 * API de autenticación.
 * Todos los endpoints corresponden al backend Spring Boot /api/auth/*
 */
export const authApi = {
  /* login: (data) =>
    api.post('/auth/login', data).then((r) => r.data), */
  login: loginMock, // Usar esta línea para mockear el login 

  cambiarPassword: (data) =>
    api.post('/auth/cambiar-password', data).then((r) => r.data),

  solicitarCodigo: (correo) =>
    api.post('/auth/recuperar-password/solicitar', { correo }).then((r) => r.data),

  verificarCodigo: (data) =>
    api.post('/auth/recuperar-password/verificar', data).then((r) => r.data),

  restablecerPassword: (data) =>
    api.post('/auth/recuperar-password/restablecer', data).then((r) => r.data),
}