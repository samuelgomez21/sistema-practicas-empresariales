import api from '@/lib/axios'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

const db = {
  registros: [
    { id: 1, fechaRegistro: '2026-06-12T09:15:00', usuarioEmail: 'admin@universidad.edu.co', accion: 'CREAR', modulo: 'USUARIOS', detalles: 'Creó el usuario c.mendez@universidad.edu.co con rol DOCENTE_ASESOR', ipAddress: '192.168.1.10' },
    { id: 2, fechaRegistro: '2026-06-12T09:20:00', usuarioEmail: 'coordinador@example.com', accion: 'ACTUALIZAR', modulo: 'PRACTICAS', detalles: 'Asignó docente Dr. Carlos Méndez a la práctica #2 del estudiante Sebastián Romero', ipAddress: '192.168.1.22' },
    { id: 3, fechaRegistro: '2026-06-12T10:05:00', usuarioEmail: 'c.ruiz@techco.com', accion: 'CREAR', modulo: 'VACANTES', detalles: 'Creó la vacante "Practicante QA Tester"', ipAddress: '186.84.12.5' },
    { id: 4, fechaRegistro: '2026-06-12T10:30:00', usuarioEmail: 'coordinador@example.com', accion: 'APROBAR', modulo: 'VACANTES', detalles: 'Aprobó la vacante "Practicante Desarrollo Web" de TechCorp SAS', ipAddress: '192.168.1.22' },
    { id: 5, fechaRegistro: '2026-06-12T11:00:00', usuarioEmail: 'admin@universidad.edu.co', accion: 'DESACTIVAR', modulo: 'USUARIOS', detalles: 'Desactivó el usuario m.torres@techcorp.com', ipAddress: '192.168.1.10' },
    { id: 6, fechaRegistro: '2026-06-12T11:45:00', usuarioEmail: 's.romero@universidad.edu.co', accion: 'CREAR', modulo: 'AVANCES', detalles: 'Registró el avance "Avance semana 5"', ipAddress: '201.244.33.8' },
    { id: 7, fechaRegistro: '2026-06-12T12:10:00', usuarioEmail: 'coordinador@example.com', accion: 'EJECUTAR', modulo: 'CIERRE', detalles: 'Intentó ejecutar cierre de práctica #1 — faltan requisitos pendientes', ipAddress: '192.168.1.22' },
  ],
}

export const bitacoraApi = {
  getRegistros: async () => {
    await delay()
    return [...db.registros].sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
    // return api.get('/bitacora').then(r => r.data)
  },
}

export const ACCION_LABEL = {
  CREAR:       { label: 'Creación',     bg: '#eaf7f0', color: '#1a7a4a' },
  ACTUALIZAR:  { label: 'Actualización', bg: '#e6f0fb', color: '#0B416B' },
  ELIMINAR:    { label: 'Eliminación',  bg: '#fef0f0', color: '#c0392b' },
  DESACTIVAR:  { label: 'Desactivación', bg: '#fef0f0', color: '#c0392b' },
  APROBAR:     { label: 'Aprobación',   bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZAR:    { label: 'Rechazo',      bg: '#fef0f0', color: '#c0392b' },
  EJECUTAR:    { label: 'Ejecución',    bg: '#fff8e6', color: '#a07010' },
}

export const MODULO_LABEL = {
  USUARIOS:  'Usuarios',
  PRACTICAS: 'Prácticas',
  VACANTES:  'Vacantes',
  AVANCES:   'Avances',
  CIERRE:    'Cierre',
  ENCUESTAS: 'Encuestas',
  EMPRESAS:  'Empresas',
}