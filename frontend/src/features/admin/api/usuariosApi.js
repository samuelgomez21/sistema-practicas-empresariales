import api from '@/lib/axios'
import { ROLES } from '@/lib/roles'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))
let nextId = 100

const db = {
  usuarios: [
    { id: 1, nombre: 'Administrador del Sistema', email: 'admin@universidad.edu.co', rol: ROLES.ADMINISTRADOR, activo: true, debeCambiarPassword: false, fechaCreacion: '2025-01-01' },
    { id: 2, nombre: 'Coordinador Empresarial', email: 'coordinador@example.com', rol: ROLES.COORDINADOR_PRACTICA, activo: true, debeCambiarPassword: false, fechaCreacion: '2025-01-01' },
    { id: 3, nombre: 'Dr. Carlos Méndez', email: 'c.mendez@universidad.edu.co', rol: ROLES.DOCENTE_ASESOR, activo: true, debeCambiarPassword: true, fechaCreacion: '2025-02-10' },
    { id: 4, nombre: 'Coordinación Académica', email: 'coord.academica@universidad.edu.co', rol: ROLES.COORDINACION_ACADEMICA, activo: true, debeCambiarPassword: false, fechaCreacion: '2025-01-05' },
    { id: 5, nombre: 'Secretaría Coordinación', email: 'secretaria@universidad.edu.co', rol: ROLES.SECRETARIA, activo: true, debeCambiarPassword: false, fechaCreacion: '2025-01-15' },
    { id: 6, nombre: 'Dirección General', email: 'direccion@universidad.edu.co', rol: ROLES.DIRECCION, activo: true, debeCambiarPassword: false, fechaCreacion: '2025-01-01' },
    { id: 7, nombre: 'Carlos Ruiz', email: 'c.ruiz@techco.com', rol: ROLES.EMPRESA, activo: true, debeCambiarPassword: false, fechaCreacion: '2025-02-20' },
    { id: 8, nombre: 'Miguel Torres', email: 'm.torres@techcorp.com', rol: ROLES.TUTOR_EMPRESARIAL, activo: false, debeCambiarPassword: false, fechaCreacion: '2025-02-25' },
  ],
}

export const usuariosApi = {

  getUsuarios: async () => {
    await delay()
    return db.usuarios
    // return api.get('/usuarios').then(r => r.data)
  },

  getUsuarioById: async (id) => {
    await delay()
    return db.usuarios.find(u => u.id === Number(id)) ?? null
    // return api.get(`/usuarios/${id}`).then(r => r.data)
  },

  crearUsuario: async (data) => {
    await delay(600)
    const nuevo = {
      id: ++nextId,
      nombre: data.nombre,
      email:  data.email,
      rol:    data.rol,
      activo: true,
      debeCambiarPassword: true,
      fechaCreacion: new Date().toISOString().split('T')[0],
    }
    db.usuarios.push(nuevo)
    return nuevo
    // return api.post('/usuarios', data).then(r => r.data)
  },

  actualizarUsuario: async (id, data) => {
    await delay(600)
    const u = db.usuarios.find(u => u.id === Number(id))
    Object.assign(u, data)
    return u
    // return api.put(`/usuarios/${id}`, data).then(r => r.data)
  },

  toggleActivo: async (id) => {
    await delay()
    const u = db.usuarios.find(u => u.id === Number(id))
    u.activo = !u.activo
    return u
    // return api.delete(`/usuarios/${id}`).then(r => r.data)
    // Nota: el backend usa DELETE como soft-delete (toggle a inactivo).
    // Si se reactiva, podría requerir un endpoint adicional (PATCH activar).
  },

  forzarCambioPassword: async (id) => {
    await delay()
    const u = db.usuarios.find(u => u.id === Number(id))
    u.debeCambiarPassword = true
    return u
    // return api.patch(`/usuarios/${id}/forzar-cambio-password`).then(r => r.data)
    // Endpoint pendiente de implementar en backend
  },
}

export const ROL_LABEL = {
  ADMINISTRADOR:          'Administrador',
  COORDINACION_ACADEMICA: 'Coordinación Académica',
  COORDINADOR_PRACTICA:   'Coordinador Empresarial',
  SECRETARIA:             'Secretaría',
  DOCENTE_ASESOR:         'Docente Asesor',
  EMPRESA:                'Empresa',
  TUTOR_EMPRESARIAL:      'Tutor Empresarial',
  ESTUDIANTE:             'Estudiante',
  DIRECCION:              'Dirección',
}