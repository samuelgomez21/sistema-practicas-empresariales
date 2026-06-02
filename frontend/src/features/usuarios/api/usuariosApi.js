import api from '@/lib/axios'

// ─────────────────────────────────────────────────────────────────────────
// MOCK
// ─────────────────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

let nextId = 200

const db = {
  coordinadores: [
    { id: 1, nombre: 'María Valencia',    correo: 'coord.soft@uah.edu.co',  rol: 'COORDINACION_ACADEMICA', programas: ['Ingeniería de Software'],                         activo: true  },
    { id: 2, nombre: 'Jorge Salcedo',     correo: 'coord.ind@uah.edu.co',   rol: 'COORDINACION_ACADEMICA', programas: ['Ingeniería Industrial', 'Turismo'],               activo: true  },
    { id: 3, nombre: 'Patricia Morales',  correo: 'coord.admon@uah.edu.co', rol: 'COORDINACION_ACADEMICA', programas: ['Administración de Empresas'],                     activo: true  },
    { id: 4, nombre: 'Luis Hernández',    correo: 'coord.prac@uah.edu.co',  rol: 'COORDINADOR_PRACTICA',   programas: ['Ingeniería de Software', 'Ingeniería Industrial'], activo: true  },
    { id: 5, nombre: 'Secretaria UAH',    correo: 'secretaria@uah.edu.co',  rol: 'SECRETARIA',             programas: [],                                                  activo: false },
  ],
  estudiantes: [
    { id: 101, nombre: 'Carlos Mendoza',  documento: '1046527082', tipoDocumento: 'CC', correo: 'c.mendoza@uah.edu.co',  telefono: '3001234567', contactoEmergencia: 'Rosa Mendoza - 3009876543', programa: 'Ingeniería de Software',     creditosAprobados: 148, promedioAcumulado: 4.1, estadoAptitud: 'APTO',        semestre: 8, numeroPractica: 1, activo: true  },
    { id: 102, nombre: 'Ana Ríos',        documento: '1032415678', tipoDocumento: 'CC', correo: 'a.rios@uah.edu.co',     telefono: '3112345678', contactoEmergencia: 'Mario Ríos - 3118765432',   programa: 'Administración de Empresas', creditosAprobados: 120, promedioAcumulado: 3.8, estadoAptitud: 'EN_REVISION', semestre: 7, numeroPractica: 1, activo: true  },
    { id: 103, nombre: 'Pedro Lozano',    documento: '1098234567', tipoDocumento: 'CC', correo: 'p.lozano@uah.edu.co',   telefono: '3209876543', contactoEmergencia: 'Clara Lozano - 3201234567', programa: 'Ingeniería Industrial',      creditosAprobados: 135, promedioAcumulado: 2.9, estadoAptitud: 'NO_APTO',    semestre: 8, numeroPractica: 1, activo: true  },
    { id: 104, nombre: 'Laura García',    documento: '1051234567', tipoDocumento: 'CC', correo: 'l.garcia@uah.edu.co',   telefono: '3156789012', contactoEmergencia: 'Julio García - 3151234567',  programa: 'Turismo',                    creditosAprobados: 98,  promedioAcumulado: 3.5, estadoAptitud: 'SIN_EVALUAR', semestre: 6, numeroPractica: 1, activo: true  },
    { id: 105, nombre: 'Sofía Torres',    documento: '1067890123', tipoDocumento: 'CC', correo: 's.torres@uah.edu.co',   telefono: '3023456789', contactoEmergencia: 'Luis Torres - 3027654321',   programa: 'Ingeniería de Software',     creditosAprobados: 152, promedioAcumulado: 4.5, estadoAptitud: 'APTO',        semestre: 8, numeroPractica: 2, activo: true  },
  ],
  docentes: [
    { id: 201, nombre: 'Dr. Ramírez',      correo: 'ramirez@uah.edu.co',     telefono: '3001112233', activo: true  },
    { id: 202, nombre: 'Mg. Castellanos',  correo: 'castellanos@uah.edu.co', telefono: '3004445566', activo: true  },
    { id: 203, nombre: 'Ing. Torres',      correo: 'i.torres@uah.edu.co',    telefono: '3007778899', activo: false },
  ],
}

// Programas que puede ver cada coordinador académico según su correo (simulando scope)
const SCOPE_COORDINADOR = {
  'coord.soft@uah.edu.co':  ['Ingeniería de Software'],
  'coord.ind@uah.edu.co':   ['Ingeniería Industrial', 'Turismo'],
  'coord.admon@uah.edu.co': ['Administración de Empresas'],
}

// ─────────────────────────────────────────────────────────────────────────
// FIN MOCK
// ─────────────────────────────────────────────────────────────────────────

export const usuariosApi = {

  // ── Coordinadores (solo ADMIN) ────────────────────────────────────────
  getCoordinadores: async () => {
    await delay()
    return db.coordinadores
    // return api.get('/usuarios/coordinadores').then(r => r.data)
  },

  crearCoordinador: async (data) => {
    await delay()
    const nuevo = { ...data, id: ++nextId, activo: true }
    db.coordinadores.push(nuevo)
    return nuevo
    // return api.post('/usuarios/coordinadores', data).then(r => r.data)
  },

  editarCoordinador: async (id, data) => {
    await delay()
    const idx = db.coordinadores.findIndex(c => c.id === id)
    db.coordinadores[idx] = { ...db.coordinadores[idx], ...data }
    return db.coordinadores[idx]
    // return api.put(`/usuarios/coordinadores/${id}`, data).then(r => r.data)
  },

  toggleCoordinador: async (id) => {
    await delay()
    const c = db.coordinadores.find(c => c.id === id)
    c.activo = !c.activo
    return c
    // return api.patch(`/usuarios/coordinadores/${id}/toggle`).then(r => r.data)
  },

  // ── Estudiantes ───────────────────────────────────────────────────────
  getEstudiantes: async ({ programas } = {}) => {
    await delay()
    if (programas?.length) {
      return db.estudiantes.filter(e => programas.includes(e.programa))
    }
    return db.estudiantes
    // return api.get('/usuarios/estudiantes', { params: { programas } }).then(r => r.data)
  },

  getEstudianteById: async (id) => {
    await delay()
    return db.estudiantes.find(e => e.id === Number(id)) ?? null
    // return api.get(`/usuarios/estudiantes/${id}`).then(r => r.data)
  },

  crearEstudiante: async (data) => {
    await delay()
    // Validar documento único
    if (db.estudiantes.some(e => e.documento === data.documento)) {
      throw { response: { data: { mensaje: `El documento ${data.documento} ya está registrado en el sistema.` } } }
    }
    const nuevo = { ...data, id: ++nextId, estadoAptitud: 'SIN_EVALUAR', activo: true }
    db.estudiantes.push(nuevo)
    return nuevo
    // return api.post('/usuarios/estudiantes', data).then(r => r.data)
  },

  editarEstudiante: async (id, data) => {
    await delay()
    const idx = db.estudiantes.findIndex(e => e.id === id)
    db.estudiantes[idx] = { ...db.estudiantes[idx], ...data }
    return db.estudiantes[idx]
    // return api.put(`/usuarios/estudiantes/${id}`, data).then(r => r.data)
  },

  toggleEstudiante: async (id) => {
    await delay()
    const e = db.estudiantes.find(e => e.id === id)
    e.activo = !e.activo
    return e
    // return api.patch(`/usuarios/estudiantes/${id}/toggle`).then(r => r.data)
  },

  /**
   * Carga masiva desde Excel.
   * Recibe array de objetos parseados del archivo.
   * Retorna { exitosos, errores: [{ fila, motivo }] }
   */
  cargaMasivaEstudiantes: async (filas) => {
    await delay(800)
    const errores = []
    const exitosos = []
    filas.forEach((fila, i) => {
      if (db.estudiantes.some(e => e.documento === fila.documento)) {
        errores.push({ fila: i + 2, motivo: `Documento ${fila.documento} ya existe` })
      } else {
        const nuevo = { ...fila, id: ++nextId, estadoAptitud: 'SIN_EVALUAR', activo: true }
        db.estudiantes.push(nuevo)
        exitosos.push(nuevo)
      }
    })
    return { exitosos: exitosos.length, errores }
    // return api.post('/usuarios/estudiantes/carga-masiva', { filas }).then(r => r.data)
  },

  // ── Docentes asesores ────────────────────────────────────────────────
  getDocentes: async () => {
    await delay()
    return db.docentes
    // return api.get('/usuarios/docentes').then(r => r.data)
  },

  crearDocente: async (data) => {
    await delay()
    const nuevo = { ...data, id: ++nextId, activo: true }
    db.docentes.push(nuevo)
    return nuevo
    // return api.post('/usuarios/docentes', data).then(r => r.data)
  },

  editarDocente: async (id, data) => {
    await delay()
    const idx = db.docentes.findIndex(d => d.id === id)
    db.docentes[idx] = { ...db.docentes[idx], ...data }
    return db.docentes[idx]
    // return api.put(`/usuarios/docentes/${id}`, data).then(r => r.data)
  },

  toggleDocente: async (id) => {
    await delay()
    const d = db.docentes.find(d => d.id === id)
    d.activo = !d.activo
    return d
    // return api.patch(`/usuarios/docentes/${id}/toggle`).then(r => r.data)
  },
}