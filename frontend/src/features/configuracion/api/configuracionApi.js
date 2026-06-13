import api from '@/lib/axios'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const configuracionApi = {

  // ── Facultades ───────────────────────────────────────────────────────
  getFacultades: async () => {
    const { data } = await api.get('/facultades')
    return data // [{ id, nombre, activo }]
  },

  crearFacultad: async (data) => {
    const { data: res } = await api.post('/facultades', { nombre: data.nombre })
    return res
  },

  editarFacultad: async (id, data) => {
    const { data: res } = await api.put(`/facultades/${id}`, { nombre: data.nombre })
    return res
  },

  // Solo soporta desactivar (DELETE = soft delete). No hay endpoint para
  // reactivar una facultad todavía.
  toggleFacultad: async (id, activoActual) => {
    if (activoActual) {
      await api.delete(`/facultades/${id}`)
      return { id, activo: false }
    }
    throw { response: { data: { mensaje: 'Reactivar facultades aún no está disponible (endpoint pendiente).' } } }
  },

  // ── Programas ────────────────────────────────────────────────────────
  getProgramas: async () => {
    const { data } = await api.get('/programas')
    return data // [{ id, nombre, facultadId, nombreFacultad, activo }]
  },

  crearPrograma: async (data) => {
    const { data: res } = await api.post('/programas', {
      nombre:     data.nombre,
      facultadId: Number(data.facultadId),
    })
    return res
  },

  editarPrograma: async (id, data) => {
    const { data: res } = await api.put(`/programas/${id}`, {
      nombre:     data.nombre,
      facultadId: Number(data.facultadId),
    })
    return res
  },

  togglePrograma: async (id, activoActual) => {
    if (activoActual) {
      await api.delete(`/programas/${id}`)
      return { id, activo: false }
    }
    throw { response: { data: { mensaje: 'Reactivar programas aún no está disponible (endpoint pendiente).' } } }
  },

  // ── Catálogo de prácticas ────────────────────────────────────────────
  // El backend solo expone listado POR programa (no "todos").
  getCatalogoPracticasPorPrograma: async (programaId) => {
    const { data } = await api.get(`/configuracion/programas/${programaId}/catalogos`)
    return data
  },

  // Combina el catálogo de todos los programas dados.
  getCatalogoPracticas: async (programas, programaId) => {
    if (programaId) {
      return configuracionApi.getCatalogoPracticasPorPrograma(programaId)
    }
    const resultados = await Promise.all(
      programas.map(p => configuracionApi.getCatalogoPracticasPorPrograma(p.id))
    )
    return resultados.flat()
  },

  crearCatalogoPractica: async (data) => {
    const { data: res } = await api.post('/configuracion/catalogos', {
      numeroPractica:       Number(data.numeroPractica),
      nombre:               data.nombre,
      materiaNucleo:        data.materiaNucleo,
      materiaNucleoCodigo:  data.materiaNucleoCodigo,
      programaId:           Number(data.programaId),
      cortesPorPractica:    Number(data.cortesPorPractica),
      duracionSemanas:      Number(data.duracionSemanas),
      documentosRequeridos: data.documentosRequeridos,
    })
    return res
  },

  // No existe endpoint de edición general — solo cambio de estado.
  toggleCatalogoPractica: async (id, activoActual) => {
    await api.patch(`/configuracion/catalogos/${id}/estado`, null, {
      params: { activo: !activoActual },
    })
    return { id, activo: !activoActual }
  },

  // ════════════════════════════════════════════════════════════════════
  // PENDIENTE — sin backend todavía (mock se mantiene tal cual)
  // ════════════════════════════════════════════════════════════════════

  // ── Parámetros por programa (ProgramaParametro — sin controller) ─────
  getParametrosPrograma: async (programaId) => {
    await delay()
    return { numeroPracticas: 2, corteseguimiento: 4, notaMinima: 3.5, programaId }
    // return api.get(`/configuracion/programas/${programaId}/parametros`).then(r => r.data)
  },
  editarParametrosPrograma: async (programaId, data) => {
    await delay()
    return { ...data, programaId }
    // return api.put(`/configuracion/programas/${programaId}/parametros`, data).then(r => r.data)
  },

  // ── Plantillas de correo (sin backend) ────────────────────────────────
  getPlantillas: async () => {
    await delay()
    return [
      { id: 1, nombre: 'Bienvenida al sistema',      evento: 'REGISTRO_USUARIO',      activa: true,  variables: ['{{nombre}}', '{{correo}}', '{{password_temporal}}'] },
      { id: 2, nombre: 'Notificación de asignación', evento: 'ASIGNACION_EMPRESA',    activa: true,  variables: ['{{nombre_estudiante}}', '{{empresa}}', '{{fecha}}'] },
      { id: 3, nombre: 'Cambio de estado práctica',  evento: 'CAMBIO_ESTADO',         activa: true,  variables: ['{{nombre}}', '{{estado_anterior}}', '{{estado_nuevo}}'] },
      { id: 4, nombre: 'Encuesta de satisfacción',   evento: 'ENCUESTA_PENDIENTE',    activa: false, variables: ['{{nombre}}', '{{enlace_encuesta}}'] },
      { id: 5, nombre: 'Recordatorio de documentos', evento: 'DOCUMENTOS_PENDIENTES', activa: true,  variables: ['{{nombre}}', '{{documentos_faltantes}}'] },
    ]
  },
  editarPlantilla: async (id, data) => { await delay(); return { id, ...data } },
  togglePlantilla: async (id) => { await delay(); return { id } },

  // ── Catálogos maestros (sin backend) ──────────────────────────────────
  getCatalogoMaestro: async (tipo) => {
    await delay()
    const data = {
      tiposContrato:   [{ id: 1, nombre: 'Contrato de aprendizaje', activo: true }, { id: 2, nombre: 'Convenio de práctica', activo: true }],
      sectoresEmpresa: [{ id: 1, nombre: 'Tecnología', activo: true }, { id: 2, nombre: 'Finanzas', activo: true }],
      tiposDocumento:  [{ id: 1, nombre: 'Cédula de ciudadanía', activo: true }],
      estadosPractica: [{ id: 1, nombre: 'Pendiente empresa', activo: true }],
    }
    return data[tipo] ?? []
  },
  crearItemCatalogo: async (tipo, data) => { await delay(); return { ...data, id: Date.now(), activo: true } },
  editarItemCatalogo: async (tipo, id, data) => { await delay(); return { id, ...data } },
  toggleItemCatalogo: async (tipo, id) => { await delay(); return { id } },
}