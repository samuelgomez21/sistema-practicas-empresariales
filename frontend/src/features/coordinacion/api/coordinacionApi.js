import api from '@/lib/axios'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

const db = {
  estudiantes: [
    {
      id: 1, nombre: 'Daniela Moreno', programa: 'Administración de Empresas',
      programaId: 3, semestre: 8, creditosAprobados: 120, promedioAcumulado: 3.8,
      estadoAptitud: 'APTO', numeroPractica: 2, docenteId: 1, docenteNombre: 'Dr. Luis Vargas',
      empresaNombre: 'Grupo Empresarial ABC', practicaId: 1,
    },
    {
      id: 2, nombre: 'Miguel Ángel Pérez', programa: 'Administración de Empresas',
      programaId: 3, semestre: 8, creditosAprobados: 98, promedioAcumulado: 3.2,
      estadoAptitud: 'EN_REVISION', numeroPractica: 1, docenteId: null, docenteNombre: null,
      empresaNombre: null, practicaId: null,
    },
    {
      id: 3, nombre: 'Carlos Mendoza', programa: 'Ingeniería de Software',
      programaId: 1, semestre: 8, creditosAprobados: 148, promedioAcumulado: 4.1,
      estadoAptitud: 'APTO', numeroPractica: 1, docenteId: 2, docenteNombre: 'Dr. Ramírez',
      empresaNombre: 'TechCo S.A.S.', practicaId: 2,
    },
    {
      id: 4, nombre: 'Ana García', programa: 'Ingeniería de Software',
      programaId: 1, semestre: 9, creditosAprobados: 160, promedioAcumulado: 4.5,
      estadoAptitud: 'APTO', numeroPractica: 2, docenteId: null, docenteNombre: null,
      empresaNombre: null, practicaId: null,
    },
    {
      id: 5, nombre: 'Pedro López', programa: 'Ingeniería de Software',
      programaId: 1, semestre: 7, creditosAprobados: 85, promedioAcumulado: 2.8,
      estadoAptitud: 'NO_APTO', numeroPractica: 1, docenteId: null, docenteNombre: null,
      empresaNombre: null, practicaId: null,
    },
  ],

  docentes: [
    {
      id: 1, nombre: 'Dr. Luis Vargas', correo: 'l.vargas@universidad.edu.co',
      facultad: 'Ciencias Económicas y Administrativas',
      programa: 'Administración de Empresas',
      dedicacion: 'Tiempo completo',
      maxEstudiantes: 10,
      estudiantesActivos: [
        { id: 1, nombre: 'Daniela Moreno', programa: 'Administración de Empresas', semestre: 8 },
      ],
    },
    {
      id: 2, nombre: 'Dr. Ramírez', correo: 'ramirez@universidad.edu.co',
      facultad: 'Ingeniería',
      programa: 'Ingeniería de Software',
      dedicacion: 'Tiempo completo',
      maxEstudiantes: 8,
      estudiantesActivos: [
        { id: 3, nombre: 'Carlos Mendoza', programa: 'Ingeniería de Software', semestre: 8 },
      ],
    },
    {
      id: 3, nombre: 'Dra. Sofía Herrera', correo: 's.herrera@universidad.edu.co',
      facultad: 'Ingeniería',
      programa: 'Ingeniería de Software',
      dedicacion: 'Medio tiempo',
      maxEstudiantes: 5,
      estudiantesActivos: [],
    },
    {
      id: 4, nombre: 'Dr. Martínez', correo: 'martinez@universidad.edu.co',
      facultad: 'Ciencias Económicas y Administrativas',
      programa: 'Administración de Empresas',
      dedicacion: 'Tiempo completo',
      maxEstudiantes: 10,
      estudiantesActivos: [],
    },
  ],

  programas: [
    { id: 1, nombre: 'Ingeniería de Software' },
    { id: 3, nombre: 'Administración de Empresas' },
    { id: 2, nombre: 'Ingeniería Industrial' },
    { id: 4, nombre: 'Turismo' },
  ],

  catalogos: [
    { id: 1, nombre: 'Práctica I',  numeroPractica: 1, programaId: 1 },
    { id: 2, nombre: 'Práctica II', numeroPractica: 2, programaId: 1 },
    { id: 3, nombre: 'Práctica I',  numeroPractica: 1, programaId: 3 },
    { id: 4, nombre: 'Práctica II', numeroPractica: 2, programaId: 3 },
  ],
}

export const coordinacionApi = {

  // ── Estudiantes ────────────────────────────────────────────────
  getEstudiantes: async () => {
    await delay()
    return db.estudiantes
    // return api.get('/estudiantes').then(r => r.data)
  },

  evaluarAptitud: async (estudianteId, numeroPractica, estadoManual) => {
    await delay(600)
    const est = db.estudiantes.find(e => e.id === estudianteId)
    est.estadoAptitud  = estadoManual
    est.numeroPractica = numeroPractica
    return est
    // return api.post(`/estudiantes/${estudianteId}/evaluar-aptitud/${numeroPractica}`).then(r => r.data)
  },

  crearPracticaAutomatica: async (estudianteId, catalogoId) => {
    await delay(600)
    const est = db.estudiantes.find(e => e.id === estudianteId)
    est.practicaId = Math.floor(Math.random() * 1000) + 10
    return { id: est.practicaId, estudianteId, catalogoId }
    // return api.post(`/practicas/crear-automatica?estudianteId=${estudianteId}&catalogoId=${catalogoId}`).then(r => r.data)
  },

  // ── Docentes ───────────────────────────────────────────────────
  getDocentes: async () => {
    await delay()
    return db.docentes
    // return api.get('/usuarios?rol=DOCENTE_ASESOR').then(r => r.data)
  },

  actualizarMaxEstudiantes: async (docenteId, max) => {
    await delay()
    const d = db.docentes.find(d => d.id === docenteId)
    d.maxEstudiantes = max
    return d
    // return api.patch(`/docentes/${docenteId}/max-estudiantes`, { max }).then(r => r.data)
  },

  asignarDocente: async (practicaId, docenteId) => {
    await delay(600)
    const est = db.estudiantes.find(e => e.practicaId === practicaId)
    const doc = db.docentes.find(d => d.id === docenteId)
    if (est) {
      est.docenteId     = docenteId
      est.docenteNombre = doc?.nombre
    }
    // Agregar al docente
    if (doc && !doc.estudiantesActivos.find(e => e.id === est?.id)) {
      doc.estudiantesActivos.push({
        id:       est.id,
        nombre:   est.nombre,
        programa: est.programa,
        semestre: est.semestre,
      })
    }
    return est
    // return api.patch(`/practicas/${practicaId}/asignar-docente`, { docenteId }).then(r => r.data)
  },

  getCatalogos: async (programaId) => {
    await delay()
    return db.catalogos.filter(c => c.programaId === programaId)
    // return api.get(`/configuracion/programas/${programaId}/catalogos`).then(r => r.data)
  },

  getProgramas: async () => {
    await delay()
    return db.programas
    // return api.get('/configuracion/programas').then(r => r.data)
  },
}

export const APTITUD_CONFIG = {
  APTO:        { label: 'Apto',        bg: '#eaf7f0', color: '#1a7a4a', dot: '#1a7a4a' },
  EN_REVISION: { label: 'En riesgo',   bg: '#fff8e6', color: '#a07010', dot: '#a07010' },
  NO_APTO:     { label: 'No apto',     bg: '#fef0f0', color: '#c0392b', dot: '#c0392b' },
  SIN_EVALUAR: { label: 'Sin evaluar', bg: '#f0f2f5', color: '#6b7a8d', dot: '#8a9bb0' },
}