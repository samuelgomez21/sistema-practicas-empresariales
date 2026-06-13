import api from '@/lib/axios'

export const bitacoraApi = {
  getRegistros: async () => {
    const { data } = await api.get('/bitacora')
    return data
    // [{ id, fechaRegistro, usuarioEmail, accion, modulo, detalles, ipAddress }]
  },
}

export const ACCION_LABEL = {
  CREAR:       { label: 'Creación',      bg: '#eaf7f0', color: '#1a7a4a' },
  ACTUALIZAR:  { label: 'Actualización', bg: '#e6f0fb', color: '#0B416B' },
  ELIMINAR:    { label: 'Eliminación',   bg: '#fef0f0', color: '#c0392b' },
  DESACTIVAR:  { label: 'Desactivación', bg: '#fef0f0', color: '#c0392b' },
  APROBAR:     { label: 'Aprobación',    bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZAR:    { label: 'Rechazo',       bg: '#fef0f0', color: '#c0392b' },
  EJECUTAR:    { label: 'Ejecución',     bg: '#fff8e6', color: '#a07010' },
}

export const MODULO_LABEL = {
  USUARIOS:     'Usuarios',
  ESTUDIANTES:  'Estudiantes',
  PRACTICAS:    'Prácticas',
  VACANTES:     'Vacantes',
  POSTULACIONES:'Postulaciones',
  AVANCES:      'Avances',
  CIERRE:       'Cierre',
  ENCUESTAS:    'Encuestas',
  EMPRESAS:     'Empresas',
  EVALUACIONES: 'Evaluaciones',
  FACULTADES:          'Facultades',
  PROGRAMAS:           'Programas',
  PARAMETROS_PROGRAMA: 'Parámetros de programa',
  CATALOGO_PRACTICAS:  'Catálogo de prácticas',  
}