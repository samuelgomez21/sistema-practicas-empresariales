import api from '@/lib/axios'

// ─────────────────────────────────────────────────────────────────────────
// MOCK — Eliminar cuando el backend esté disponible
// ─────────────────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const db = {
  facultades: [
    {
      id: 1,
      nombre: 'Ingeniería',
      coordinador: 'Coord. Ing. Software',
      correoCoordinador: 'coord.ing@uah.edu.co',
      activa: true,
      programas: [1, 2],
    },
    {
      id: 2,
      nombre: 'Ciencias Empresariales',
      coordinador: 'Coord. Administración',
      correoCoordinador: 'coord.admon@uah.edu.co',
      activa: true,
      programas: [3, 4],
    },
  ],
  programas: [
    { id: 1, nombre: 'Ingeniería de Software',    facultadId: 1, activo: true,  numeroPracticas: 2, corteseguimiento: 4, notaMinima: 3.5 },
    { id: 2, nombre: 'Ingeniería Industrial',     facultadId: 1, activo: true,  numeroPracticas: 2, corteseguimiento: 4, notaMinima: 3.5 },
    { id: 3, nombre: 'Administración de Empresas',facultadId: 2, activo: true,  numeroPracticas: 1, corteseguimiento: 3, notaMinima: 3.0 },
    { id: 4, nombre: 'Turismo',                   facultadId: 2, activo: true,  numeroPracticas: 1, corteseguimiento: 3, notaMinima: 3.0 },
  ],
  catalogoPracticas: [
    { id: 1, nombre: 'Práctica I',  programaId: 1, materiaNucleo: 'Proyecto de Grado I',  descripcion: 'Desarrollo de software bajo supervisión empresarial', activa: true,  practicasActivas: 12 },
    { id: 2, nombre: 'Práctica II', programaId: 1, materiaNucleo: 'Proyecto de Grado II', descripcion: 'Liderazgo de proyectos de software en empresa',     activa: true,  practicasActivas: 8  },
    { id: 3, nombre: 'Práctica I',  programaId: 2, materiaNucleo: 'Práctica Empresarial', descripcion: 'Procesos industriales y mejora continua',           activa: true,  practicasActivas: 5  },
    { id: 4, nombre: 'Práctica I',  programaId: 3, materiaNucleo: 'Práctica Gerencial',   descripcion: 'Gestión administrativa y empresarial',              activa: false, practicasActivas: 0  },
  ],
  plantillasCorreo: [
    { id: 1, nombre: 'Bienvenida al sistema',         evento: 'REGISTRO_USUARIO',      activa: true,  variables: ['{{nombre}}', '{{correo}}', '{{password_temporal}}'] },
    { id: 2, nombre: 'Notificación de asignación',    evento: 'ASIGNACION_EMPRESA',    activa: true,  variables: ['{{nombre_estudiante}}', '{{empresa}}', '{{fecha}}'] },
    { id: 3, nombre: 'Cambio de estado práctica',     evento: 'CAMBIO_ESTADO',         activa: true,  variables: ['{{nombre}}', '{{estado_anterior}}', '{{estado_nuevo}}'] },
    { id: 4, nombre: 'Encuesta de satisfacción',      evento: 'ENCUESTA_PENDIENTE',    activa: false, variables: ['{{nombre}}', '{{enlace_encuesta}}'] },
    { id: 5, nombre: 'Recordatorio de documentos',    evento: 'DOCUMENTOS_PENDIENTES', activa: true,  variables: ['{{nombre}}', '{{documentos_faltantes}}'] },
  ],
  catalogosMaestros: {
    tiposContrato:    [{ id: 1, nombre: 'Contrato de aprendizaje', activo: true }, { id: 2, nombre: 'Convenio de práctica', activo: true }, { id: 3, nombre: 'Contrato laboral', activo: false }],
    sectoresEmpresa:  [{ id: 1, nombre: 'Tecnología', activo: true }, { id: 2, nombre: 'Finanzas', activo: true }, { id: 3, nombre: 'Turismo', activo: true }, { id: 4, nombre: 'Manufactura', activo: true }],
    tiposDocumento:   [{ id: 1, nombre: 'Cédula de ciudadanía', activo: true }, { id: 2, nombre: 'Tarjeta de identidad', activo: true }, { id: 3, nombre: 'Pasaporte', activo: true }],
    estadosPractica:  [{ id: 1, nombre: 'Pendiente empresa', activo: true }, { id: 2, nombre: 'Asignada', activo: true }, { id: 3, nombre: 'En curso', activo: true }, { id: 4, nombre: 'Cerrada', activo: true }],
  },
}

// ── Helpers internos ──────────────────────────────────────────────────────
let nextId = 100
const newId = () => ++nextId

// ─────────────────────────────────────────────────────────────────────────
// FIN MOCK
// ─────────────────────────────────────────────────────────────────────────

export const configuracionApi = {

  // ── Facultades ───────────────────────────────────────────────────────
  getFacultades: async () => {
    await delay()
    return db.facultades
    // return api.get('/configuracion/facultades').then(r => r.data)
  },

  crearFacultad: async (data) => {
    await delay()
    const nueva = { ...data, id: newId(), activa: true, programas: [] }
    db.facultades.push(nueva)
    return nueva
    // return api.post('/configuracion/facultades', data).then(r => r.data)
  },

  editarFacultad: async (id, data) => {
    await delay()
    const idx = db.facultades.findIndex(f => f.id === id)
    db.facultades[idx] = { ...db.facultades[idx], ...data }
    return db.facultades[idx]
    // return api.put(`/configuracion/facultades/${id}`, data).then(r => r.data)
  },

  toggleFacultad: async (id) => {
    await delay()
    const f = db.facultades.find(f => f.id === id)
    // Regla: verificar si tiene programas con prácticas activas
    const tienePracticasActivas = db.catalogoPracticas.some(
      cp => db.programas.find(p => p.facultadId === id && p.id === cp.programaId) && cp.practicasActivas > 0
    )
    if (f.activa && tienePracticasActivas) {
      throw { response: { data: { mensaje: 'No se puede desactivar: existen prácticas activas vinculadas a esta facultad.' } } }
    }
    f.activa = !f.activa
    return f
    // return api.patch(`/configuracion/facultades/${id}/toggle`).then(r => r.data)
  },

  // ── Programas ────────────────────────────────────────────────────────
  getProgramas: async (facultadId) => {
    await delay()
    return facultadId
      ? db.programas.filter(p => p.facultadId === facultadId)
      : db.programas
    // return api.get('/configuracion/programas', { params: { facultadId } }).then(r => r.data)
  },

  crearPrograma: async (data) => {
    await delay()
    const nuevo = { ...data, id: newId(), activo: true }
    db.programas.push(nuevo)
    return nuevo
    // return api.post('/configuracion/programas', data).then(r => r.data)
  },

  editarPrograma: async (id, data) => {
    await delay()
    const idx = db.programas.findIndex(p => p.id === id)
    db.programas[idx] = { ...db.programas[idx], ...data }
    return db.programas[idx]
    // return api.put(`/configuracion/programas/${id}`, data).then(r => r.data)
  },

  // ── Catálogo de prácticas ────────────────────────────────────────────
  getCatalogoPracticas: async (programaId) => {
    await delay()
    return programaId
      ? db.catalogoPracticas.filter(c => c.programaId === programaId)
      : db.catalogoPracticas
    // return api.get('/configuracion/catalogo-practicas', { params: { programaId } }).then(r => r.data)
  },

  crearCatalogoPractica: async (data) => {
    await delay()
    const nueva = { ...data, id: newId(), activa: true, practicasActivas: 0 }
    db.catalogoPracticas.push(nueva)
    return nueva
    // return api.post('/configuracion/catalogo-practicas', data).then(r => r.data)
  },

  editarCatalogoPractica: async (id, data) => {
    await delay()
    const cp = db.catalogoPracticas.find(c => c.id === id)
    // Protección de datos históricos: solo aplicará a futuras prácticas
    Object.assign(cp, data)
    return cp
    // return api.put(`/configuracion/catalogo-practicas/${id}`, data).then(r => r.data)
  },

  toggleCatalogoPractica: async (id) => {
    await delay()
    const cp = db.catalogoPracticas.find(c => c.id === id)
    // Restricción: no desactivar si tiene prácticas activas
    if (cp.activa && cp.practicasActivas > 0) {
      throw { response: { data: { mensaje: `No se puede desactivar: existen ${cp.practicasActivas} práctica(s) activa(s) vinculadas.` } } }
    }
    cp.activa = !cp.activa
    return cp
    // return api.patch(`/configuracion/catalogo-practicas/${id}/toggle`).then(r => r.data)
  },

  // ── Plantillas de correo ─────────────────────────────────────────────
  getPlantillas: async () => {
    await delay()
    return db.plantillasCorreo
    // return api.get('/configuracion/plantillas-correo').then(r => r.data)
  },

  editarPlantilla: async (id, data) => {
    await delay()
    const idx = db.plantillasCorreo.findIndex(p => p.id === id)
    db.plantillasCorreo[idx] = { ...db.plantillasCorreo[idx], ...data }
    return db.plantillasCorreo[idx]
    // return api.put(`/configuracion/plantillas-correo/${id}`, data).then(r => r.data)
  },

  togglePlantilla: async (id) => {
    await delay()
    const p = db.plantillasCorreo.find(p => p.id === id)
    p.activa = !p.activa
    return p
    // return api.patch(`/configuracion/plantillas-correo/${id}/toggle`).then(r => r.data)
  },

  // ── Catálogos maestros ───────────────────────────────────────────────
  getCatalogoMaestro: async (tipo) => {
    await delay()
    return db.catalogosMaestros[tipo] ?? []
    // return api.get(`/configuracion/catalogos/${tipo}`).then(r => r.data)
  },

  crearItemCatalogo: async (tipo, data) => {
    await delay()
    const item = { ...data, id: newId(), activo: true }
    db.catalogosMaestros[tipo].push(item)
    return item
    // return api.post(`/configuracion/catalogos/${tipo}`, data).then(r => r.data)
  },

  editarItemCatalogo: async (tipo, id, data) => {
    await delay()
    const idx = db.catalogosMaestros[tipo].findIndex(i => i.id === id)
    db.catalogosMaestros[tipo][idx] = { ...db.catalogosMaestros[tipo][idx], ...data }
    return db.catalogosMaestros[tipo][idx]
    // return api.put(`/configuracion/catalogos/${tipo}/${id}`, data).then(r => r.data)
  },

  toggleItemCatalogo: async (tipo, id) => {
    await delay()
    const item = db.catalogosMaestros[tipo].find(i => i.id === id)
    item.activo = !item.activo
    return item
    // return api.patch(`/configuracion/catalogos/${tipo}/${id}/toggle`).then(r => r.data)
  },
}