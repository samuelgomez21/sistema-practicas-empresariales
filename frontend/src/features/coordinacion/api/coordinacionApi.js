import api from '@/lib/axios'

export const coordinacionApi = {

  // ── Estudiantes ────────────────────────────────────────────────
  getEstudiantes: async () => {
    const { data } = await api.get('/estudiantes/clasificacion')
    return data
    // [{ id, nombre, programa, programaId, semestre, creditosAprobados,
    //    promedioAcumulado, estadoAptitud, numeroPractica, docenteId,
    //    docenteNombre, empresaNombre, practicaId }]
  },

  evaluarAptitud: async (estudianteId, _numeroPractica, estadoManual) => {
    const { data } = await api.patch(`/estudiantes/${estudianteId}/aptitud`, {
      estadoAptitud: estadoManual,
    })
    return data
  },

  crearPracticaAutomatica: async (estudianteId, catalogoId) => {
    const { data } = await api.post(
      `/practicas/crear-automatica?estudianteId=${estudianteId}&catalogoId=${catalogoId}`
    )
    return data
  },

  // ── Docentes ───────────────────────────────────────────────────
  getDocentes: async () => {
    const { data } = await api.get('/usuarios/docentes-carga')
    return data
    // [{ id, nombre, correo, maxEstudiantes, estudiantesActivos: [{id,nombre,programa,semestre}] }]
  },

  actualizarMaxEstudiantes: async (docenteId, max) => {
    await api.patch(`/usuarios/${docenteId}/max-estudiantes`, { max: Number(max) })
    return { id: docenteId, maxEstudiantes: Number(max) }
  },

  asignarDocente: async (practicaId, docenteId) => {
    const { data } = await api.patch(`/practicas/${practicaId}/asignar-docente`, { docenteId })
    return data
  },

  // ── Catálogos / Programas ────────────────────────────────────────
  getCatalogos: async (programaId) => {
    const { data } = await api.get(`/configuracion/programas/${programaId}/catalogos`)
    return data.map(c => ({
      id: c.id,
      nombre: c.nombre,
      numeroPractica: c.numeroPractica,
      programaId: c.programa?.id ?? c.programaId,
    }))
  },

  getProgramas: async () => {
    const { data } = await api.get('/programas')
    return data
    // [{ id, nombre, ... }]
  },
}

export const APTITUD_CONFIG = {
  APTO:        { label: 'Apto',        bg: '#eaf7f0', color: '#1a7a4a', dot: '#1a7a4a' },
  EN_REVISION: { label: 'En riesgo',   bg: '#fff8e6', color: '#a07010', dot: '#a07010' },
  NO_APTO:     { label: 'No apto',     bg: '#fef0f0', color: '#c0392b', dot: '#c0392b' },
  SIN_EVALUAR: { label: 'Sin evaluar', bg: '#f0f2f5', color: '#6b7a8d', dot: '#8a9bb0' },
}