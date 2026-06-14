import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as XLSX from 'xlsx'
import api from '@/lib/axios'
import {
  FileBarChart2, FileText, Building2, ClipboardList,
  Download, Filter, Star, TrendingUp, TrendingDown, BarChart2,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap,
} from 'recharts'

// ── API ───────────────────────────────────────────────────────────────────────

const reportesApi = {
  getEstadoProceso: async (filtros) => {
    const params = new URLSearchParams()
    Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v) })
    try {
      const { data } = await api.get(`/reportes/estado-proceso?${params}`)
      return data ?? []
    } catch { return [] }
  },
  getNotas: async (filtros) => {
    const params = new URLSearchParams()
    Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v) })
    try {
      const { data } = await api.get(`/reportes/notas?${params}`)
      return data ?? []
    } catch { return [] }
  },
  getEmpresasVacantes: async (filtros) => {
    const params = new URLSearchParams()
    Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v) })
    try {
      const { data } = await api.get(`/reportes/empresas-vacantes?${params}`)
      return data ?? []
    } catch { return [] }
  },
  getEncuestas: async (filtros) => {
    const params = new URLSearchParams()
    Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v) })
    try {
      const { data } = await api.get(`/reportes/encuestas?${params}`)
      return data ?? null
    } catch { return null }
  },
}

// ── Helpers exportación ───────────────────────────────────────────────────────

function nombreArchivo(tipo, filtros) {
  const fecha = new Date().toISOString().split('T')[0]
  const prog  = filtros.programaId ? `_P${filtros.programaId}` : ''
  const per   = filtros.periodo    ? `_${filtros.periodo}`      : ''
  return `${tipo}${prog}${per}_${fecha}`
}

function exportarExcel(datos, columnas, nombre) {
  const filas = datos.map(fila =>
    Object.fromEntries(columnas.map(c => [c.header, fila[c.key] ?? '—']))
  )
  const ws = XLSX.utils.json_to_sheet(filas)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
  XLSX.writeFile(wb, `${nombre}.xlsx`)
}

function exportarPDF(datos, columnas, nombre, titulo) {
  // Genera HTML y lo imprime como PDF usando la API del navegador
  const filas = datos.map(fila =>
    `<tr>${columnas.map(c => `<td>${fila[c.key] ?? '—'}</td>`).join('')}</tr>`
  ).join('')

  const html = `
    <!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>${nombre}</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 11px; padding: 24px; }
      h1   { font-size: 15px; color: #023859; margin-bottom: 4px; }
      p    { font-size: 10px; color: #6b7a8d; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th   { background: #023859; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
      td   { padding: 5px 8px; border-bottom: 0.5px solid #e2e8f0; font-size: 10px; }
      tr:nth-child(even) td { background: #f7f9fb; }
    </style>
    </head><body>
    <h1>${titulo}</h1>
    <p>Generado el ${new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}</p>
    <table>
      <thead><tr>${columnas.map(c => `<th>${c.header}</th>`).join('')}</tr></thead>
      <tbody>${filas}</tbody>
    </table>
    </body></html>
  `
  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.print()
}

// ── Componentes UI reutilizables ──────────────────────────────────────────────

function FiltroInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wide block mb-1"
        style={{ color: '#023859' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 px-3 rounded-lg text-xs outline-none"
        style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
      />
    </div>
  )
}

function FiltroSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wide block mb-1"
        style={{ color: '#023859' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-9 px-3 rounded-lg text-xs outline-none"
        style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
        <option value="">Todos</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function BadgeResultado({ resultado }) {
  const cfg = resultado === 'APROBADO'  ? { label: 'Aprobado',  bg: '#eaf7f0', color: '#1a7a4a' }
            : resultado === 'REPROBADO' ? { label: 'Reprobado', bg: '#fef0f0', color: '#c0392b' }
            : { label: 'Pendiente', bg: '#fff8e6', color: '#a07010' }
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function TablaSkeleton({ cols = 5 }) {
  return (
    <div className="flex flex-col gap-1">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#f0f2f5' }} />
      ))}
    </div>
  )
}

function Vacio({ mensaje = 'Sin datos para los filtros seleccionados' }) {
  return (
    <div className="py-12 text-center rounded-xl"
      style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs" style={{ color: '#8a9bb0' }}>{mensaje}</p>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function ReportesPage() {
  const [tab, setTab] = useState('estado')

  const TABS = [
    { key: 'estado',   label: 'Estado del proceso', icon: <FileBarChart2 size={13} /> },
    { key: 'notas',    label: 'Notas',              icon: <FileText      size={13} /> },
    { key: 'empresas', label: 'Empresas',           icon: <Building2     size={13} /> },
    { key: 'encuestas',label: 'Encuestas',          icon: <ClipboardList size={13} /> },
    { key: 'graficas', label: 'Gráficas',           icon: <BarChart2     size={13} /> },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Reportes del sistema
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Datos en tiempo real · Exportación a Excel y PDF
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold transition-all"
            style={tab === t.key
              ? { background: '#023859', color: '#fff' }
              : { background: '#f4f6f9', color: '#6b7a8d' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {tab === 'estado'    && <TabEstadoProceso />}
      {tab === 'notas'     && <TabNotas />}
      {tab === 'empresas'  && <TabEmpresasVacantes />}
      {tab === 'encuestas' && <TabEncuestas />}
      {tab === 'graficas'  && <TabGraficas />}
    </div>
  )
}

// ── TAB 1: Estado del proceso ─────────────────────────────────────────────────

function TabEstadoProceso() {
  const [filtros, setFiltros] = useState({
    programaId: '', facultadId: '', periodo: '', numeroPractica: '',
  })
  const set = k => v => setFiltros(f => ({ ...f, [k]: v }))

  const { data: filas = [], isLoading } = useQuery({
    queryKey: ['reporte-estado', filtros],
    queryFn:  () => reportesApi.getEstadoProceso(filtros),
  })

  const columnas = [
    { key: 'programa',              header: 'Programa' },
    { key: 'facultad',              header: 'Facultad' },
    { key: 'numeroPractica',        header: 'N° Práctica' },
    { key: 'sinEvaluar',            header: 'Sin evaluar' },
    { key: 'aptos',                 header: 'Aptos' },
    { key: 'noAptos',               header: 'No aptos' },
    { key: 'asignadaPendienteInicio', header: 'Asignada' },
    { key: 'enProcesoVinculacion',  header: 'Vinculando' },
    { key: 'vinculada',             header: 'Vinculada' },
    { key: 'enPractica',            header: 'En práctica' },
    { key: 'completadas',           header: 'Completadas' },
    { key: 'reprobadas',            header: 'Reprobadas' },
    { key: 'canceladas',            header: 'Canceladas' },
    { key: 'totalEstudiantes',      header: 'Total' },
  ]

  // Totales
  const totales = filas.length > 0 ? columnas.slice(3).reduce((acc, c) => {
    acc[c.key] = filas.reduce((s, f) => s + (Number(f[c.key]) || 0), 0)
    return acc
  }, {}) : null

  const arch = nombreArchivo('EstadoProceso', filtros)

  return (
    <div className="flex flex-col gap-4">

      {/* Filtros */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} style={{ color: '#8a9bb0' }} />
          <p className="text-xs font-bold" style={{ color: '#023859' }}>Filtros</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <FiltroInput label="ID Programa"   value={filtros.programaId}    onChange={set('programaId')}    placeholder="Ej: 1" type="number" />
          <FiltroInput label="ID Facultad"   value={filtros.facultadId}    onChange={set('facultadId')}    placeholder="Ej: 2" type="number" />
          <FiltroInput label="Periodo"       value={filtros.periodo}       onChange={set('periodo')}       placeholder="Ej: 2025-1" />
          <FiltroInput label="N° Práctica"   value={filtros.numeroPractica} onChange={set('numeroPractica')} placeholder="1 o 2" type="number" />
        </div>
      </div>

      {/* Exportar */}
      {filas.length > 0 && (
        <div className="flex gap-2 justify-end">
          <button onClick={() => exportarExcel(filas, columnas, arch)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold"
            style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
            <Download size={11} /> Excel
          </button>
          <button onClick={() => exportarPDF(filas, columnas, arch, 'Reporte Estado del Proceso')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold"
            style={{ background: '#fef0f0', color: '#c0392b' }}>
            <Download size={11} /> PDF
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        {isLoading ? <div className="p-5"><TablaSkeleton cols={14} /></div>
        : filas.length === 0 ? <div className="p-5"><Vacio /></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#023859' }}>
                  {columnas.map(c => (
                    <th key={c.key} className="px-3 py-3 text-left text-[10px] font-bold text-white whitespace-nowrap">
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((f, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f7f9fb' }}>
                    <td className="px-3 py-2.5 font-semibold whitespace-nowrap"
                      style={{ color: '#023859' }}>{f.programa}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: '#6b7a8d' }}>
                      {f.facultad ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#6b7a8d' }}>
                      {f.numeroPractica ?? '—'}
                    </td>
                    {['sinEvaluar','aptos','noAptos','asignadaPendienteInicio',
                      'enProcesoVinculacion','vinculada','enPractica',
                      'completadas','reprobadas','canceladas'].map(k => (
                      <td key={k} className="px-3 py-2.5 text-center">
                        <span className="font-bold text-xs" style={{ color: '#023859' }}>
                          {f[k] ?? 0}
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-bold text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        {f.totalEstudiantes ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Fila de totales */}
                {totales && (
                  <tr style={{ background: '#f0f2f5', borderTop: '1.5px solid #dce4ec' }}>
                    <td className="px-3 py-2.5 font-bold text-[10px]" colSpan={3}
                      style={{ color: '#023859' }}>TOTALES</td>
                    {['sinEvaluar','aptos','noAptos','asignadaPendienteInicio',
                      'enProcesoVinculacion','vinculada','enPractica',
                      'completadas','reprobadas','canceladas','totalEstudiantes'].map(k => (
                      <td key={k} className="px-3 py-2.5 text-center">
                        <span className="font-bold text-xs" style={{ color: '#023859' }}>
                          {totales[k] ?? 0}
                        </span>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── TAB 2: Notas ──────────────────────────────────────────────────────────────

function TabNotas() {
  const [filtros, setFiltros] = useState({
    programaId: '', periodo: '', docenteId: '', empresaId: '', resultado: '',
  })
  const set = k => v => setFiltros(f => ({ ...f, [k]: v }))

  const { data: filas = [], isLoading } = useQuery({
    queryKey: ['reporte-notas', filtros],
    queryFn:  () => reportesApi.getNotas(filtros),
  })

  const columnas = [
    { key: 'estudianteNombre',        header: 'Estudiante' },
    { key: 'estudianteIdentificacion', header: 'Identificación' },
    { key: 'programa',                header: 'Programa' },
    { key: 'numeroPractica',          header: 'N° Práctica' },
    { key: 'empresaNombre',           header: 'Empresa' },
    { key: 'docenteNombre',           header: 'Docente asesor' },
    { key: 'notaDocente',             header: 'Nota docente' },
    { key: 'notaTutor',               header: 'Nota tutor' },
    { key: 'notaFinal',               header: 'Nota final' },
    { key: 'resultado',               header: 'Resultado' },
  ]

  const arch = nombreArchivo('Notas', filtros)

  // Estadísticas rápidas
  const aprobados  = filas.filter(f => f.resultado === 'APROBADO').length
  const reprobados = filas.filter(f => f.resultado === 'REPROBADO').length
  const pendientes = filas.filter(f => f.resultado === 'PENDIENTE').length
  const promedioFinal = filas.filter(f => f.notaFinal).length > 0
    ? (filas.filter(f => f.notaFinal).reduce((s, f) => s + Number(f.notaFinal), 0)
       / filas.filter(f => f.notaFinal).length).toFixed(2)
    : null

  return (
    <div className="flex flex-col gap-4">

      {/* Filtros */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} style={{ color: '#8a9bb0' }} />
          <p className="text-xs font-bold" style={{ color: '#023859' }}>Filtros</p>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <FiltroInput label="ID Programa"  value={filtros.programaId} onChange={set('programaId')} placeholder="Ej: 1" type="number" />
          <FiltroInput label="Periodo"      value={filtros.periodo}    onChange={set('periodo')}    placeholder="Ej: 2025-1" />
          <FiltroInput label="ID Docente"   value={filtros.docenteId}  onChange={set('docenteId')}  placeholder="Ej: 5" type="number" />
          <FiltroInput label="ID Empresa"   value={filtros.empresaId}  onChange={set('empresaId')}  placeholder="Ej: 3" type="number" />
          <FiltroSelect label="Resultado"   value={filtros.resultado}  onChange={set('resultado')}
            options={[
              { value: 'APROBADO',  label: 'Aprobado'  },
              { value: 'REPROBADO', label: 'Reprobado' },
              { value: 'PENDIENTE', label: 'Pendiente' },
            ]} />
        </div>
      </div>

      {/* Stats rápidas */}
      {filas.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total',        value: filas.length,  bg: '#f7f9fb', color: '#023859' },
            { label: 'Aprobados',    value: aprobados,     bg: '#eaf7f0', color: '#1a7a4a' },
            { label: 'Reprobados',   value: reprobados,    bg: '#fef0f0', color: '#c0392b' },
            { label: 'Promedio final', value: promedioFinal ?? '—', bg: '#e6f0fb', color: '#0B416B' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center"
              style={{ background: s.bg, border: `0.5px solid ${s.color}25` }}>
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px]"       style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Exportar */}
      {filas.length > 0 && (
        <div className="flex gap-2 justify-end">
          <button onClick={() => exportarExcel(filas, columnas, arch)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold"
            style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
            <Download size={11} /> Excel
          </button>
          <button onClick={() => exportarPDF(filas, columnas, arch, 'Reporte de Notas')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold"
            style={{ background: '#fef0f0', color: '#c0392b' }}>
            <Download size={11} /> PDF
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        {isLoading ? <div className="p-5"><TablaSkeleton /></div>
        : filas.length === 0 ? <div className="p-5"><Vacio /></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#023859' }}>
                  {columnas.map(c => (
                    <th key={c.key}
                      className="px-3 py-3 text-left text-[10px] font-bold text-white whitespace-nowrap">
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((f, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f7f9fb' }}>
                    <td className="px-3 py-2.5 font-semibold whitespace-nowrap"
                      style={{ color: '#023859' }}>{f.estudianteNombre}</td>
                    <td className="px-3 py-2.5" style={{ color: '#6b7a8d' }}>
                      {f.estudianteIdentificacion ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: '#6b7a8d' }}>
                      {f.programa}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#6b7a8d' }}>
                      {f.numeroPractica ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: '#6b7a8d' }}>
                      {f.empresaNombre ?? '—'}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: '#6b7a8d' }}>
                      {f.docenteNombre ?? '—'}
                    </td>
                    {['notaDocente','notaTutor','notaFinal'].map(k => (
                      <td key={k} className="px-3 py-2.5 text-center">
                        <span className="font-bold" style={{ color: '#023859' }}>
                          {f[k] != null ? Number(f[k]).toFixed(2) : '—'}
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <BadgeResultado resultado={f.resultado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── TAB 3: Empresas y vacantes ─────────────────────────────────────────────────

function TabEmpresasVacantes() {
  const [filtros, setFiltros] = useState({ sector: '', programaId: '', periodo: '' })
  const set = k => v => setFiltros(f => ({ ...f, [k]: v }))

  const { data: filas = [], isLoading } = useQuery({
    queryKey: ['reporte-empresas', filtros],
    queryFn:  () => reportesApi.getEmpresasVacantes(filtros),
  })

  const columnas = [
    { key: 'razonSocial',            header: 'Empresa' },
    { key: 'nit',                    header: 'NIT' },
    { key: 'sector',                 header: 'Sector' },
    { key: 'municipio',              header: 'Municipio' },
    { key: 'vacantesPendientes',     header: 'Vac. pendientes' },
    { key: 'vacantesActivas',        header: 'Vac. activas' },
    { key: 'vacantesCerradas',       header: 'Vac. cerradas' },
    { key: 'totalVacantes',          header: 'Total vacantes' },
    { key: 'practicantesHistoricos', header: 'Hist. practicantes' },
    { key: 'practicantesActivos',    header: 'Activos' },
    { key: 'practicantesCompletados', header: 'Completados' },
    { key: 'practicantesReprobados', header: 'Reprobados' },
    { key: 'tasaFinalizacionExitosa', header: 'Tasa éxito (%)' },
  ]

  const arch = nombreArchivo('EmpresasVacantes', filtros)

  // Top empresa
  const topEmpresa = filas.length > 0
    ? [...filas].sort((a, b) => b.tasaFinalizacionExitosa - a.tasaFinalizacionExitosa)[0]
    : null

  return (
    <div className="flex flex-col gap-4">

      {/* Filtros */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} style={{ color: '#8a9bb0' }} />
          <p className="text-xs font-bold" style={{ color: '#023859' }}>Filtros</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FiltroInput label="Sector"      value={filtros.sector}     onChange={set('sector')}     placeholder="Ej: Tecnología" />
          <FiltroInput label="ID Programa" value={filtros.programaId} onChange={set('programaId')} placeholder="Ej: 1" type="number" />
          <FiltroInput label="Periodo"     value={filtros.periodo}    onChange={set('periodo')}    placeholder="Ej: 2025-1" />
        </div>
      </div>

      {/* KPI top empresa */}
      {topEmpresa && (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1 rounded-xl p-4 flex items-start gap-3"
            style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
            <TrendingUp size={20} style={{ color: '#1a7a4a', flexShrink: 0 }} />
            <div>
              <p className="text-[10px]" style={{ color: '#1a7a4a' }}>Mayor tasa de éxito</p>
              <p className="text-xs font-bold" style={{ color: '#023859' }}>
                {topEmpresa.razonSocial}
              </p>
              <p className="text-lg font-bold" style={{ color: '#1a7a4a' }}>
                {topEmpresa.tasaFinalizacionExitosa}%
              </p>
            </div>
          </div>
          <div className="rounded-xl p-4 text-center"
            style={{ background: '#e6f0fb', border: '0.5px solid #c5d9f0' }}>
            <p className="text-2xl font-bold" style={{ color: '#0B416B' }}>
              {filas.reduce((s, f) => s + f.totalVacantes, 0)}
            </p>
            <p className="text-[10px]" style={{ color: '#0B416B' }}>Total vacantes</p>
          </div>
          <div className="rounded-xl p-4 text-center"
            style={{ background: '#f0f2f5', border: '0.5px solid #dce4ec' }}>
            <p className="text-2xl font-bold" style={{ color: '#023859' }}>
              {filas.reduce((s, f) => s + f.practicantesHistoricos, 0)}
            </p>
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Practicantes históricos</p>
          </div>
        </div>
      )}

      {/* Exportar */}
      {filas.length > 0 && (
        <div className="flex gap-2 justify-end">
          <button onClick={() => exportarExcel(filas, columnas, arch)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold"
            style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
            <Download size={11} /> Excel
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        {isLoading ? <div className="p-5"><TablaSkeleton /></div>
        : filas.length === 0 ? <div className="p-5"><Vacio /></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#023859' }}>
                  {columnas.map(c => (
                    <th key={c.key}
                      className="px-3 py-3 text-left text-[10px] font-bold text-white whitespace-nowrap">
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((f, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f7f9fb' }}>
                    <td className="px-3 py-2.5 font-semibold whitespace-nowrap"
                      style={{ color: '#023859' }}>{f.razonSocial}</td>
                    <td className="px-3 py-2.5" style={{ color: '#6b7a8d' }}>{f.nit ?? '—'}</td>
                    <td className="px-3 py-2.5" style={{ color: '#6b7a8d' }}>{f.sector ?? '—'}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap"
                      style={{ color: '#6b7a8d' }}>{f.municipio ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#a07010' }}>
                      {f.vacantesPendientes}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#0B416B' }}>
                      {f.vacantesActivas}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#6b7a8d' }}>
                      {f.vacantesCerradas}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold"
                      style={{ color: '#023859' }}>{f.totalVacantes}</td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#6b7a8d' }}>
                      {f.practicantesHistoricos}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#1a7a4a' }}>
                      {f.practicantesActivos}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#1a7a4a' }}>
                      {f.practicantesCompletados}
                    </td>
                    <td className="px-3 py-2.5 text-center" style={{ color: '#c0392b' }}>
                      {f.practicantesReprobados}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-bold text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: f.tasaFinalizacionExitosa >= 70 ? '#eaf7f0'
                            : f.tasaFinalizacionExitosa >= 40 ? '#fff8e6' : '#fef0f0',
                          color: f.tasaFinalizacionExitosa >= 70 ? '#1a7a4a'
                            : f.tasaFinalizacionExitosa >= 40 ? '#a07010' : '#c0392b',
                        }}>
                        {f.tasaFinalizacionExitosa}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── TAB 4: Encuestas ──────────────────────────────────────────────────────────

function TabEncuestas() {
  const [filtros, setFiltros] = useState({ programaId: '', periodo: '', tipo: '' })
  const set = k => v => setFiltros(f => ({ ...f, [k]: v }))

  const { data: reporte, isLoading } = useQuery({
    queryKey: ['reporte-encuestas', filtros],
    queryFn:  () => reportesApi.getEncuestas(filtros),
  })

  function exportarEncuestasExcel() {
    if (!reporte) return
    const arch = nombreArchivo('Encuestas', filtros)
    const wb = XLSX.utils.book_new()

    // Hoja 1: promedios por pregunta
    const preg = (reporte.promediosPorPregunta ?? []).map(p => ({
      'Pregunta':        p.textoPregunta,
      'Promedio':        p.promedio,
      'N° respuestas':   p.totalRespuestas,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(preg), 'Por pregunta')

    // Hoja 2: por empresa
    const emp = (reporte.promediosPorEmpresa ?? [])
      .filter(e => e.suficientesRespuestas)
      .map(e => ({
        'Empresa':        e.empresaNombre,
        'Promedio':       e.promedioGeneral,
        'N° respuestas':  e.totalRespuestas,
      }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(emp), 'Por empresa')

    // Hoja 3: por programa
    const prog = (reporte.promediosPorPrograma ?? []).map(p => ({
      'Programa':       p.programaNombre,
      'Promedio':       p.promedioGeneral,
      'N° respuestas':  p.totalRespuestas,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prog), 'Por programa')

    XLSX.writeFile(wb, `${arch}.xlsx`)
  }

  const promedioGlobal = reporte?.promediosPorPregunta?.length > 0
    ? (reporte.promediosPorPregunta.reduce((s, p) => s + p.promedio, 0)
       / reporte.promediosPorPregunta.length).toFixed(2)
    : null

  const mejorEmpresa = reporte?.promediosPorEmpresa
    ?.filter(e => e.suficientesRespuestas)
    ?.sort((a, b) => b.promedioGeneral - a.promedioGeneral)[0]

  const peorEmpresa = reporte?.promediosPorEmpresa
    ?.filter(e => e.suficientesRespuestas)
    ?.sort((a, b) => a.promedioGeneral - b.promedioGeneral)[0]

  return (
    <div className="flex flex-col gap-4">

      {/* Filtros */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} style={{ color: '#8a9bb0' }} />
          <p className="text-xs font-bold" style={{ color: '#023859' }}>Filtros</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FiltroInput label="ID Programa" value={filtros.programaId} onChange={set('programaId')} placeholder="Ej: 1" type="number" />
          <FiltroInput label="Periodo"     value={filtros.periodo}    onChange={set('periodo')}    placeholder="Ej: 2025-1" />
          <FiltroSelect label="Tipo" value={filtros.tipo} onChange={set('tipo')}
            options={[
              { value: 'ESTUDIANTE', label: 'Estudiante' },
              { value: 'TUTOR',      label: 'Tutor' },
            ]} />
        </div>
      </div>

      {isLoading ? <div className="p-5 bg-white rounded-xl" style={{ border: '0.5px solid #e2e8f0' }}><TablaSkeleton /></div>
      : !reporte ? <Vacio mensaje="No hay datos de encuestas aún" />
      : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total respuestas', value: reporte.totalRespuestas,
                bg: '#e6f0fb', color: '#0B416B' },
              { label: 'Tasa de respuesta', value: `${reporte.tasaRespuesta}%`,
                bg: reporte.tasaRespuesta >= 60 ? '#eaf7f0' : '#fff8e6',
                color: reporte.tasaRespuesta >= 60 ? '#1a7a4a' : '#a07010' },
              { label: 'Promedio global',   value: promedioGlobal ?? '—',
                bg: '#f7f9fb', color: '#023859' },
              { label: 'Empresas analizadas',
                value: reporte.promediosPorEmpresa?.filter(e => e.suficientesRespuestas).length ?? 0,
                bg: '#fff8e6', color: '#a07010' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4 text-center"
                style={{ background: s.bg, border: `0.5px solid ${s.color}25` }}>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px]"        style={{ color: s.color }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Mejor y peor empresa */}
          {(mejorEmpresa || peorEmpresa) && (
            <div className="grid grid-cols-2 gap-3">
              {mejorEmpresa && (
                <div className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
                  <TrendingUp size={18} style={{ color: '#1a7a4a', flexShrink: 0 }} />
                  <div>
                    <p className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                      Mejor evaluada
                    </p>
                    <p className="text-xs font-bold" style={{ color: '#023859' }}>
                      {mejorEmpresa.empresaNombre}
                    </p>
                    <p className="text-base font-bold" style={{ color: '#1a7a4a' }}>
                      {mejorEmpresa.promedioGeneral} / 5.0
                    </p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {mejorEmpresa.totalRespuestas} respuestas
                    </p>
                  </div>
                </div>
              )}
              {peorEmpresa && peorEmpresa !== mejorEmpresa && (
                <div className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
                  <TrendingDown size={18} style={{ color: '#c0392b', flexShrink: 0 }} />
                  <div>
                    <p className="text-[10px] font-semibold" style={{ color: '#c0392b' }}>
                      Menor puntuación
                    </p>
                    <p className="text-xs font-bold" style={{ color: '#023859' }}>
                      {peorEmpresa.empresaNombre}
                    </p>
                    <p className="text-base font-bold" style={{ color: '#c0392b' }}>
                      {peorEmpresa.promedioGeneral} / 5.0
                    </p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {peorEmpresa.totalRespuestas} respuestas
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exportar */}
          <div className="flex justify-end">
            <button onClick={exportarEncuestasExcel}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold"
              style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
              <Download size={11} /> Excel (3 hojas)
            </button>
          </div>

          {/* Promedios por pregunta */}
          {reporte.promediosPorPregunta?.length > 0 && (
            <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs font-bold mb-3 pb-2"
                style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
                Promedio por pregunta
              </p>
              <div className="flex flex-col gap-2">
                {reporte.promediosPorPregunta.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <p className="text-[10px] flex-1 min-w-0 truncate"
                      style={{ color: '#6b7a8d' }}
                      title={p.textoPregunta}>
                      {p.textoPregunta}
                    </p>
                    <div className="w-32 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: '#f0f2f5' }}>
                      <div className="h-1.5 rounded-full"
                        style={{
                          width: `${(p.promedio / 5) * 100}%`,
                          background: p.promedio >= 4 ? '#1a7a4a'
                            : p.promedio >= 3 ? '#a07010' : '#c0392b',
                        }} />
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 w-16 justify-end">
                      <Star size={10} style={{ color: '#a07010' }} fill="#a07010" />
                      <span className="text-[10px] font-bold" style={{ color: '#023859' }}>
                        {Number(p.promedio).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promedios por programa */}
          {reporte.promediosPorPrograma?.length > 0 && (
            <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs font-bold mb-3 pb-2"
                style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
                Promedio por programa
              </p>
              <div className="flex flex-col gap-1.5">
                {reporte.promediosPorPrograma.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {p.programaNombre}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        {p.totalRespuestas} resp.
                      </span>
                      <span className="text-sm font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: p.promedioGeneral >= 4 ? '#eaf7f0'
                            : p.promedioGeneral >= 3 ? '#fff8e6' : '#fef0f0',
                          color: p.promedioGeneral >= 4 ? '#1a7a4a'
                            : p.promedioGeneral >= 3 ? '#a07010' : '#c0392b',
                        }}>
                        {Number(p.promedioGeneral).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promedios por empresa — mínimo 5 respuestas */}
          {reporte.promediosPorEmpresa?.length > 0 && (
            <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-3 pb-2"
                style={{ borderBottom: '0.5px solid #f0f2f5' }}>
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Promedio por empresa
                </p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  Mínimo 5 respuestas para mostrar (confidencialidad)
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {reporte.promediosPorEmpresa
                  .filter(e => e.suficientesRespuestas)
                  .sort((a, b) => b.promedioGeneral - a.promedioGeneral)
                  .map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold w-5 text-center"
                        style={{ color: '#8a9bb0' }}>
                        {i + 1}
                      </span>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                        {e.empresaNombre}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        {e.totalRespuestas} resp.
                      </span>
                      <span className="text-sm font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: e.promedioGeneral >= 4 ? '#eaf7f0'
                            : e.promedioGeneral >= 3 ? '#fff8e6' : '#fef0f0',
                          color: e.promedioGeneral >= 4 ? '#1a7a4a'
                            : e.promedioGeneral >= 3 ? '#a07010' : '#c0392b',
                        }}>
                        {Number(e.promedioGeneral).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
                {reporte.promediosPorEmpresa.filter(e => !e.suficientesRespuestas).length > 0 && (
                  <p className="text-[10px] mt-1" style={{ color: '#c0c8d4' }}>
                    {reporte.promediosPorEmpresa.filter(e => !e.suficientesRespuestas).length} empresa(s)
                    con menos de 5 respuestas no se muestran por confidencialidad
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── TAB GRÁFICAS ──────────────────────────────────────────────────────────────

const COLORES_ESTADO = {
  enPractica:            '#0B416B',
  completadas:           '#1a7a4a',
  reprobadas:            '#c0392b',
  vinculada:             '#6d28d9',
  enProcesoVinculacion:  '#a07010',
  asignadaPendienteInicio: '#8a9bb0',
  canceladas:            '#e2e8f0',
  aptos:                 '#eaf7f0',
  noAptos:               '#fef0f0',
  sinEvaluar:            '#f0f2f5',
}

const COLORES_RESULTADO = ['#1a7a4a', '#c0392b', '#a07010']
const COLORES_EMPRESA   = ['#0B416B', '#D91438', '#1a7a4a', '#6d28d9', '#a07010', '#023859']

// Tooltip personalizado
function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-lg px-3 py-2"
      style={{ background: '#fff', border: '0.5px solid #e2e8f0', fontSize: 11 }}>
      {label && <p className="font-bold mb-1" style={{ color: '#023859' }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color ?? p.fill }} />
          <span style={{ color: '#6b7a8d' }}>{p.name}:</span>
          <span className="font-bold" style={{ color: '#023859' }}>
            {typeof p.value === 'number' && p.value % 1 !== 0
              ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function GraficaCard({ titulo, subtitulo, children, altura = 280 }) {
  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-0.5" style={{ color: '#023859' }}>{titulo}</p>
      {subtitulo && (
        <p className="text-[10px] mb-3" style={{ color: '#8a9bb0' }}>{subtitulo}</p>
      )}
      <div style={{ height: altura }}>
        {children}
      </div>
    </div>
  )
}

function TabGraficas() {
  // Carga todos los datos sin filtros para una visión global
  const { data: estadoData = [], isLoading: l1 } = useQuery({
    queryKey: ['reporte-estado', {}],
    queryFn:  () => reportesApi.getEstadoProceso({}),
  })
  const { data: notasData = [], isLoading: l2 } = useQuery({
    queryKey: ['reporte-notas', {}],
    queryFn:  () => reportesApi.getNotas({}),
  })
  const { data: empresasData = [], isLoading: l3 } = useQuery({
    queryKey: ['reporte-empresas', {}],
    queryFn:  () => reportesApi.getEmpresasVacantes({}),
  })
  const { data: encuestasData, isLoading: l4 } = useQuery({
    queryKey: ['reporte-encuestas', {}],
    queryFn:  () => reportesApi.getEncuestas({}),
  })

  const isLoading = l1 || l2 || l3 || l4

  if (isLoading) return (
    <div className="grid grid-cols-2 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse"
          style={{ border: '0.5px solid #e2e8f0', height: 320 }} />
      ))}
    </div>
  )

  // ── Datos para cada gráfica ────────────────────────────────────────────────

  // 1. Barras apiladas: estados por programa
  const datosEstado = estadoData.map(f => ({
    name:       f.programa?.length > 20 ? f.programa.slice(0, 20) + '…' : f.programa,
    'En práctica':   f.enPractica    ?? 0,
    'Completadas':   f.completadas   ?? 0,
    'Reprobadas':    f.reprobadas    ?? 0,
    'Vinculada':     f.vinculada     ?? 0,
    'Vinculando':    f.enProcesoVinculacion ?? 0,
    'Asignada':      f.asignadaPendienteInicio ?? 0,
  }))

  // 2. Dona: distribución de resultados
  const aprobados  = notasData.filter(n => n.resultado === 'APROBADO').length
  const reprobados = notasData.filter(n => n.resultado === 'REPROBADO').length
  const pendientes = notasData.filter(n => n.resultado === 'PENDIENTE').length
  const datosResultados = [
    { name: 'Aprobado',  value: aprobados  },
    { name: 'Reprobado', value: reprobados },
    { name: 'Pendiente', value: pendientes },
  ].filter(d => d.value > 0)

  // 3. Barras horizontales: top 8 empresas por tasa de éxito
  const datosEmpresas = [...empresasData]
    .filter(e => e.practicantesHistoricos > 0)
    .sort((a, b) => b.tasaFinalizacionExitosa - a.tasaFinalizacionExitosa)
    .slice(0, 8)
    .map(e => ({
      name:  e.razonSocial?.length > 22 ? e.razonSocial.slice(0, 22) + '…' : e.razonSocial,
      'Tasa éxito (%)': e.tasaFinalizacionExitosa,
      'Activos':        e.practicantesActivos,
      'Completados':    e.practicantesCompletados,
    }))

  // 4. Radar: promedio por pregunta (encuestas)
  const datosRadar = (encuestasData?.promediosPorPregunta ?? []).slice(0, 8).map((p, i) => ({
    pregunta: `P${i + 1}`,
    texto:    p.textoPregunta,
    promedio: Number(p.promedio.toFixed(1)),
    fullMark: 5,
  }))

  // 5. Barras: vacantes por estado (top 8 empresas con más vacantes)
  const datosVacantes = [...empresasData]
    .sort((a, b) => b.totalVacantes - a.totalVacantes)
    .slice(0, 8)
    .map(e => ({
      name:       e.razonSocial?.length > 18 ? e.razonSocial.slice(0, 18) + '…' : e.razonSocial,
      'Pendientes': e.vacantesPendientes,
      'Activas':    e.vacantesActivas,
      'Cerradas':   e.vacantesCerradas,
    }))

  // 6. Barras: promedios de encuestas por programa
  const datosPrograma = (encuestasData?.promediosPorPrograma ?? []).map(p => ({
    name:     p.programaNombre?.length > 20 ? p.programaNombre.slice(0, 20) + '…' : p.programaNombre,
    Promedio: Number(p.promedioGeneral.toFixed(1)),
    'N° resp': p.totalRespuestas,
  }))

  // ── KPIs globales ──────────────────────────────────────────────────────────

  const totalEstudiantes  = estadoData.reduce((s, f) => s + (f.totalEstudiantes ?? 0), 0)
  const totalEnPractica   = estadoData.reduce((s, f) => s + (f.enPractica ?? 0), 0)
  const totalCompletadas  = estadoData.reduce((s, f) => s + (f.completadas ?? 0), 0)
  const totalVacantes     = empresasData.reduce((s, e) => s + e.totalVacantes, 0)
  const promedioGlobal    = encuestasData?.promediosPorPregunta?.length > 0
    ? (encuestasData.promediosPorPregunta.reduce((s, p) => s + p.promedio, 0)
       / encuestasData.promediosPorPregunta.length).toFixed(1)
    : null
  const tasaAprobacion = notasData.filter(n => n.resultado !== 'PENDIENTE').length > 0
    ? Math.round(aprobados / notasData.filter(n => n.resultado !== 'PENDIENTE').length * 100)
    : null

  return (
    <div className="flex flex-col gap-4">

      {/* KPIs globales */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: 'Estudiantes',    value: totalEstudiantes, bg: '#f7f9fb', color: '#023859' },
          { label: 'En práctica',    value: totalEnPractica,  bg: '#e6f0fb', color: '#0B416B' },
          { label: 'Completadas',    value: totalCompletadas, bg: '#eaf7f0', color: '#1a7a4a' },
          { label: 'Vacantes',       value: totalVacantes,    bg: '#fff8e6', color: '#a07010' },
          { label: 'Tasa aprobación',value: tasaAprobacion != null ? `${tasaAprobacion}%` : '—',
            bg: tasaAprobacion >= 70 ? '#eaf7f0' : '#fef0f0',
            color: tasaAprobacion >= 70 ? '#1a7a4a' : '#c0392b' },
          { label: 'Prom. encuestas',value: promedioGlobal != null ? `${promedioGlobal}/5` : '—',
            bg: '#f3e8ff', color: '#6d28d9' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-3 text-center"
            style={{ background: k.bg, border: `0.5px solid ${k.color}20` }}>
            <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[9px] mt-0.5" style={{ color: k.color }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Fila 1: Estados + Dona resultados */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <GraficaCard
            titulo="Distribución de estados por programa"
            subtitulo="Número de estudiantes en cada estado del proceso">
            {datosEstado.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin datos</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosEstado} margin={{ top: 4, right: 8, left: -16, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8a9bb0' }}
                    angle={-30} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 9, fill: '#8a9bb0' }} />
                  <Tooltip content={<TooltipCustom />} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 8 }} />
                  <Bar dataKey="En práctica"  stackId="a" fill="#0B416B" radius={[0,0,0,0]} />
                  <Bar dataKey="Completadas"  stackId="a" fill="#1a7a4a" />
                  <Bar dataKey="Reprobadas"   stackId="a" fill="#c0392b" />
                  <Bar dataKey="Vinculada"    stackId="a" fill="#6d28d9" />
                  <Bar dataKey="Vinculando"   stackId="a" fill="#a07010" />
                  <Bar dataKey="Asignada"     stackId="a" fill="#8a9bb0" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GraficaCard>
        </div>

        <GraficaCard
          titulo="Resultados de notas"
          subtitulo="Distribución de aprobados / reprobados">
          {datosResultados.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin notas registradas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosResultados}
                  cx="50%" cy="45%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}>
                  {datosResultados.map((_, i) => (
                    <Cell key={i} fill={COLORES_RESULTADO[i]} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipCustom />} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </GraficaCard>
      </div>

      {/* Fila 2: Top empresas tasa éxito + Vacantes por empresa */}
      <div className="grid grid-cols-2 gap-4">
        <GraficaCard
          titulo="Top empresas — tasa de éxito"
          subtitulo="% de prácticas completadas exitosamente"
          altura={300}>
          {datosEmpresas.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin datos de empresas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosEmpresas}
                layout="vertical"
                margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: '#8a9bb0' }}
                  tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" width={100}
                  tick={{ fontSize: 9, fill: '#6b7a8d' }} />
                <Tooltip content={<TooltipCustom />} />
                <Bar dataKey="Tasa éxito (%)" radius={[0, 4, 4, 0]}>
                  {datosEmpresas.map((e, i) => (
                    <Cell key={i}
                      fill={e['Tasa éxito (%)'] >= 70 ? '#1a7a4a'
                        : e['Tasa éxito (%)'] >= 40 ? '#a07010' : '#c0392b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </GraficaCard>

        <GraficaCard
          titulo="Vacantes por empresa"
          subtitulo="Top 8 empresas con más vacantes registradas"
          altura={300}>
          {datosVacantes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin vacantes</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosVacantes}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#8a9bb0' }} />
                <YAxis type="category" dataKey="name" width={100}
                  tick={{ fontSize: 9, fill: '#6b7a8d' }} />
                <Tooltip content={<TooltipCustom />} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="Activas"    stackId="v" fill="#0B416B" />
                <Bar dataKey="Pendientes" stackId="v" fill="#a07010" />
                <Bar dataKey="Cerradas"   stackId="v" fill="#8a9bb0" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GraficaCard>
      </div>

      {/* Fila 3: Radar encuestas + Promedios por programa */}
      <div className="grid grid-cols-2 gap-4">
        <GraficaCard
          titulo="Radar de satisfacción por pregunta"
          subtitulo="Promedio de respuestas de escala (0–5)"
          altura={300}>
          {datosRadar.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin encuestas respondidas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={datosRadar} cx="50%" cy="50%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="pregunta"
                  tick={{ fontSize: 10, fill: '#6b7a8d' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]}
                  tick={{ fontSize: 8, fill: '#8a9bb0' }} />
                <Radar name="Promedio" dataKey="promedio"
                  stroke="#D91438" fill="#D91438" fillOpacity={0.2}
                  strokeWidth={2} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]?.payload
                  return (
                    <div className="rounded-xl shadow px-3 py-2"
                      style={{ background: '#fff', border: '0.5px solid #e2e8f0', fontSize: 10 }}>
                      <p className="font-bold" style={{ color: '#023859' }}>
                        {d?.pregunta}: {d?.promedio}
                      </p>
                      <p style={{ color: '#6b7a8d', maxWidth: 200 }}>{d?.texto}</p>
                    </div>
                  )
                }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </GraficaCard>

        <GraficaCard
          titulo="Satisfacción por programa"
          subtitulo="Promedio general de encuestas por programa académico"
          altura={300}>
          {datosPrograma.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin datos</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosPrograma} margin={{ top: 4, right: 8, left: -16, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8a9bb0' }}
                  angle={-30} textAnchor="end" interval={0} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 9, fill: '#8a9bb0' }} />
                <Tooltip content={<TooltipCustom />} />
                <Bar dataKey="Promedio" radius={[4, 4, 0, 0]}>
                  {datosPrograma.map((d, i) => (
                    <Cell key={i}
                      fill={d.Promedio >= 4 ? '#1a7a4a'
                        : d.Promedio >= 3 ? '#a07010' : '#c0392b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </GraficaCard>
      </div>

      {/* Nota al pie */}
      <p className="text-[10px] text-center" style={{ color: '#c0c8d4' }}>
        Las gráficas muestran datos globales sin filtros. Para filtrar usa los tabs individuales.
      </p>
    </div>
  )
}