import api from '@/lib/axios'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

const db = {
  tutor: {
    id: 1,
    nombre: 'Miguel Torres',
    cargo: 'Director Técnico',
    correo: 'm.torres@techcorp.com',
    telefono: '3117778899',
    empresaNombre: 'TechCorp SAS',
    empresaId: 1,
  },

  estudiantes: [
    {
      id: 8, nombre: 'Sebastián Romero', programa: 'Ingeniería de Software', semestre: 8,
      practicaId: 2, numeroPractica: 1, estado: 'EN_PRACTICA',
      fechaInicio: '2025-03-01', fechaFinEstimada: '2025-06-30',
      correo: 's.romero@universidad.edu.co',
      docenteNombre: 'Dr. Carlos Méndez',
      encuestaCompletada: false,
    },
  ],
  notaTutor: null,
  observacionesNota: null,
}

export const tutorApi = {

  getPerfilTutor: async () => {
    await delay()
    return db.tutor
    // return api.get(`/empresas/tutores/${tutorId}`).then(r => r.data)
  },

  getMisEstudiantes: async () => {
    await delay()
    return db.estudiantes
    // return api.get(`/practicas/tutor/${tutorId}`).then(r => r.data)
  },

  getEstudianteDetalle: async (id) => {
    await delay()
    return db.estudiantes.find(e => e.id === Number(id)) ?? null
    // return api.get(`/estudiantes/${id}`).then(r => r.data)
  },

  // ── Encuesta tipo TUTOR ────────────────────────────────────────
  getPlantillaEncuestaTutor: async () => {
    await delay()
    return {
      id: 2,
      tipo: 'TUTOR',
      nombre: 'Evaluación Tutor Empresarial 2026-1',
      secciones: [
        {
          id: 5, codigo: 'A', titulo: 'Evaluación del desempeño del estudiante',
          preguntas: [
            { id: 15, orden: 1, texto: 'Puntualidad y cumplimiento del estudiante en sus responsabilidades.', tipo: 'ESCALA' },
            { id: 16, orden: 2, texto: 'Actitud y disposición del estudiante frente a las tareas asignadas.', tipo: 'ESCALA' },
            { id: 17, orden: 3, texto: 'Capacidad del estudiante para trabajar en equipo.', tipo: 'ESCALA' },
            { id: 18, orden: 4, texto: 'Nivel de responsabilidad y autonomía demostrado por el estudiante.', tipo: 'ESCALA' },
            { id: 19, orden: 5, texto: 'Satisfacción general con el desempeño del estudiante en la empresa.', tipo: 'ESCALA' },
          ],
        },
        {
          id: 6, codigo: 'B', titulo: 'Evaluación de competencias profesionales',
          preguntas: [
            { id: 20, orden: 1, texto: 'Aplicación de conocimientos teóricos en el contexto laboral.', tipo: 'ESCALA' },
            { id: 21, orden: 2, texto: 'Capacidad de adaptación a los procesos y cultura organizacional.', tipo: 'ESCALA' },
            { id: 22, orden: 3, texto: 'Calidad del trabajo entregado durante la práctica.', tipo: 'ESCALA' },
            { id: 23, orden: 4, texto: 'Observaciones adicionales sobre el desempeño del estudiante.', tipo: 'TEXTO' },
          ],
        },
      ],
    }
    // return api.get('/encuestas/plantilla/TUTOR').then(r => r.data)
  },

  getEncuestaTutor: async (practicaId) => {
    await delay()
    const est = db.estudiantes.find(e => e.practicaId === Number(practicaId))
    if (!est?.encuestaCompletada) return null
    return est.respuestaEncuesta ?? null
    // return api.get(`/encuestas/practica/${practicaId}/tipo/TUTOR`).then(r => r.data).catch(() => null)
  },

  enviarEncuestaTutor: async (practicaId, payload) => {
    await delay(600)
    const est = db.estudiantes.find(e => e.practicaId === Number(practicaId))
    if (!est) throw new Error('Estudiante no encontrado')
    est.encuestaCompletada = true
    est.respuestaEncuesta = { ...payload, fechaEnvio: new Date().toISOString() }
    return est.respuestaEncuesta
    // return api.post(`/encuestas/practica/${practicaId}/tipo/TUTOR`, payload).then(r => r.data)
  },

  getNotaTutor: async (practicaId) => {
  await delay()
  const est = db.estudiantes.find(e => e.practicaId === Number(practicaId))
  return est?.notaTutor != null
    ? { nota: est.notaTutor, observaciones: est.observacionesNota }
    : null
  // return api.get(`/evaluaciones/practica/${practicaId}`).then(r => r.data).catch(() => null)
  },

    registrarNotaTutor: async (practicaId, { nota, observaciones }) => {
    await delay(600)
    const est = db.estudiantes.find(e => e.practicaId === Number(practicaId))
    if (!est) throw new Error('Estudiante no encontrado')
    est.notaTutor = nota
    est.observacionesNota = observaciones
    return { nota, observaciones }
    // return api.post(`/evaluaciones/tutor/practica/${practicaId}`, {
    //   notaTutor: nota, observacionesTutor: observaciones
    // }).then(r => r.data)
    },
}

export const ESTADO_PRACTICA_LABEL_TUTOR = {
  EN_PRACTICA: { label: 'En práctica', bg: '#eaf7f0', color: '#1a7a4a' },
  VINCULADA:   { label: 'Vinculada',   bg: '#e6f0fb', color: '#0B416B' },
  COMPLETADA:  { label: 'Completada',  bg: '#eaf7f0', color: '#1a7a4a' },
}