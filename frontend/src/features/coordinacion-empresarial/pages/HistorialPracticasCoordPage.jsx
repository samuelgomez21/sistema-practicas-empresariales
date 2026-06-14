import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react'
import api from '@/lib/axios'

// ── Config ────────────────────────────────────────────────────────────────────

const ESTADO_CFG = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio', bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'En vinculación',   bg: '#e6f0fb', color: '#0B416B' },
  VINCULADA:                 { label: 'Convenio',         bg: '#f3e8ff', color: '#6d28d9' },
  EN_PRACTICA:               { label: 'En curso',         bg: '#fff8e6', color: '#a07010' },
  COMPLETADA:                { label: 'Completada',       bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',        bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',        bg: '#fef0f0', color: '#c0392b' },
}

const ESTADOS_CERRADOS = ['COMPLETADA', 'REPROBADA', 'CANCELADA']

function fechaCo(f) {
  if (!f) return '—'
  return new Date(f + (f.includes('T') ? '' : 'T00:00:00'))
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Componentes ───────────────────────────────────────────────────────────────

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#8a9bb0' }}>{label}</p>
      <p className="text-xs font-medium"
        style={{ color: (!value || value === '—') ? '#c0c8d4' : '#023859' }}>
        {value ?? '—'}
      </p>
    </div>
  )
}

function TarjetaPractica({ p }) {
  const [abierta, setAbierta] = useState(false)
  const cfg     = ESTADO_CFG[p.estado] ?? { label: p.estado, bg: '#f0f2f5', color: '#6b7a8d' }
  const cerrada = ESTADOS_CERRADOS.includes(p.estado)

  // resultado viene directo del PracticaResumenDto.resultado
  const resultado = p.resultado ?? null

  return (
    <div className="bg-white rounded-xl overflow-hidden"
      style={{
        border: `0.5px solid ${
          p.estado === 'COMPLETADA' ? '#b6e8cf'
          : p.estado === 'REPROBADA' || p.estado === 'CANCELADA' ? '#f7c1c1'
          : '#e2e8f0'
        }`,
      }}>

      {/* Cabecera */}
      <div className="flex items-start gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setAbierta(v => !v)}
        style={{ borderBottom: abierta ? '0.5px solid #f0f2f5' : 'none' }}>

        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
          style={{ background: cfg.bg, color: cfg.color }}>
          #{p.numeroPractica}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: '#023859' }}>
                {p.nombreEstudiante ?? '—'}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                {p.programa ?? '—'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.label}
              </span>
              {abierta
                ? <ChevronUp   size={14} style={{ color: '#8a9bb0' }} />
                : <ChevronDown size={14} style={{ color: '#8a9bb0' }} />}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            {p.nombreEmpresa && (
              <span className="text-[10px]" style={{ color: '#6b7a8d' }}>
                🏢 {p.nombreEmpresa}
              </span>
            )}
            {p.fechaInicio && (
              <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                📅 {fechaCo(p.fechaInicio)}
                {p.fechaFin && ` → ${fechaCo(p.fechaFin)}`}
              </span>
            )}
            {/* Resultado inline en la cabecera */}
            {cerrada && resultado && p.estado !== 'CANCELADA' && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={resultado === 'APROBADO'
                  ? { background: '#eaf7f0', color: '#1a7a4a' }
                  : { background: '#fef0f0', color: '#c0392b' }}>
                {resultado === 'APROBADO' ? '✓ Aprobado' : '✗ Reprobado'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detalle */}
      {abierta && (
        <div className="px-5 py-4 flex flex-col gap-3" style={{ background: '#f7f9fb' }}>
          <div className="grid grid-cols-3 gap-3">
            <InfoItem label="Empresa"      value={p.nombreEmpresa ?? '—'} />
            <InfoItem label="Docente"      value={p.nombreDocente ?? '—'} />
            <InfoItem label="Tutor"        value={p.nombreTutor   ?? '—'} />
            <InfoItem label="Semestre"     value={p.semestre ? `Semestre ${p.semestre}` : '—'} />
            <InfoItem label="Fecha inicio" value={fechaCo(p.fechaInicio)} />
            <InfoItem label="Fecha fin"    value={fechaCo(p.fechaFin)} />
          </div>

          {/* Resultado cerrada */}
          {cerrada && (
            <div className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: resultado === 'APROBADO' ? '#eaf7f0'
                          : p.estado === 'CANCELADA' ? '#f7f9fb' : '#fef0f0',
                border: `0.5px solid ${
                  resultado === 'APROBADO' ? '#b6e8cf'
                  : p.estado === 'CANCELADA' ? '#e2e8f0' : '#f7c1c1'
                }`,
              }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1"
                  style={{ color: '#8a9bb0' }}>Resultado final</p>
                {p.estado === 'CANCELADA' ? (
                  <span className="text-xs font-bold" style={{ color: '#c0392b' }}>
                    Práctica cancelada
                  </span>
                ) : resultado ? (
                  <span className="text-sm font-bold"
                    style={{ color: resultado === 'APROBADO' ? '#1a7a4a' : '#c0392b' }}>
                    {resultado === 'APROBADO' ? '✓ Aprobado' : '✗ Reprobado'}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: '#8a9bb0' }}>Sin resultado</span>
                )}
              </div>
              {resultado === 'APROBADO'
                ? <CheckCircle size={24} style={{ color: '#1a7a4a', opacity: 0.35 }} />
                : p.estado !== 'CANCELADA' && resultado
                  ? <XCircle size={24} style={{ color: '#c0392b', opacity: 0.35 }} />
                  : null}
            </div>
          )}

          {!cerrada && (
            <div className="p-3 rounded-lg"
              style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
              <p className="text-[10px] font-semibold" style={{ color: '#a07010' }}>
                Práctica en curso
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function HistorialPracticasCoordPage() {
  const [busqueda,       setBusqueda]       = useState('')
  const [filtroEstado,   setFiltroEstado]   = useState('')
  const [filtroPrograma, setFiltroPrograma] = useState('')

  const { data: practicas = [], isLoading } = useQuery({
    queryKey: ['historial-practicas-coord'],
    queryFn:  async () => {
      const { data } = await api.get('/practicas')
      return data ?? []
    },
  })

  const programas = useMemo(() =>
    [...new Set(practicas.map(p => p.programa).filter(Boolean))].sort()
  , [practicas])

  const activas  = practicas.filter(p => !ESTADOS_CERRADOS.includes(p.estado))
  const cerradas = practicas.filter(p =>  ESTADOS_CERRADOS.includes(p.estado))

  // Stats de cerradas — PracticaResumenDto tiene tienePazYSalvo pero no resultado
  // Contamos COMPLETADA como aprobadas y REPROBADA como reprobadas
  const aprobadas  = cerradas.filter(p => p.estado === 'COMPLETADA').length
  const reprobadas = cerradas.filter(p => p.estado === 'REPROBADA').length

  const filtrar = (lista) => lista.filter(p => {
    const q = busqueda.toLowerCase()
    const matchBusq = !busqueda
      || p.nombreEstudiante?.toLowerCase().includes(q)
      || p.nombreEmpresa?.toLowerCase().includes(q)
      || p.nombreDocente?.toLowerCase().includes(q)
    const matchEstado   = !filtroEstado    || p.estado   === filtroEstado
    const matchPrograma = !filtroPrograma  || p.programa === filtroPrograma
    return matchBusq && matchEstado && matchPrograma
  })

  const totalFiltrado = filtrar(activas).length + filtrar(cerradas).length

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-20"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: '#023859' }}>
          <BookOpen size={16} style={{ color: '#D91438' }} />
          Historial de prácticas
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Registro completo de todas las prácticas — activas y cerradas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',      value: practicas.length, bg: '#e6f0fb', color: '#0B416B' },
          { label: 'En curso',   value: activas.length,   bg: '#fff8e6', color: '#a07010' },
          { label: 'Aprobadas',  value: aprobadas,        bg: '#eaf7f0', color: '#1a7a4a' },
          { label: 'Reprobadas', value: reprobadas,       bg: '#fef0f0', color: '#c0392b' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: s.bg }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px]"        style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48 h-9 px-3 rounded-lg"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
          <Search size={13} style={{ color: '#8a9bb0' }} />
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, empresa o docente..."
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: '#023859' }} />
        </div>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todos los estados</option>
          <option value="EN_PRACTICA">En curso</option>
          <option value="COMPLETADA">Completadas</option>
          <option value="REPROBADA">Reprobadas</option>
          <option value="CANCELADA">Canceladas</option>
          <option value="VINCULADA">Convenio</option>
          <option value="ASIGNADA_PENDIENTE_INICIO">Pendiente inicio</option>
        </select>
        {programas.length > 0 && (
          <select value={filtroPrograma} onChange={e => setFiltroPrograma(e.target.value)}
            className="h-9 px-3 rounded-lg text-xs outline-none"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los programas</option>
            {programas.map(pr => <option key={pr} value={pr}>{pr}</option>)}
          </select>
        )}
        <span className="h-9 flex items-center text-[10px] font-semibold px-3 rounded-lg"
          style={{ background: '#f4f6f9', color: '#8a9bb0' }}>
          {totalFiltrado} resultado(s)
        </span>
      </div>

      {practicas.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <BookOpen size={28} className="mx-auto mb-2" style={{ color: '#c0c8d4' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            No hay prácticas registradas
          </p>
        </div>
      ) : (
        <>
          {filtrar(activas).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={12} style={{ color: '#a07010' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  En curso ({filtrar(activas).length})
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {filtrar(activas).map(p => <TarjetaPractica key={p.id} p={p} />)}
              </div>
            </div>
          )}

          {filtrar(cerradas).length > 0 && (
            <div className={filtrar(activas).length > 0 ? 'mt-2' : ''}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={12} style={{ color: '#1a7a4a' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Historial cerrado ({filtrar(cerradas).length})
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {filtrar(cerradas).map(p => <TarjetaPractica key={p.id} p={p} />)}
              </div>
            </div>
          )}

          {busqueda && totalFiltrado === 0 && (
            <div className="bg-white rounded-xl p-6 text-center"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                Ninguna práctica coincide con los filtros
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}