import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis,
} from 'recharts'
import {
  TrendingUp, Users, Building2, Award, BookOpen,
  Filter, ChevronDown, CheckCircle, XCircle, Clock,
} from 'lucide-react'

// ── Paleta UAH ────────────────────────────────────────────────────────────────
const C = {
  rojo:       '#D91438',
  azulOscuro: '#023859',
  azulMedio:  '#0B416B',
  azulClaro:  '#e6f0fb',
  verde:      '#1a7a4a',
  verdeClaro: '#eaf7f0',
  naranja:    '#a07010',
  naranjaClaro: '#fff8e6',
  gris:       '#8a9bb0',
  grisClaro:  '#f7f9fb',
  morado:     '#6d28d9',
  moradoClaro:'#f3e8ff',
}

const COLORES_ESTADOS = [
  C.verdeClaro, C.azulClaro, C.moradoClaro, C.naranjaClaro,
  '#fde6ea', '#f0f2f5',
]

const COLORES_RESULTADO = {
  APROBADO:  C.verde,
  REPROBADO: C.rojo,
  PENDIENTE: C.gris,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pct(v, t) { return t > 0 ? Math.round((v / t) * 100) : 0 }

function StatCard({ label, value, sub, color, bg, icon: Icon }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1"
      style={{ background: bg ?? C.grisClaro, border: `0.5px solid ${color}25` }}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: C.gris }}>{label}</p>
        {Icon && <Icon size={14} style={{ color }} />}
      </div>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px]" style={{ color: C.gris }}>{sub}</p>}
    </div>
  )
}

function Seccion({ titulo, children }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
        style={{ color: C.gris }}>
        {titulo}
      </p>
      {children}
    </div>
  )
}

// ── Filtros ───────────────────────────────────────────────────────────────────

function FiltroBar({ programas, facultades, filtros, onChange }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 flex-wrap"
      style={{ border: `0.5px solid #e2e8f0` }}>
      <Filter size={14} style={{ color: C.gris }} />

      {/* Facultad */}
      <select
        value={filtros.facultadId ?? ''}
        onChange={e => onChange({ ...filtros, facultadId: e.target.value || null, programaId: null })}
        className="h-8 px-3 rounded-lg text-xs outline-none"
        style={{ border: `1px solid #dce4ec`, background: C.grisClaro, color: C.azulOscuro }}>
        <option value="">Todas las facultades</option>
        {facultades.map(f => (
          <option key={f.id} value={f.id}>{f.nombre}</option>
        ))}
      </select>

      {/* Programa */}
      <select
        value={filtros.programaId ?? ''}
        onChange={e => onChange({ ...filtros, programaId: e.target.value || null })}
        className="h-8 px-3 rounded-lg text-xs outline-none"
        style={{ border: `1px solid #dce4ec`, background: C.grisClaro, color: C.azulOscuro }}>
        <option value="">Todos los programas</option>
        {programas
          .filter(p => !filtros.facultadId || String(p.facultadId) === String(filtros.facultadId))
          .map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
      </select>

      {/* Número práctica */}
      <select
        value={filtros.numeroPractica ?? ''}
        onChange={e => onChange({ ...filtros, numeroPractica: e.target.value || null })}
        className="h-8 px-3 rounded-lg text-xs outline-none"
        style={{ border: `1px solid #dce4ec`, background: C.grisClaro, color: C.azulOscuro }}>
        <option value="">Todas las prácticas</option>
        <option value="1">Práctica 1</option>
        <option value="2">Práctica 2</option>
      </select>

      {/* Limpiar */}
      {(filtros.facultadId || filtros.programaId || filtros.numeroPractica) && (
        <button
          onClick={() => onChange({ facultadId: null, programaId: null, numeroPractica: null })}
          className="h-8 px-3 rounded-lg text-xs font-semibold"
          style={{ background: '#fde6ea', color: C.rojo }}>
          Limpiar filtros
        </button>
      )}

      <span className="ml-auto text-[10px]" style={{ color: C.gris }}>
        {filtros.programaId
          ? programas.find(p => String(p.id) === String(filtros.programaId))?.nombre
          : filtros.facultadId
            ? facultades.find(f => String(f.id) === String(filtros.facultadId))?.nombre
            : 'Vista global'}
      </span>
    </div>
  )
}

// ── Tooltip personalizado ─────────────────────────────────────────────────────

function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 shadow-lg"
      style={{ background: C.azulOscuro, border: 'none' }}>
      <p className="text-[10px] font-bold text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[10px]" style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function DashboardDireccionPage() {
  const [filtros, setFiltros] = useState({
    facultadId: null,
    programaId: null,
    numeroPractica: null,
  })

  // ── Datos base ─────────────────────────────────────────────────────────────

  const { data: facultades = [] } = useQuery({
    queryKey: ['facultades-dir'],
    queryFn:  async () => {
      const { data } = await api.get('/facultades')
      return data ?? []
    },
  })

  const { data: programas = [] } = useQuery({
    queryKey: ['programas-dir'],
    queryFn:  async () => {
      const { data } = await api.get('/programas')
      return data ?? []
    },
  })

  // ── Reportes ───────────────────────────────────────────────────────────────

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (filtros.facultadId)    p.set('facultadId', filtros.facultadId)
    if (filtros.programaId)    p.set('programaId', filtros.programaId)
    if (filtros.numeroPractica) p.set('numeroPractica', filtros.numeroPractica)
    return p.toString()
  }, [filtros])

  const { data: estadoProceso = [], isLoading: loadingEstado } = useQuery({
    queryKey: ['dir-estado-proceso', params],
    queryFn:  async () => {
      const { data } = await api.get(`/reportes/estado-proceso?${params}`)
      return data ?? []
    },
  })

  const { data: notas = [], isLoading: loadingNotas } = useQuery({
    queryKey: ['dir-notas', params],
    queryFn:  async () => {
      const { data } = await api.get(`/reportes/notas?${params}`)
      return data ?? []
    },
  })

  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ['dir-empresas', params],
    queryFn:  async () => {
      const { data } = await api.get(`/reportes/empresas-vacantes?${params}`)
      return data ?? []
    },
  })

  const { data: encuestas, isLoading: loadingEncuestas } = useQuery({
    queryKey: ['dir-encuestas', params],
    queryFn:  async () => {
      const p2 = new URLSearchParams(params)
      p2.set('tipo', 'ESTUDIANTE')
      const { data } = await api.get(`/reportes/encuestas?${p2}`)
      return data
    },
  })

  // ── KPIs calculados ────────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const total     = estadoProceso.reduce((s, r) => s + (r.totalEstudiantes ?? 0), 0)
    const enPract   = estadoProceso.reduce((s, r) => s + (r.enPractica ?? 0), 0)
    const complet   = estadoProceso.reduce((s, r) => s + (r.completadas ?? 0), 0)
    const reprobad  = estadoProceso.reduce((s, r) => s + (r.reprobadas ?? 0), 0)
    const aptos     = estadoProceso.reduce((s, r) => s + (r.aptos ?? 0), 0)

    const notasConFinal = notas.filter(n => n.notaFinal != null)
    const promedioFinal = notasConFinal.length > 0
      ? notasConFinal.reduce((s, n) => s + Number(n.notaFinal), 0) / notasConFinal.length
      : null

    const aprobados  = notas.filter(n => n.resultado === 'APROBADO').length
    const reprobados = notas.filter(n => n.resultado === 'REPROBADO').length

    return { total, enPract, complet, reprobad, aptos, promedioFinal, aprobados, reprobados }
  }, [estadoProceso, notas])

  // ── Datos para gráficos ────────────────────────────────────────────────────

  const dataPorPrograma = useMemo(() =>
    estadoProceso.map(r => ({
      programa:   r.programa?.split(' ').slice(0, 2).join(' ') ?? '—',
      enPractica: r.enPractica ?? 0,
      completadas: r.completadas ?? 0,
      reprobadas: r.reprobadas ?? 0,
      aptos:      r.aptos ?? 0,
    }))
  , [estadoProceso])

  const dataEstadoAgregado = useMemo(() => {
    const suma = {
      'Aptos':           estadoProceso.reduce((s, r) => s + (r.aptos ?? 0), 0),
      'En práctica':     estadoProceso.reduce((s, r) => s + (r.enPractica ?? 0), 0),
      'Completadas':     estadoProceso.reduce((s, r) => s + (r.completadas ?? 0), 0),
      'Reprobadas':      estadoProceso.reduce((s, r) => s + (r.reprobadas ?? 0), 0),
      'Sin evaluar':     estadoProceso.reduce((s, r) => s + (r.sinEvaluar ?? 0), 0),
      'Canceladas':      estadoProceso.reduce((s, r) => s + (r.canceladas ?? 0), 0),
    }
    return Object.entries(suma)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [estadoProceso])

  const dataResultados = useMemo(() => [
    { name: 'Aprobados',  value: kpis.aprobados,  fill: C.verde },
    { name: 'Reprobados', value: kpis.reprobados, fill: C.rojo  },
    { name: 'Pendientes', value: notas.filter(n => n.resultado === 'PENDIENTE').length, fill: C.gris },
  ].filter(d => d.value > 0), [kpis, notas])

  const dataEncuestasPrograma = useMemo(() =>
    (encuestas?.promediosPorPrograma ?? []).map(e => ({
      programa: e.programaNombre?.split(' ').slice(0, 2).join(' ') ?? '—',
      promedio: Number(e.promedioGeneral?.toFixed(2) ?? 0),
    }))
  , [encuestas])

  const dataNotasDistribucion = useMemo(() => {
    const rangos = { '0-2': 0, '2-3': 0, '3-4': 0, '4-5': 0 }
    notas.filter(n => n.notaFinal != null).forEach(n => {
      const v = Number(n.notaFinal)
      if (v < 2)      rangos['0-2']++
      else if (v < 3) rangos['2-3']++
      else if (v < 4) rangos['3-4']++
      else            rangos['4-5']++
    })
    return Object.entries(rangos).map(([rango, cantidad]) => ({ rango, cantidad }))
  }, [notas])

  const isLoading = loadingEstado || loadingNotas

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* Header */}
      <div className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h1 className="text-lg font-bold" style={{ color: C.azulOscuro }}>
            Panel de dirección
          </h1>
          <p className="text-xs mt-0.5" style={{ color: C.gris }}>
            Indicadores globales del sistema de prácticas empresariales UAH
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: C.azulClaro }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.azulMedio }} />
          <span className="text-[10px] font-semibold" style={{ color: C.azulMedio }}>
            Datos en tiempo real
          </span>
        </div>
      </div>

      {/* Filtros */}
      <FiltroBar
        programas={programas}
        facultades={facultades}
        filtros={filtros}
        onChange={setFiltros}
      />

      {isLoading ? (
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 rounded-2xl animate-pulse"
              style={{ background: C.grisClaro }} />
          ))}
        </div>
      ) : (
        <>
          {/* ── KPIs principales ── */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard
              label="Total estudiantes"
              value={kpis.total}
              sub="en todos los programas"
              color={C.azulMedio}
              bg={C.azulClaro}
              icon={Users}
            />
            <StatCard
              label="En práctica activa"
              value={kpis.enPract}
              sub={`${pct(kpis.enPract, kpis.total)}% del total`}
              color={C.naranja}
              bg={C.naranjaClaro}
              icon={Clock}
            />
            <StatCard
              label="Prácticas completadas"
              value={kpis.complet}
              sub={`${pct(kpis.complet, kpis.total)}% tasa de cierre`}
              color={C.verde}
              bg={C.verdeClaro}
              icon={CheckCircle}
            />
            <StatCard
              label="Promedio nota final"
              value={kpis.promedioFinal != null ? kpis.promedioFinal.toFixed(2) : '—'}
              sub={`${kpis.aprobados} aprobados · ${kpis.reprobados} reprobados`}
              color={C.rojo}
              bg="#fde6ea"
              icon={Award}
            />
          </div>

          {/* ── Fila 2: Estado por programa + Distribución global ── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Barras por programa */}
            <div className="col-span-2 bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <Seccion titulo="Estado del proceso por programa">
                {dataPorPrograma.length === 0 ? (
                  <p className="text-xs py-8 text-center" style={{ color: C.gris }}>
                    Sin datos para los filtros seleccionados
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dataPorPrograma} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                      <XAxis dataKey="programa" tick={{ fontSize: 10, fill: C.gris }} />
                      <YAxis tick={{ fontSize: 10, fill: C.gris }} allowDecimals={false} />
                      <Tooltip content={<TooltipCustom />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="aptos"      name="Aptos"      fill={C.azulMedio} radius={[3,3,0,0]} />
                      <Bar dataKey="enPractica" name="En práctica" fill={C.naranja}   radius={[3,3,0,0]} />
                      <Bar dataKey="completadas" name="Completadas" fill={C.verde}    radius={[3,3,0,0]} />
                      <Bar dataKey="reprobadas"  name="Reprobadas"  fill={C.rojo}     radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Seccion>
            </div>

            {/* Pie de distribución global */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <Seccion titulo="Distribución global">
                {dataEstadoAgregado.length === 0 ? (
                  <p className="text-xs py-8 text-center" style={{ color: C.gris }}>Sin datos</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={dataEstadoAgregado}
                          cx="50%" cy="50%"
                          innerRadius={45} outerRadius={70}
                          dataKey="value"
                          paddingAngle={2}>
                          {dataEstadoAgregado.map((_, i) => (
                            <Cell key={i} fill={[C.azulMedio, C.naranja, C.verde, C.rojo, C.gris, C.morado][i % 6]} />
                          ))}
                        </Pie>
                        <Tooltip content={<TooltipCustom />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1 mt-2">
                      {dataEstadoAgregado.map((d, i) => (
                        <div key={d.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: [C.azulMedio, C.naranja, C.verde, C.rojo, C.gris, C.morado][i % 6] }} />
                            <span className="text-[10px]" style={{ color: C.gris }}>{d.name}</span>
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: C.azulOscuro }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Seccion>
            </div>
          </div>

          {/* ── Fila 3: Resultados + Distribución notas + Encuestas ── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Pie resultados */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <Seccion titulo="Resultados finales">
                {dataResultados.length === 0 ? (
                  <p className="text-xs py-8 text-center" style={{ color: C.gris }}>
                    Sin notas registradas
                  </p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={dataResultados}
                          cx="50%" cy="50%"
                          innerRadius={45} outerRadius={70}
                          dataKey="value" paddingAngle={2}>
                          {dataResultados.map((d, i) => (
                            <Cell key={i} fill={d.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<TooltipCustom />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {dataResultados.map(d => (
                        <div key={d.name} className="rounded-xl p-2 text-center"
                          style={{ background: d.fill + '20' }}>
                          <p className="text-base font-bold" style={{ color: d.fill }}>{d.value}</p>
                          <p className="text-[9px]" style={{ color: d.fill }}>{d.name}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Seccion>
            </div>

            {/* Distribución de notas */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <Seccion titulo="Distribución de notas finales">
                {dataNotasDistribucion.every(d => d.cantidad === 0) ? (
                  <p className="text-xs py-8 text-center" style={{ color: C.gris }}>
                    Sin notas registradas
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dataNotasDistribucion}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                      <XAxis dataKey="rango" tick={{ fontSize: 10, fill: C.gris }} />
                      <YAxis tick={{ fontSize: 10, fill: C.gris }} allowDecimals={false} />
                      <Tooltip content={<TooltipCustom />} />
                      <Bar dataKey="cantidad" name="Estudiantes" radius={[4,4,0,0]}>
                        {dataNotasDistribucion.map((d) => (
                          <Cell
                            key={d.rango}
                            fill={d.rango === '3-4' || d.rango === '4-5' ? C.verde : C.rojo}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Seccion>
            </div>

            {/* Encuestas por programa */}
            <div className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <Seccion titulo="Satisfacción por programa">
                {loadingEncuestas ? (
                  <div className="h-40 animate-pulse rounded-xl" style={{ background: C.grisClaro }} />
                ) : dataEncuestasPrograma.length === 0 ? (
                  <p className="text-xs py-8 text-center" style={{ color: C.gris }}>
                    Sin encuestas respondidas
                  </p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={dataEncuestasPrograma} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" horizontal={false} />
                        <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: C.gris }} />
                        <YAxis dataKey="programa" type="category" tick={{ fontSize: 9, fill: C.gris }} width={70} />
                        <Tooltip content={<TooltipCustom />} />
                        <Bar dataKey="promedio" name="Promedio" fill={C.azulMedio} radius={[0,4,4,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    {encuestas && (
                      <div className="mt-3 p-2.5 rounded-lg"
                        style={{ background: C.azulClaro }}>
                        <p className="text-[10px] font-semibold" style={{ color: C.azulMedio }}>
                          Tasa de respuesta: {encuestas.tasaRespuesta?.toFixed(1) ?? '—'}%
                          · {encuestas.totalRespuestas ?? 0} de {encuestas.totalPracticas ?? 0} encuestas
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Seccion>
            </div>
          </div>

          {/* ── Fila 4: Tabla resumen por programa ── */}
          {estadoProceso.length > 0 && (
            <div className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="px-5 py-4" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
                <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.gris }}>
                  Detalle por programa
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: C.grisClaro }}>
                      {['Programa', 'Facultad', 'Total', 'Aptos', 'En práctica', 'Completadas', 'Reprobadas', '% Aprobación'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide"
                          style={{ color: C.gris, borderBottom: '0.5px solid #e2e8f0' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {estadoProceso.map((r, i) => {
                      const aprobPct = pct(r.completadas ?? 0, (r.completadas ?? 0) + (r.reprobadas ?? 0))
                      return (
                        <tr key={i} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                          className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.azulOscuro }}>
                            {r.programa ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: C.gris }}>
                            {r.facultad ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-xs text-center font-bold" style={{ color: C.azulOscuro }}>
                            {r.totalEstudiantes ?? 0}
                          </td>
                          <td className="px-4 py-3 text-xs text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: C.azulClaro, color: C.azulMedio }}>
                              {r.aptos ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: C.naranjaClaro, color: C.naranja }}>
                              {r.enPractica ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: C.verdeClaro, color: C.verde }}>
                              {r.completadas ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: '#fde6ea', color: C.rojo }}>
                              {r.reprobadas ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-center">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                                <div className="h-1.5 rounded-full"
                                  style={{ width: `${aprobPct}%`, background: aprobPct >= 70 ? C.verde : aprobPct >= 50 ? C.naranja : C.rojo }} />
                              </div>
                              <span className="text-[9px] font-bold w-8 text-right"
                                style={{ color: aprobPct >= 70 ? C.verde : aprobPct >= 50 ? C.naranja : C.rojo }}>
                                {aprobPct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Fila 5: Top empresas ── */}
          {!loadingEmpresas && empresas.length > 0 && (
            <div className="bg-white rounded-2xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <Seccion titulo="Empresas con mayor participación">
                <div className="grid grid-cols-3 gap-3">
                  {empresas.slice(0, 6).map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: C.grisClaro, border: '0.5px solid #e2e8f0' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                        style={{ background: C.azulClaro, color: C.azulMedio }}>
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: C.azulOscuro }}>
                          {e.empresaNombre ?? '—'}
                        </p>
                        <p className="text-[10px]" style={{ color: C.gris }}>
                          {e.totalVacantes ?? 0} vacantes · {e.totalPostulaciones ?? 0} postulaciones
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Seccion>
            </div>
          )}
        </>
      )}
    </div>
  )
}