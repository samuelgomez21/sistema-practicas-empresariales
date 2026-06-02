import api from '@/lib/axios'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))
let nextId = 300

// ─────────────────────────────────────────────────────────────────────────
// MOCK
// ─────────────────────────────────────────────────────────────────────────
const db = {
  empresas: [
    {
      id: 1,
      razonSocial:       'Bancolombia S.A.',
      nit:               '890.903.938-8',
      sectorEconomico:   'Finanzas',
      direccion:         'Calle 50 # 51-66',
      municipio:         'Medellín',
      telefono:          '(604) 555-0101',
      nombreContacto:    'María López',
      emailContacto:     'm.lopez@bancolombia.com',
      correoAcceso:      'm.lopez@bancolombia.com',
      estado:            'HABILITADA',
      // Documentos
      camaraComercio:    { url: 'https://example.com/camara.pdf', fechaVigencia: '2025-07-15', validado: true },
      nit_doc:           { url: 'https://example.com/nit.pdf',    validado: true },
      cedulaRL:          { url: 'https://example.com/cedula.pdf', validado: true },
      // Convenio (sube la coordinadora)
      convenio:          { url: 'https://example.com/convenio.pdf', fechaInicio: '2023-03-01', fechaFin: '2028-03-01', validado: true },
      practicantesActivos: [101, 105],
    },
    {
      id: 2,
      razonSocial:       'TechCo S.A.S.',
      nit:               '901.234.567-1',
      sectorEconomico:   'Tecnología',
      direccion:         'Carrera 14 # 15-30',
      municipio:         'Armenia',
      telefono:          '(606) 555-0202',
      nombreContacto:    'Carlos Ruiz',
      emailContacto:     'c.ruiz@techco.com',
      correoAcceso:      'c.ruiz@techco.com',
      estado:            'PENDIENTE_HABILITACION',
      camaraComercio:    { url: null, fechaVigencia: null, validado: false },
      nit_doc:           { url: 'https://example.com/nit2.pdf', validado: true  },
      cedulaRL:          { url: 'https://example.com/cedula2.pdf', validado: true },
      convenio:          { url: 'https://example.com/convenio2.pdf', fechaInicio: '2022-06-01', fechaFin: '2027-06-01', validado: true },
      practicantesActivos: [103],
    },
    {
      id: 3,
      razonSocial:       'Aviatur S.A.',
      nit:               '860.007.738-4',
      sectorEconomico:   'Turismo',
      direccion:         'Av. El Dorado # 93-30',
      municipio:         'Bogotá',
      telefono:          '(601) 555-0303',
      nombreContacto:    'Ana Gómez',
      emailContacto:     'a.gomez@aviatur.com',
      correoAcceso:      'a.gomez@aviatur.com',
      estado:            'SIN_COMPLETAR',
      camaraComercio:    { url: null,  fechaVigencia: null, validado: false },
      nit_doc:           { url: null,  validado: false },
      cedulaRL:          { url: null,  validado: false },
      convenio:          { url: null,  fechaInicio: null, fechaFin: null, validado: false },
      practicantesActivos: [],
    },
    {
      id: 4,
      razonSocial:       'Grupo Éxito',
      nit:               '811.000.743-5',
      sectorEconomico:   'Comercio',
      direccion:         'Calle 30 Sur # 43A-80',
      municipio:         'Envigado',
      telefono:          '(604) 555-0404',
      nombreContacto:    'Juan Mora',
      emailContacto:     'j.mora@exito.com',
      correoAcceso:      'j.mora@exito.com',
      estado:            'INHABILITADA',
      camaraComercio:    { url: 'https://example.com/camara4.pdf', fechaVigencia: '2024-01-01', validado: true },
      nit_doc:           { url: 'https://example.com/nit4.pdf',    validado: true },
      cedulaRL:          { url: 'https://example.com/cedula4.pdf', validado: true },
      convenio:          { url: 'https://example.com/convenio4.pdf', fechaInicio: '2018-01-01', fechaFin: '2023-01-01', validado: false },
      practicantesActivos: [],
    },
  ],

  tutores: [
    { id: 1, empresaId: 1, nombre: 'Roberto Silva',  cargo: 'Jefe de TI',          telefono: '3001112233', correo: 'r.silva@bancolombia.com',  activo: true  },
    { id: 2, empresaId: 1, nombre: 'Patricia Vega',  cargo: 'Analista de RRHH',    telefono: '3004445566', correo: 'p.vega@bancolombia.com',    activo: true  },
    { id: 3, empresaId: 2, nombre: 'Miguel Torres',  cargo: 'Director Técnico',    telefono: '3117778899', correo: 'm.torres@techco.com',       activo: true  },
  ],

  visitas: [
    { id: 1, empresaId: 1, fecha: '2025-04-10', duracion: '2 horas',    motivo: 'Seguimiento practicante',      comentarios: 'Excelente ambiente de trabajo. Estudiante avanza bien.', realizadaPor: 'Coord. Empresarial', tipo: 'COORDINADORA' },
    { id: 2, empresaId: 1, fecha: '2025-03-15', duracion: '1.5 horas',  motivo: 'Visita inicial',               comentarios: 'Primera visita de bienvenida.',                          realizadaPor: 'Dr. Ramírez',        tipo: 'DOCENTE'       },
    { id: 3, empresaId: 2, fecha: '2025-04-20', duracion: '1 hora',     motivo: 'Revisión de documentos',      comentarios: 'Pendiente actualizar cámara de comercio.',               realizadaPor: 'Coord. Empresarial', tipo: 'COORDINADORA' },
  ],
}

// Verificar si convenio está vencido y actualizar estado automáticamente
const verificarConvenio = (empresa) => {
  if (!empresa.convenio?.fechaFin) return empresa
  const hoy     = new Date()
  const vence   = new Date(empresa.convenio.fechaFin)
  if (vence < hoy && empresa.estado !== 'INHABILITADA') {
    empresa.estado = 'INHABILITADA'
  }
  return empresa
}

// Alerta de cámara de comercio próxima a vencer (30 días)
const alertaCamara = (empresa) => {
  if (!empresa.camaraComercio?.fechaVigencia) return null
  const hoy     = new Date()
  const vigencia = new Date(empresa.camaraComercio.fechaVigencia)
  const dias    = Math.ceil((vigencia - hoy) / (1000 * 60 * 60 * 24))
  if (dias <= 30 && dias >= 0) return { tipo: 'PROXIMA', dias }
  if (dias < 0)                return { tipo: 'VENCIDA', dias: Math.abs(dias) }
  return null
}
// ─────────────────────────────────────────────────────────────────────────
// FIN MOCK
// ─────────────────────────────────────────────────────────────────────────

export const empresasApi = {

  // ── Empresas ─────────────────────────────────────────────────────────
  getEmpresas: async () => {
    await delay()
    return db.empresas.map(verificarConvenio).map(e => ({
      ...e,
      alertaCamara: alertaCamara(e),
    }))
    // return api.get('/empresas').then(r => r.data)
  },

  getEmpresaById: async (id) => {
    await delay()
    const e = db.empresas.find(e => e.id === Number(id))
    if (!e) return null
    return { ...verificarConvenio(e), alertaCamara: alertaCamara(e) }
    // return api.get(`/empresas/${id}`).then(r => r.data)
  },

  // Perfil propio (rol EMPRESA)
  getMiEmpresa: async () => {
    await delay()
    // En mock simula que la empresa logueada es la id=2
    const e = db.empresas.find(e => e.id === 2)
    return { ...verificarConvenio(e), alertaCamara: alertaCamara(e) }
    // return api.get('/empresas/mi-perfil').then(r => r.data)
  },

  crearEmpresaPerfil: async (data) => {
    await delay()
    const nueva = {
      ...data,
      id: ++nextId,
      estado: 'SIN_COMPLETAR',
      camaraComercio: { url: null, fechaVigencia: null, validado: false },
      nit_doc:        { url: null, validado: false },
      cedulaRL:       { url: null, validado: false },
      convenio:       { url: null, fechaInicio: null, fechaFin: null, validado: false },
      practicantesActivos: [],
    }
    db.empresas.push(nueva)
    return nueva
    // return api.post('/empresas', data).then(r => r.data)
  },

  editarEmpresa: async (id, data) => {
    await delay()
    const idx = db.empresas.findIndex(e => e.id === id)
    db.empresas[idx] = { ...db.empresas[idx], ...data }
    return db.empresas[idx]
    // return api.put(`/empresas/${id}`, data).then(r => r.data)
  },

  /**
   * Sube un documento de la empresa.
   * tipo: 'camaraComercio' | 'nit_doc' | 'cedulaRL' | 'convenio'
   * Simula subida a Firebase Storage.
   */
  subirDocumento: async (empresaId, tipo, data) => {
    await delay(600)
    const empresa = db.empresas.find(e => e.id === empresaId)
    empresa[tipo] = { ...empresa[tipo], ...data, url: `https://mock.firebase.com/${tipo}_${empresaId}.pdf` }
    // Recalcular estado
    recalcularEstado(empresa)
    return empresa
    // return api.post(`/empresas/${empresaId}/documentos/${tipo}`, data).then(r => r.data)
  },

  validarDocumento: async (empresaId, tipo) => {
    await delay()
    const empresa = db.empresas.find(e => e.id === empresaId)
    empresa[tipo].validado = true
    recalcularEstado(empresa)
    return empresa
    // return api.patch(`/empresas/${empresaId}/documentos/${tipo}/validar`).then(r => r.data)
  },

  subirConvenio: async (empresaId, data) => {
    await delay(600)
    const empresa = db.empresas.find(e => e.id === empresaId)
    empresa.convenio = { ...data, url: `https://mock.firebase.com/convenio_${empresaId}.pdf`, validado: false }
    return empresa
    // return api.post(`/empresas/${empresaId}/convenio`, data).then(r => r.data)
  },

  // ── Tutores ────────────────────────────────────────────────────────
  getTutoresByEmpresa: async (empresaId) => {
    await delay()
    return db.tutores.filter(t => t.empresaId === Number(empresaId))
    // return api.get(`/empresas/${empresaId}/tutores`).then(r => r.data)
  },

  crearTutor: async (empresaId, data) => {
    await delay()
    const nuevo = { ...data, id: ++nextId, empresaId: Number(empresaId), activo: true }
    db.tutores.push(nuevo)
    return nuevo
    // return api.post(`/empresas/${empresaId}/tutores`, data).then(r => r.data)
  },

  editarTutor: async (id, data) => {
    await delay()
    const idx = db.tutores.findIndex(t => t.id === id)
    db.tutores[idx] = { ...db.tutores[idx], ...data }
    return db.tutores[idx]
    // return api.put(`/empresas/tutores/${id}`, data).then(r => r.data)
  },

  toggleTutor: async (id) => {
    await delay()
    const t = db.tutores.find(t => t.id === id)
    t.activo = !t.activo
    return t
    // return api.patch(`/empresas/tutores/${id}/toggle`).then(r => r.data)
  },

  // ── Visitas ────────────────────────────────────────────────────────
  getVisitas: async (empresaId) => {
    await delay()
    return empresaId
      ? db.visitas.filter(v => v.empresaId === Number(empresaId))
      : db.visitas
    // return api.get('/visitas', { params: { empresaId } }).then(r => r.data)
  },

  crearVisita: async (data) => {
    await delay()
    const nueva = { ...data, id: ++nextId }
    db.visitas.push(nueva)
    return nueva
    // return api.post('/visitas', data).then(r => r.data)
  },
}

// Recalcular estado de la empresa según documentos y convenio
function recalcularEstado(empresa) {
  const tieneTodosDocumentos =
    empresa.camaraComercio?.url &&
    empresa.nit_doc?.url &&
    empresa.cedulaRL?.url

  const tieneConvenioVigente = (() => {
    if (!empresa.convenio?.fechaFin) return false
    return new Date(empresa.convenio.fechaFin) > new Date()
  })()

  const todosValidados =
    empresa.camaraComercio?.validado &&
    empresa.nit_doc?.validado &&
    empresa.cedulaRL?.validado &&
    empresa.convenio?.validado

  if (!tieneTodosDocumentos) {
    empresa.estado = 'SIN_COMPLETAR'
  } else if (!tieneConvenioVigente) {
    empresa.estado = 'INHABILITADA'
  } else if (!todosValidados) {
    empresa.estado = 'PENDIENTE_HABILITACION'
  } else {
    empresa.estado = 'HABILITADA'
  }
}