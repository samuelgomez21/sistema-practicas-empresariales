import api from '@/lib/axios'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

const db = {
  docente: {
    id: 1,
    nombre: 'Dr. Carlos Méndez',
    correo: 'c.mendez@universidad.edu.co',
    facultad: 'Ingeniería',
    programa: 'Ingeniería de Software',
    dedicacion: 'Tiempo completo',
    maxEstudiantes: 10,
  },

  estudiantes: [
    {
      id: 9, nombre: 'Valentina García', programa: 'Ingeniería de Software', semestre: 8,
      promedioAcumulado: 4.3, creditosAprobados: 152,
      practica: {
        id: 1, numero: 2, estado: 'EN_PROCESO_VINCULACION',
        empresaNombre: null, tutorNombre: null,
        fechaInicio: null, fechaFinEstimada: null,
        avancesPendientes: 1,
      },
    },
    {
      id: 8, nombre: 'Sebastián Romero', programa: 'Ingeniería de Software', semestre: 8,
      promedioAcumulado: 4.1, creditosAprobados: 148,
      practica: {
        id: 2, numero: 1, estado: 'EN_PRACTICA',
        empresaNombre: 'TechCo S.A.S.', tutorNombre: 'Miguel Torres',
        fechaInicio: '2025-03-01', fechaFinEstimada: '2025-06-30',
        avancesPendientes: 1,
      },
    },
  ],

  avances: [
    {
      id: 101, practicaId: 1, estudianteId: 9, estudianteNombre: 'Valentina García',
      titulo: 'Avance semana 3', descripcion: 'Revisión de requerimientos del proyecto y levantamiento de información inicial con el equipo de TI.',
      archivoUrl: 'https://mock.firebase.com/avance_valentina_3.pdf',
      archivoNombre: 'Avance_Semana3_Valentina.pdf',
      fechaEntrega: '2025-04-08',
      estado: 'PENDIENTE',
      comentarioDocente: null,
    },
    {
      id: 102, practicaId: 2, estudianteId: 8, estudianteNombre: 'Sebastián Romero',
      titulo: 'Avance semana 5', descripcion: 'Implementación del módulo de autenticación con JWT y pruebas unitarias del backend.',
      archivoUrl: 'https://mock.firebase.com/avance_sebastian_5.pdf',
      archivoNombre: 'Avance_Semana5_Sebastian.pdf',
      fechaEntrega: '2025-04-09',
      estado: 'PENDIENTE',
      comentarioDocente: null,
    },
    {
      id: 100, practicaId: 2, estudianteId: 8, estudianteNombre: 'Sebastián Romero',
      titulo: 'Avance semana 4', descripcion: 'Diseño de arquitectura del sistema y configuración del entorno de desarrollo.',
      archivoUrl: 'https://mock.firebase.com/avance_sebastian_4.pdf',
      archivoNombre: 'Avance_Semana4_Sebastian.pdf',
      fechaEntrega: '2025-04-01',
      estado: 'REVISADO',
      comentarioDocente: 'Buen avance, continúa documentando cada decisión de arquitectura.',
    },
  ],
  visitas: [
    {
        id: 1, estudianteId: 8, estudianteNombre: 'Sebastián Romero',
        empresaNombre: 'TechCo S.A.S.',
        fecha: '2025-03-20', horaInicio: '10:00', horaFin: '11:30',
        motivo: 'SEGUIMIENTO',
        observaciones: 'Visita inicial. Se verificó el puesto de trabajo y condiciones laborales adecuadas. El estudiante se encuentra bien adaptado.',
    },
  ],
}

export const docenteApi = {

  getMisEstudiantes: async () => {
    await delay()
    return db.estudiantes
    // return api.get(`/practicas/docente/${docenteId}`).then(r => r.data)
  },

  getEstudianteDetalle: async (estudianteId) => {
    await delay()
    return db.estudiantes.find(e => e.id === Number(estudianteId)) ?? null
    // return api.get(`/estudiantes/${id}`).then(r => r.data)
  },

  getAvancesPendientes: async () => {
    await delay()
    return db.avances.filter(a => a.estado === 'PENDIENTE')
    // return api.get(`/docentes/${docenteId}/avances/pendientes`).then(r => r.data)
  },

  getAvancesPorPractica: async (practicaId) => {
    await delay()
    return db.avances.filter(a => a.practicaId === Number(practicaId))
    // return api.get(`/practicas/${practicaId}/avances`).then(r => r.data)
  },

  comentarAvance: async (avanceId, comentario) => {
    await delay()
    const a = db.avances.find(a => a.id === avanceId)
    a.comentarioDocente = comentario
    a.estado = 'REVISADO'
    return a
    // return api.patch(`/avances/${avanceId}/comentario`, { comentario }).then(r => r.data)
  },

  // ── Visitas ──────────────────────────────────────────────────
  getVisitas: async () => {
    await delay()
    return [...db.visitas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    // return api.get(`/visitas/docente/${docenteId}`).then(r => r.data)
  },

  crearVisita: async (data) => {
    await delay(600)
    const nueva = { ...data, id: Date.now() }
    db.visitas.push(nueva)
    return nueva
    // return api.post('/visitas', data).then(r => r.data)
  },

  getEstudiantesConEmpresa: async () => {
  await delay()
  return db.estudiantes.filter(e => e.practica?.empresaNombre)
  // return api.get(`/practicas/docente/${docenteId}`).then(r => r.data.filter(p => p.empresaId))
  },

  getPerfilDocente: async () => {
  await delay()
  return db.docente
  // return api.get(`/usuarios/${docenteId}`).then(r => r.data)
  },
}

export const ESTADO_PRACTICA_LABEL = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio',  bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'Sin empresa',       bg: '#f0f2f5', color: '#6b7a8d' },
  VINCULADA:                 { label: 'Vinculada',         bg: '#e6f0fb', color: '#0B416B' },
  EN_PRACTICA:               { label: 'En práctica',       bg: '#eaf7f0', color: '#1a7a4a' },
  COMPLETADA:                { label: 'Completada',        bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',         bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',         bg: '#fef0f0', color: '#c0392b' },
}

export const MOTIVO_VISITA = {
  SEGUIMIENTO:    'Seguimiento general',
  INDUCCION:      'Verificación de inducción',
  EVALUACION:     'Evaluación intermedia',
  CIERRE:         'Visita de cierre',
  OTRO:           'Otro',
}