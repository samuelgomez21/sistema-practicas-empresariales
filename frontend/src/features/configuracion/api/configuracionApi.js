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
    descripcion: c.descripcion,
    programaId: c.programaId ?? c.programa?.id,
    cortesPorPractica: c.cortesPorPractica,
    duracionSemanas: c.duracionSemanas,
    documentosRequeridos: c.documentosRequeridos,
    activo: c.activo,
    activa: c.activo,
    practicasActivas: c.practicasActivas ?? 0,
  }),

  // El backend solo lista POR programa (no "todos").
  getCatalogoPracticasPorPrograma: async (programaId) => {
    const { data } = await api.get(`/configuracion/programas/${programaId}/catalogos-con-conteo`)
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
      descripcion:        data.descripcion,
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
  editarCatalogoPractica: async (id, data) => {
    const { data: res } = await api.put(`/configuracion/catalogos/${id}`, {
      numeroPractica:       Number(data.numeroPractica),
      nombre:               data.nombre,
      materiaNucleo:        data.materiaNucleo,
      materiaNucleoCodigo:  data.materiaNucleoCodigo ?? data.materiaNucleo?.slice(0, 10).toUpperCase(),
      descripcion:        data.descripcion,
      programaId:           Number(data.programaId),
      cortesPorPractica:    Number(data.cortesPorPractica) || 3,
      duracionSemanas:      Number(data.duracionSemanas) || 16,
      documentosRequeridos: data.descripcion ?? data.documentosRequeridos ?? '',
    })
    return configuracionApi._mapCatalogo(res)
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
    const { data } = await api.get(`/configuracion/programas/${programaId}/parametros`)
    return {
      numeroPracticas:  data.numeroPracticas,
      corteseguimiento: data.corteseguimiento,
      notaMinima:       Number(data.notaMinima),
      programaId:       data.programaId,
    }
  },

  editarParametrosPrograma: async (programaId, data) => {
    const { data: res } = await api.put(`/configuracion/programas/${programaId}/parametros`, {
      numeroPracticas:  data.numeroPracticas  != null ? Number(data.numeroPracticas)  : undefined,
      corteseguimiento: data.corteseguimiento != null ? Number(data.corteseguimiento) : undefined,
      notaMinima:       data.notaMinima       != null ? Number(data.notaMinima)       : undefined,
    })
    return {
      numeroPracticas:  res.numeroPracticas,
      corteseguimiento: res.corteseguimiento,
      notaMinima:       Number(res.notaMinima),
      programaId:       res.programaId,
    }
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