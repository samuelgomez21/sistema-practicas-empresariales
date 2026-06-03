import api from '@/lib/axios'

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))
let nextId = 400

// ─────────────────────────────────────────────────────────────────────────
// MOCK
// ─────────────────────────────────────────────────────────────────────────
const db = {
  practica: {
    id: 1,
    estudianteId: 8,
    // Datos del catálogo (configuración)
    nombrePractica:  'Práctica I',
    materiaNucleo:   'Proyecto de Grado I',
    descripcion:     'Desarrollo de software bajo supervisión empresarial',
    programa:        'Ingeniería de Software',
    numeroPractica:  1,
    semestre:        8,
    // Estado
    estado:          'EN_CURSO',
    fechaInicio:     '2025-02-01',
    fechaFin:        '2025-07-31',
    // Equipo
    empresa: {
      id:           2,
      razonSocial:  'TechCo S.A.S.',
      municipio:    'Armenia',
      sector:       'Tecnología',
      telefono:     '(606) 555-0202',
      nombreContacto: 'Carlos Ruiz',
      emailContacto:  'c.ruiz@techco.com',
      estado:       'HABILITADA',
    },
    docente: {
      id:     201,
      nombre: 'Dr. Ramírez',
      correo: 'ramirez@uah.edu.co',
    },
    tutor: {
      id:      3,
      nombre:  'Miguel Torres',
      cargo:   'Director Técnico',
      telefono:'3117778899',
      correo:  'm.torres@techco.com',
    },
    // Cortes configurados por el docente
    cortes: [
      { numero: 1, nombre: 'Corte 1', fechaLimite: '2025-03-31' },
      { numero: 2, nombre: 'Corte 2', fechaLimite: '2025-05-15' },
      { numero: 3, nombre: 'Corte 3', fechaLimite: '2025-06-30' },
      { numero: 4, nombre: 'Corte 4', fechaLimite: '2025-07-25' },
    ],
    // Planeador
    planeador: {
      url:        'https://mock.firebase.com/planeador_1.pdf',
      fechaCarga: '2025-02-10',
    },
    // Sustentación
    sustentacion: {
      fecha:    null,
      informe:  null,
      documento: null,
      presentacion: null,
    },
    // Nota final
    notaFinal: null,
  },

  avances: [
    {
      id: 1, practicaId: 1, corteNumero: 1,
      titulo:      'Avance semana 1',
      descripcion: 'Primer acercamiento al equipo de desarrollo. Revisión de arquitectura del proyecto.',
      archivoUrl:  'https://mock.firebase.com/avance1.pdf',
      fechaEntrega: '2025-02-10',
      comentarioDocente: 'Buen inicio. Profundizar en la arquitectura utilizada.',
      estado:      'REVISADO',
    },
    {
      id: 2, practicaId: 1, corteNumero: 1,
      titulo:      'Avance semana 2',
      descripcion: 'Implementación del módulo de autenticación.',
      archivoUrl:  'https://mock.firebase.com/avance2.pdf',
      fechaEntrega: '2025-02-17',
      comentarioDocente: 'Excelente progreso.',
      estado:      'REVISADO',
    },
    {
      id: 3, practicaId: 1, corteNumero: 1,
      titulo:      'Avance semana 3',
      descripcion: 'Pruebas unitarias del módulo implementado.',
      archivoUrl:  'https://mock.firebase.com/avance3.pdf',
      fechaEntrega: '2025-02-24',
      comentarioDocente: null,
      estado:      'REVISADO',
    },
    {
      id: 4, practicaId: 1, corteNumero: 2,
      titulo:      'Avance semana 4',
      descripcion: 'Inicio del módulo de gestión de usuarios.',
      archivoUrl:  'https://mock.firebase.com/avance4.pdf',
      fechaEntrega: '2025-03-03',
      comentarioDocente: 'Revisar la validación de formularios.',
      estado:      'EN_REVISION',
    },
    {
      id: 5, practicaId: 1, corteNumero: 2,
      titulo:      'Avance semana 5',
      descripcion: 'Correcciones al módulo según observaciones del docente.',
      archivoUrl:  null,
      fechaEntrega: null,
      comentarioDocente: null,
      estado:      'PENDIENTE',
    },
  ],

  documentos: {
    hojaVida:       { url: 'https://mock.firebase.com/hv_1.pdf',  fechaCarga: '2025-01-20' },
    arl:            { url: null,  fechaCarga: null },
    contratoFirmado: { url: null, fechaCarga: null },
  },

  encuesta: null, // null = no diligenciada

  checklist: [
    { id: 'nota_docente',   label: 'Nota del docente registrada',     completado: true  },
    { id: 'nota_tutor',     label: 'Nota del tutor registrada',        completado: true  },
    { id: 'nota_final',     label: 'Nota final registrada',            completado: false },
    { id: 'encuesta_tutor', label: 'Encuesta del tutor completada',    completado: false },
    { id: 'encuesta_est',   label: 'Encuesta del estudiante completada', completado: false },
    { id: 'documentos',     label: 'Documentos completos (ARL + contrato)', completado: false },
    { id: 'informe_final',  label: 'Informe final cargado',            completado: false },
  ],
}

// Preguntas genéricas de la encuesta de satisfacción
export const PREGUNTAS_ENCUESTA = [
  { id: 1, texto: '¿Cómo calificarías tu experiencia general en la práctica empresarial?',              tipo: 'escala' },
  { id: 2, texto: '¿Las actividades realizadas se relacionaron con tu formación académica?',            tipo: 'escala' },
  { id: 3, texto: '¿Recibiste acompañamiento adecuado por parte del tutor empresarial?',               tipo: 'escala' },
  { id: 4, texto: '¿El docente asesor realizó un seguimiento efectivo durante la práctica?',           tipo: 'escala' },
  { id: 5, texto: '¿Las condiciones laborales (horario, remuneración, ambiente) fueron adecuadas?',    tipo: 'escala' },
  { id: 6, texto: '¿Recomendarías esta empresa para futuras prácticas?',                               tipo: 'escala' },
  { id: 7, texto: '¿Qué aspectos positivos destacas de tu experiencia en la empresa?',                 tipo: 'texto'  },
  { id: 8, texto: '¿Qué aspectos mejorarías del proceso de prácticas de la universidad?',              tipo: 'texto'  },
]
// ─────────────────────────────────────────────────────────────────────────
// FIN MOCK
// ─────────────────────────────────────────────────────────────────────────

export const estudianteApi = {

  getMiPractica: async () => {
    await delay()
    return db.practica
    // return api.get('/estudiante/practica').then(r => r.data)
  },

  getAvances: async () => {
    await delay()
    return db.avances
    // return api.get('/estudiante/avances').then(r => r.data)
  },

  crearAvance: async (data) => {
    await delay(600)
    const nuevo = {
      ...data,
      id:           ++nextId,
      practicaId:   1,
      fechaEntrega: new Date().toISOString().split('T')[0],
      comentarioDocente: null,
      estado:       'PENDIENTE',
      archivoUrl:   data.archivo ? `https://mock.firebase.com/avance_${nextId}.pdf` : null,
    }
    db.avances.push(nuevo)
    return nuevo
    // return api.post('/estudiante/avances', data).then(r => r.data)
  },

  getMisDocumentos: async () => {
    await delay()
    return db.documentos
    // return api.get('/estudiante/documentos').then(r => r.data)
  },

  subirDocumento: async (tipo) => {
    await delay(600)
    db.documentos[tipo] = {
      url:        `https://mock.firebase.com/${tipo}_${Date.now()}.pdf`,
      fechaCarga: new Date().toISOString().split('T')[0],
    }
    return db.documentos
    // return api.post(`/estudiante/documentos/${tipo}`, data).then(r => r.data)
  },

  getChecklist: async () => {
    await delay()
    return db.checklist
    // return api.get('/estudiante/checklist').then(r => r.data)
  },

  getEncuesta: async () => {
    await delay()
    return db.encuesta
    // return api.get('/estudiante/encuesta').then(r => r.data)
  },

  enviarEncuesta: async (respuestas) => {
    await delay(800)
    db.encuesta = { respuestas, fechaEnvio: new Date().toISOString() }
    // Actualizar checklist
    const item = db.checklist.find(c => c.id === 'encuesta_est')
    if (item) item.completado = true
    return db.encuesta
    // return api.post('/estudiante/encuesta', { respuestas }).then(r => r.data)
  },
}