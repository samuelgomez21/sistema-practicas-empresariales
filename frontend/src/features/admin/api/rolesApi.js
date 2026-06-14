import api from '@/lib/axios'

export const rolesApi = {
  getRoles: async () => {
    const { data } = await api.get('/roles')
    return data
    // [{ id: 1, nombre: 'ADMINISTRADOR' }, ...]
  },
}

// Etiquetas legibles — solo presentación, no afecta el valor enviado al backend
export const ROL_LABEL = {
  ADMINISTRADOR:           'Administrador',
  COORDINADOR_PRACTICA:    'Coordinador Empresarial',
  SECRETARIA_COORDINACION: 'Secretaría',
  COORDINADOR_ACADEMICO:   'Coordinación Académica',
  ESTUDIANTE:              'Estudiante',
  DOCENTE_ASESOR:          'Docente Asesor',
  TUTOR_EMPRESARIAL:       'Tutor Empresarial',
  EMPRESA_VINCULADA:       'Empresa',
  DIRECCION:               'Direccion',
}

export function etiquetaRol(nombre) {
  return ROL_LABEL[nombre] ?? nombre
}