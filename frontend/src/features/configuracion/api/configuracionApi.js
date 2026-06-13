import api from '@/lib/axios'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const configuracionApi = {

  // ── Facultades ───────────────────────────────────────────────────────
  // Backend: FacultadDto { id, nombre, activo }
  // El front (FacultadesPage) espera además: activa, coordinador,
  // correoCoordinador, programas[]. Como el backend no los tiene,
  // se completan con placeholders para no romper el render.
  getFacultades: async () => {
    const { data } = await api.get('/facultades')
    return data.map(f => ({
      id: f.id,
      nombre: f.nombre,
      activo: f.activo,
      activa: f.activo,           // alias para BadgeEstado/condicionales existentes
      coordinador: '—',           // no existe en backend
      correoCoordinador: '—',     // no existe en backend
      programas: [],               // no existe en backend (placeholder)
    }))
  },

  crearFacultad: async (data) => {
    // El backend (FacultadRequest) solo acepta "nombre".
    // coordinador/correoCoordinador del modal se ignoran.
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
      return { id, activo: false, activa: false }
    }
    throw { response: { data: { mensaje: 'Reactivar facultades aún no está disponible (endpoint pendiente).' } } }
  },

  // ── Programas ────────────────────────────────────────────────────────
  // Backend: ProgramaDto { id, nombre, facultadId, nombreFacultad, activo }
  // El front (ProgramasPage/ModalPrograma) espera además:
  // numeroPracticas, corteseguimiento, notaMinima — esos viven en
  // ProgramaParametro, que aún no tiene endpoint. Se rellenan con
  // valores de getParametrosPrograma (mock) por ahora.
  getProgramas: async () => {
    const { data } = await api.get('/programas')
    return Promise.all(
      data.map(async (p) => {
        const params = await configuracionApi.getParametrosPrograma(p.id)
        return {
          id: p.id,
          nombre: p.nombre,
          facultadId: p.facultadId,
          nombreFacultad: p.nombreFacultad,
          activo: p.activo,
          numeroPracticas: params.numeroPracticas,
          corteseguimiento: params.corteseguimiento,
          notaMinima: params.notaMinima,
        }
      })
    )
  },

  crearPrograma: async (data) => {
    const { data: res } = await api.post('/programas', {
      nombre:     data.nombre,
      facultadId: Number(data.facultadId),
    })
    return res
    // numeroPracticas/corteseguimiento/notaMinima se ignoran hasta que
    // exista el endpoint de ProgramaParametro.
  },

  editarPrograma: async (id, data) => {
    // Si vienen nombre/facultadId, actualiza el programa base.
    if (data.nombre !== undefined || data.facultadId !== undefined) {
      const { data: res } = await api.put(`/programas/${id}`, {
        nombre:     data.nombre,
        facultadId: Number(data.facultadId),
      })
      return res
    }
    // Si solo vienen parámetros (numeroPracticas, corteseguimiento, notaMinima),
    // se guardan en el mock hasta tener endpoint real.
    return configuracionApi.editarParametrosPrograma(id, data)
  },

  togglePrograma: async (id, activoActual) => {
    if (activoActual) {
      await api.delete(`/programas/${id}`)
      return { id, activo: false }
    }
    throw { response: { data: { mensaje: 'Reactivar programas aún no está disponible (endpoint pendiente).' } } }
  },

  // ── Catálogo de prácticas ────────────────────────────────────────────
  // Backend: CatalogoPractica { id, numeroPractica, nombre, materiaNucleo,
  //   materiaNucleoCodigo, programa:{id,nombre,...}, cortesPorPractica,
  //   duracionSemanas, activo, documentosRequeridos, fechaCreacion }
  // El front (CatalogoPracticasPage) espera: programaId, descripcion,
  // activa, practicasActivas. Se mapean/derivan a continuación.
  _mapCatalogo: (c) => ({
    id: c.id,
    numeroPractica: c.numeroPractica,
    nombre: c.nombre,
    materiaNucleo: c.materiaNucleo,
    materiaNucleoCodigo: c.materiaNucleoCodigo,
    programaId: c.programa?.id,
    cortesPorPractica: c.cortesPorPractica,
    duracionSemanas: c.duracionSemanas,
    documentosRequeridos: c.documentosRequeridos,
    descripcion: c.documentosRequeridos, // no hay campo "descripcion" en backend; se usa este como aproximación
    activo: c.activo,
    activa: c.activo,        // alias para BadgeEstado
    practicasActivas: 0,     // backend no expone este conteo todavía
  }),

  // El backend solo lista POR programa (no "todos").
  getCatalogoPracticasPorPrograma: async (programaId) => {
    const { data } = await api.get(`/configuracion/programas/${programaId}/catalogos`)
    return data.map(configuracionApi._mapCatalogo)
  },

  // Firma usada por CatalogoPracticasPage: getCatalogoPracticas(programaId)
  // Si programaId viene vacío, combina el catálogo de TODOS los programas.
  getCatalogoPracticas: async (programaId) => {
    if (programaId) {
      return configuracionApi.getCatalogoPracticasPorPrograma(programaId)
    }
    const programas = await configuracionApi.getProgramas()
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
      materiaNucleoCodigo:  data.materiaNucleoCodigo ?? data.materiaNucleo?.slice(0, 10).toUpperCase(),
      programaId:           Number(data.programaId),
      cortesPorPractica:    Number(data.cortesPorPractica) || 3,
      duracionSemanas:      Number(data.duracionSemanas) || 16,
      documentosRequeridos: data.descripcion ?? data.documentosRequeridos ?? '',
    })
    return configuracionApi._mapCatalogo(res)
  },

  // No existe endpoint de edición general en el backend — solo cambio
  // de estado (activo/inactivo). ModalCatalogoPractica llama a esto en
  // modo edición; se informa al usuario que no es soportado.
  editarCatalogoPractica: async (_id, _data) => {
    throw {
      response: {
        data: { mensaje: 'Editar una práctica del catálogo no está soportado todavía. Puedes activar/desactivar o crear una nueva.' },
      },
    }
  },

  toggleCatalogoPractica: async (id, activoActual) => {
    const nuevoEstado = !activoActual
    await api.patch(`/configuracion/catalogos/${id}/estado`, null, {
      params: { activo: nuevoEstado },
    })
    return { id, activo: nuevoEstado, activa: nuevoEstado }
  },

  // ════════════════════════════════════════════════════════════════════
  // PENDIENTE — sin backend todavía (ProgramaParametro existe como
  // entidad pero no tiene controller/facade expuesto)
  // ════════════════════════════════════════════════════════════════════

  getParametrosPrograma: async (programaId) => {
    await delay(50)
    return { numeroPracticas: 2, corteseguimiento: 4, notaMinima: 3.5, programaId }
    // return api.get(`/configuracion/programas/${programaId}/parametros`).then(r => r.data)
  },
  editarParametrosPrograma: async (programaId, data) => {
    await delay(50)
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