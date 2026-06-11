import api from '@/lib/axios'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))
let nextId = 500

const db = {
  vacantes: [
    {
      id: 1,
      empresaId: 1,
      empresaNombre: 'Bancolombia S.A.',
      titulo: 'Practicante Desarrollo Web',
      descripcion: 'Desarrollo de aplicaciones web con React y Node.js bajo supervisión del equipo de tecnología.',
      perfilRequerido: 'Estudiante de últimos semestres con conocimientos en JavaScript y frameworks modernos.',
      requisitos: 'Conocimientos en React, Node.js, SQL. Disponibilidad tiempo completo.',
      habilidades: ['React', 'Node.js', 'SQL'],
      programaId: 1,
      programaNombre: 'Ingeniería de Software',
      semestreMinimo: 7,
      modalidad: 'PRESENCIAL',
      salario: 1300000,
      tipoContrato: 'CONTRATO_APRENDIZAJE',
      horario: 'Lunes a Viernes 8am - 5pm',
      cuposTotales: 2,
      cuposDisponibles: 1,
      estado: 'APROBADA',
      motivoRechazo: null,
      fechaCreacion: '2025-03-01',
      postulaciones: [
        { estudianteId: 8, nombreEstudiante: 'Carlos Mendoza', estado: 'POSTULADO', fechaPostulacion: '2025-03-10' },
        { estudianteId: 9, nombreEstudiante: 'Ana García',     estado: 'SELECCIONADO', fechaPostulacion: '2025-03-08' },
      ],
    },
    {
      id: 2,
      empresaId: 2,
      empresaNombre: 'TechCo S.A.S.',
      titulo: 'Practicante QA Tester',
      descripcion: 'Pruebas de software y control de calidad en proyectos de desarrollo.',
      perfilRequerido: 'Estudiante con bases en pruebas de software y metodologías ágiles.',
      requisitos: 'Selenium, Jira, Testing. Inglés básico.',
      habilidades: ['Selenium', 'Jira', 'Testing'],
      programaId: 1,
      programaNombre: 'Ingeniería de Software',
      semestreMinimo: 6,
      modalidad: 'HIBRIDA',
      salario: 1200000,
      tipoContrato: 'CONTRATO_APRENDIZAJE',
      horario: 'Lunes a Viernes 9am - 6pm',
      cuposTotales: 1,
      cuposDisponibles: 1,
      estado: 'PENDIENTE',
      motivoRechazo: null,
      fechaCreacion: '2025-03-05',
      postulaciones: [
        { estudianteId: 10, nombreEstudiante: 'Pedro López', estado: 'POSTULADO', fechaPostulacion: '2025-03-12' },
      ],
    },
    {
      id: 3,
      empresaId: 1,
      empresaNombre: 'Bancolombia S.A.',
      titulo: 'Practicante Analista de Datos',
      descripcion: 'Análisis de datos financieros y generación de reportes ejecutivos.',
      perfilRequerido: 'Estudiante con conocimientos en análisis de datos y herramientas de BI.',
      requisitos: 'Excel avanzado, Power BI, Python básico.',
      habilidades: ['Power BI', 'Python', 'Excel'],
      programaId: 1,
      programaNombre: 'Ingeniería de Software',
      semestreMinimo: 8,
      modalidad: 'REMOTA',
      salario: null,
      tipoContrato: 'PRACTICA',
      horario: 'Flexible',
      cuposTotales: 3,
      cuposDisponibles: 3,
      estado: 'APROBADA',
      motivoRechazo: null,
      fechaCreacion: '2025-02-20',
      postulaciones: [],
    },
    {
      id: 4,
      empresaId: 3,
      empresaNombre: 'Aviatur S.A.',
      titulo: 'Practicante Administración',
      descripcion: 'Apoyo en procesos administrativos y gestión documental.',
      perfilRequerido: 'Estudiante de administración con habilidades organizativas.',
      requisitos: 'Manejo de office, atención al cliente.',
      habilidades: ['Office', 'Atención al cliente'],
      programaId: 3,
      programaNombre: 'Administración de Empresas',
      semestreMinimo: 5,
      modalidad: 'PRESENCIAL',
      salario: 1000000,
      tipoContrato: 'CONTRATO_APRENDIZAJE',
      horario: 'Lunes a Sábado 8am - 2pm',
      cuposTotales: 2,
      cuposDisponibles: 2,
      estado: 'RECHAZADA',
      motivoRechazo: 'La descripción del perfil no es suficientemente detallada.',
      fechaCreacion: '2025-02-15',
      postulaciones: [],
    },
  ],

  estudiantes: [
    { id: 8,  nombre: 'Carlos Mendoza', programa: 'Ingeniería de Software', semestre: 8 },
    { id: 9,  nombre: 'Ana García',     programa: 'Ingeniería de Software', semestre: 9 },
    { id: 10, nombre: 'Pedro López',    programa: 'Ingeniería de Software', semestre: 7 },
    { id: 11, nombre: 'Laura Torres',   programa: 'Ingeniería de Software', semestre: 8 },
    { id: 12, nombre: 'Miguel Ruiz',    programa: 'Ingeniería de Software', semestre: 7 },
  ],
}

export const vacantesApi = {

  // ── Vacantes ──────────────────────────────────────────────────

  getVacantes: async () => {
    await delay()
    return db.vacantes
    // return api.get('/vacantes').then(r => r.data)
  },

  getVacantesPorEmpresa: async (empresaId) => {
    await delay()
    return db.vacantes.filter(v => v.empresaId === Number(empresaId))
    // return api.get(`/vacantes/empresa/${empresaId}`).then(r => r.data)
  },

  getVacantesPendientes: async () => {
    await delay()
    return db.vacantes.filter(v => v.estado === 'PENDIENTE')
    // return api.get('/vacantes/pendientes').then(r => r.data)
  },

  getVacanteById: async (id) => {
    await delay()
    return db.vacantes.find(v => v.id === Number(id)) ?? null
    // return api.get(`/vacantes/${id}`).then(r => r.data)
  },

  crearVacante: async (data) => {
    await delay(600)
    const nueva = {
      ...data,
      id:               ++nextId,
      estado:           'PENDIENTE',
      motivoRechazo:    null,
      cuposDisponibles: data.cuposTotales,
      fechaCreacion:    new Date().toISOString().split('T')[0],
      postulaciones:    [],
    }
    db.vacantes.push(nueva)
    return nueva
    // return api.post('/vacantes', data).then(r => r.data)
  },

  aprobarVacante: async (id) => {
    await delay()
    const v = db.vacantes.find(v => v.id === Number(id))
    v.estado = 'APROBADA'
    return v
    // return api.put(`/vacantes/${id}/aprobar`).then(r => r.data)
  },

  rechazarVacante: async (id, motivo) => {
    await delay()
    const v = db.vacantes.find(v => v.id === Number(id))
    v.estado = 'RECHAZADA'
    v.motivoRechazo = motivo
    return v
    // return api.put(`/vacantes/${id}/rechazar`, { motivo }).then(r => r.data)
  },

  cerrarVacante: async (id) => {
    await delay()
    const v = db.vacantes.find(v => v.id === Number(id))
    v.estado = 'CERRADA'
    return v
    // return api.put(`/vacantes/${id}/cerrar`).then(r => r.data)
  },

  // ── Postulaciones ─────────────────────────────────────────────

  postularEstudiante: async (vacanteId, estudianteId) => {
    await delay()
    const v = db.vacantes.find(v => v.id === Number(vacanteId))
    const est = db.estudiantes.find(e => e.id === Number(estudianteId))
    if (!v || !est) throw new Error('Vacante o estudiante no encontrado')
    if (v.postulaciones.some(p => p.estudianteId === estudianteId)) {
      throw new Error('El estudiante ya está postulado a esta vacante')
    }
    v.postulaciones.push({
      estudianteId,
      nombreEstudiante: est.nombre,
      estado:           'POSTULADO',
      fechaPostulacion: new Date().toISOString().split('T')[0],
    })
    return v
    // return api.post(`/vacantes/${vacanteId}/postular`, { estudianteId }).then(r => r.data)
  },

  getEstudiantesDisponibles: async () => {
    await delay()
    return db.estudiantes
    // return api.get('/estudiantes/aptos').then(r => r.data)
  },
}

export const MODALIDAD_LABEL = {
  PRESENCIAL: 'Presencial',
  REMOTA:     'Remota',
  HIBRIDA:    'Híbrida',
}

export const CONTRATO_LABEL = {
  CONTRATO_APRENDIZAJE: 'Contrato aprendizaje',
  PRACTICA:             'Práctica',
  OTRO:                 'Otro',
}

export const ESTADO_VACANTE = {
  PENDIENTE:  { label: 'Pendiente aprobación', bg: '#fff8e6', color: '#a07010' },
  APROBADA:   { label: 'Aprobada',             bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADA:  { label: 'Rechazada',            bg: '#fef0f0', color: '#c0392b' },
  CERRADA:    { label: 'Cerrada',              bg: '#f0f2f5', color: '#6b7a8d' },
  RESOLVER:   { label: 'Por resolver',         bg: '#fdf4e7', color: '#b35c00' },
}