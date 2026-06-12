import api from '@/lib/axios'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

const db = {
  // ── Estudiantes en seguimiento ──────────────────────────────────
  estudiantes: [
    {
      id: 4, nombre: 'Valentina García', programa: 'Ingeniería de Software', programaId: 1,
      semestre: 8, estadoAptitud: 'APTO', numeroPractica: 1, categoria: 'PROCESO',
      correo: 'v.garcia@universidad.edu.co',
      postulaciones: [
        { empresaNombre: 'TechCorp SAS', vacanteTitulo: 'Practicante Desarrollo Web', estado: 'EN_ENTREVISTA' },
        { empresaNombre: 'Soluciones Digitales', vacanteTitulo: 'Practicante Frontend', estado: 'EN_SELECCION' },
      ],
      historialPracticas: [
        { numero: 1, periodo: '2025-1', estado: 'EN_PROCESO_VINCULACION', empresaNombre: null },
      ],
    },
    {
      id: 9, nombre: 'Juliana Castillo', programa: 'Ingeniería Industrial', programaId: 2,
      semestre: 8, estadoAptitud: 'APTO', numeroPractica: 1, categoria: 'PROCESO',
      correo: 'j.castillo@universidad.edu.co',
      postulaciones: [
        { empresaNombre: 'Manufactura XYZ', vacanteTitulo: 'Practicante Ingeniería Industrial', estado: 'EN_SELECCION', convenioVence: '2026-08-20' },
      ],
      historialPracticas: [
        { numero: 1, periodo: '2025-1', estado: 'EN_PROCESO_VINCULACION', empresaNombre: null },
      ],
    },
    {
      id: 10, nombre: 'Laura Sánchez', programa: 'Turismo', programaId: 4,
      semestre: 8, estadoAptitud: 'APTO', numeroPractica: 1, categoria: 'PROCESO',
      correo: 'l.sanchez@universidad.edu.co',
      postulaciones: [
        { empresaNombre: 'Hotel Grand Plaza', vacanteTitulo: 'Practicante Recepción y Eventos', estado: 'EN_ENTREVISTA' },
        { empresaNombre: 'Aviatur S.A.', vacanteTitulo: 'Practicante Administración', estado: 'POSTULADO' },
      ],
      historialPracticas: [
        { numero: 1, periodo: '2025-1', estado: 'EN_PROCESO_VINCULACION', empresaNombre: null },
      ],
    },

    // ── En práctica (paz y salvo) ──────────────────────────────
    {
      id: 8, nombre: 'Sebastián Romero', programa: 'Ingeniería de Software', programaId: 1,
      semestre: 8, estadoAptitud: 'APTO', numeroPractica: 1, categoria: 'EN_PRACTICA',
      correo: 's.romero@universidad.edu.co',
      empresaNombre: 'TechCorp SAS',
      postulaciones: [
        { empresaNombre: 'TechCorp SAS', vacanteTitulo: 'Practicante Desarrollo Web', estado: 'SELECCIONADO' },
      ],
      historialPracticas: [
        { numero: 1, periodo: '2025-1', estado: 'EN_PRACTICA', empresaNombre: 'TechCorp SAS' },
      ],
      checklist: [
        { clave: 'NOTA_DOCENTE',       label: 'Nota del docente registrada',              completado: true  },
        { clave: 'NOTA_TUTOR',         label: 'Nota del tutor registrada',                completado: true  },
        { clave: 'NOTA_FINAL',         label: 'Nota final registrada',                    completado: true  },
        { clave: 'ENCUESTA_TUTOR',     label: 'Encuesta del tutor completada',            completado: false },
        { clave: 'ENCUESTA_ESTUDIANTE',label: 'Encuesta del estudiante completada',       completado: true  },
        { clave: 'DOCUMENTOS',         label: 'Documentos completos (ARL + contrato)',    completado: true  },
        { clave: 'INFORME_FINAL',      label: 'Informe final cargado',                    completado: false },
      ],
    },
    {
      id: 11, nombre: 'Felipe Herrera', programa: 'Ingeniería Industrial', programaId: 2,
      semestre: 9, estadoAptitud: 'APTO', numeroPractica: 2, categoria: 'EN_PRACTICA',
      correo: 'f.herrera@universidad.edu.co',
      empresaNombre: 'Manufactura XYZ',
      postulaciones: [],
      historialPracticas: [
        { numero: 1, periodo: '2024-2', estado: 'COMPLETADA', empresaNombre: 'Grupo ABC' },
        { numero: 2, periodo: '2025-1', estado: 'EN_PRACTICA', empresaNombre: 'Manufactura XYZ' },
      ],
      checklist: [
        { clave: 'NOTA_DOCENTE',       label: 'Nota del docente registrada',              completado: false },
        { clave: 'NOTA_TUTOR',         label: 'Nota del tutor registrada',                completado: false },
        { clave: 'NOTA_FINAL',         label: 'Nota final registrada',                    completado: false },
        { clave: 'ENCUESTA_TUTOR',     label: 'Encuesta del tutor completada',            completado: false },
        { clave: 'ENCUESTA_ESTUDIANTE',label: 'Encuesta del estudiante completada',       completado: false },
        { clave: 'DOCUMENTOS',         label: 'Documentos completos (ARL + contrato)',    completado: false },
        { clave: 'INFORME_FINAL',      label: 'Informe final cargado',                    completado: false },
      ],
    },
    {
      id: 12, nombre: 'Daniela Moreno', programa: 'Administración de Empresas', programaId: 3,
      semestre: 8, estadoAptitud: 'APTO', numeroPractica: 2, categoria: 'EN_PRACTICA',
      correo: 'd.moreno@universidad.edu.co',
      empresaNombre: 'Grupo Empresarial ABC',
      postulaciones: [],
      historialPracticas: [
        { numero: 1, periodo: '2024-2', estado: 'COMPLETADA', empresaNombre: 'Comercial Delta' },
        { numero: 2, periodo: '2025-1', estado: 'EN_PRACTICA', empresaNombre: 'Grupo Empresarial ABC' },
      ],
      checklist: [
        { clave: 'NOTA_DOCENTE',       label: 'Nota del docente registrada',              completado: true  },
        { clave: 'NOTA_TUTOR',         label: 'Nota del tutor registrada',                completado: true  },
        { clave: 'NOTA_FINAL',         label: 'Nota final registrada',                    completado: false },
        { clave: 'ENCUESTA_TUTOR',     label: 'Encuesta del tutor completada',            completado: true  },
        { clave: 'ENCUESTA_ESTUDIANTE',label: 'Encuesta del estudiante completada',       completado: false },
        { clave: 'DOCUMENTOS',         label: 'Documentos completos (ARL + contrato)',    completado: true  },
        { clave: 'INFORME_FINAL',      label: 'Informe final cargado',                    completado: false },
      ],
    },
  ],

  // ── Empresas con estudiantes seleccionados (para contratos) ─────
  empresasConSeleccionados: [
    {
      empresaId: 1, razonSocial: 'TechCorp SAS', nit: '900.123.456-7',
      nombreContacto: 'Carlos Ruiz', cedulaContacto: '1.045.678.901', municipio: 'Armenia',
      seleccionados: [
        {
          estudianteId: 8, nombre: 'Sebastián Romero', programa: 'Ingeniería de Software',
          programaId: 1, semestre: 8, correo: 's.romero@universidad.edu.co', numeroPractica: 1,
          vacanteTitulo: 'Practicante Desarrollo Web', salarioVacante: 1300000,
        },
      ],
    },
    {
      empresaId: 5, razonSocial: 'Manufactura XYZ', nit: '800.456.789-1',
      nombreContacto: 'María Elena Cruz', cedulaContacto: '43.234.567', municipio: 'Medellín',
      seleccionados: [
        {
          estudianteId: 11, nombre: 'Felipe Herrera', programa: 'Ingeniería Industrial',
          programaId: 2, semestre: 9, correo: 'f.herrera@universidad.edu.co', numeroPractica: 2,
          vacanteTitulo: 'Practicante Ingeniería Industrial', salarioVacante: 1200000,
        },
      ],
    },
  ],

  contratos: [
    {
      id: 1, estudianteId: 8, estudianteNombre: 'Sebastián Romero',
      empresaNombre: 'TechCorp SAS',
      tipoContrato: 'Contrato de aprendizaje',
      fechaInicio: '2025-02-03', fechaFin: '2025-07-31',
      valorMensual: 1300000, estado: 'FIRMADO',
      pdfUrl: 'https://mock.firebase.com/contrato_sebastian.pdf',
    },
    {
      id: 2, estudianteId: 12, estudianteNombre: 'Daniela Moreno',
      empresaNombre: 'Grupo Empresarial ABC',
      tipoContrato: 'Contrato universitario',
      fechaInicio: '2025-02-10', fechaFin: '2025-08-10',
      valorMensual: 1100000, estado: 'FIRMADO',
      pdfUrl: 'https://mock.firebase.com/contrato_daniela.pdf',
    },
  ],

  // ── Visitas ──────────────────────────────────────────────────
  visitas: [
    {
      id: 1, rol: 'COORDINADORA', responsable: 'Dra. Laura Bermúdez',
      empresaNombre: 'TechCorp SAS', estudianteNombre: null,
      fecha: '2025-04-20', duracionHoras: 2, motivo: 'VERIFICACION',
      observaciones: 'Buenas instalaciones, estudiantes bien integrados al equipo.',
    },
    {
      id: 2, rol: 'DOCENTE', responsable: 'Dra. Patricia Suárez',
      empresaNombre: 'Manufactura XYZ', estudianteNombre: 'Felipe Herrera',
      fecha: '2025-04-22', duracionHoras: 1.5, motivo: 'SEGUIMIENTO',
      observaciones: 'Se revisó el planeador y los avances. El estudiante va bien.',
    },
    {
      id: 3, rol: 'COORDINADORA', responsable: 'Dra. Laura Bermúdez',
      empresaNombre: 'Hotel Grand Plaza', estudianteNombre: null,
      fecha: '2025-04-18', duracionHoras: 1, motivo: 'RENOVACION_CONVENIO',
      observaciones: 'Reunión para evaluar renovación del convenio. La empresa está interesada en continuar.',
    },
  ],

  empresasActivas: [
    { id: 1, razonSocial: 'TechCorp SAS' },
    { id: 5, razonSocial: 'Manufactura XYZ' },
    { id: 6, razonSocial: 'Hotel Grand Plaza' },
    { id: 2, razonSocial: 'Grupo Empresarial ABC' },
    { id: 3, razonSocial: 'Aviatur S.A.' },
  ],
}

export const coordEmpresarialApi = {

  // ── Seguimiento de estudiantes ──────────────────────────────
  getEstudiantesSeguimiento: async () => {
    await delay()
    return db.estudiantes
    // return api.get('/coordinacion-empresarial/seguimiento').then(r => r.data)
  },

  getEstudianteHistorial: async (id) => {
    await delay()
    return db.estudiantes.find(e => e.id === Number(id)) ?? null
    // return api.get(`/estudiantes/${id}`).then(r => r.data) // + /estudiantes/{id}/practicas
  },

  // ── Contratos ────────────────────────────────────────────────
  getEmpresasConSeleccionados: async () => {
    await delay()
    return db.empresasConSeleccionados
    // return api.get('/contratos/empresas-disponibles').then(r => r.data)
  },

  getContratos: async () => {
    await delay()
    return [...db.contratos].reverse()
    // return api.get('/contratos').then(r => r.data)
  },

  generarContrato: async (data) => {
    await delay(900)
    const nuevo = {
      id: Date.now(),
      estudianteId:     data.estudianteId,
      estudianteNombre: data.estudianteNombre,
      empresaNombre:    data.empresaNombre,
      tipoContrato:     data.tipoContrato,
      fechaInicio:      data.fechaInicio,
      fechaFin:         data.fechaFin,
      valorMensual:     data.valorMensual,
      estado:           'GENERADO',
      pdfUrl:           '#', // el backend retorna la URL real del PDF generado
    }
    db.contratos.push(nuevo)
    return nuevo
    // return api.post('/contratos/generar', data).then(r => r.data)
    // El backend genera el PDF con los datos del contrato, lo sube a
    // Firebase Storage y retorna la URL en `pdfUrl`.
  },

  // ── Visitas ──────────────────────────────────────────────────
  getVisitas: async () => {
    await delay()
    return [...db.visitas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    // return api.get('/visitas').then(r => r.data)
  },

  getEmpresasActivas: async () => {
    await delay()
    return db.empresasActivas
    // return api.get('/empresas').then(r => r.data)
  },

  crearVisita: async (data) => {
    await delay(600)
    const nueva = { ...data, id: Date.now(), rol: 'COORDINADORA', responsable: 'Dra. Laura Bermúdez' }
    db.visitas.push(nueva)
    return nueva
    // return api.post('/visitas', data).then(r => r.data)
  },
}

export const MOTIVO_VISITA_LABEL = {
  VERIFICACION:         'Verificación de condiciones',
  SEGUIMIENTO:          'Seguimiento académico',
  RENOVACION_CONVENIO:  'Renovación de convenio',
  EVALUACION:           'Evaluación intermedia',
  OTRO:                 'Otro',
}

export const ESTADO_POSTULACION_LABEL = {
  POSTULADO:     { label: 'Postulado',           bg: '#e6f0fb', color: '#0B416B' },
  EN_SELECCION:  { label: 'En selección',         bg: '#f3e8ff', color: '#6d28d9' },
  EN_ENTREVISTA: { label: 'En entrevista',        bg: '#fff8e6', color: '#a07010' },
  SELECCIONADO:  { label: 'Seleccionado',         bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADO:     { label: 'Rechazado',            bg: '#fef0f0', color: '#c0392b' },
}