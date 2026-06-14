import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { BookOpen, CheckCircle, XCircle, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react'
import api from '@/lib/axios'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ESTADO_CFG = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio', bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'En vinculación',   bg: '#e6f0fb', color: '#0B416B' },
  VINCULADA:                 { label: 'Convenio',         bg: '#f3e8ff', color: '#6d28d9' },
  EN_PRACTICA:               { label: 'En curso',         bg: '#fff8e6', color: '#a07010' },
  COMPLETADA:                { label: 'Completada',       bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',        bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',        bg: '#fef0f0', color: '#c0392b' },
}

function fechaCo(f) {
  if (!f) return '—'
  return new Date(f + (f.includes('T') ? '' : 'T00:00:00'))
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Normaliza un PracticaResponse del endpoint /estudiantes/{id}/practicas
// Los campos pueden venir con nombres distintos según la implementación del backend
function normalizar(p) {
  return {
    id:             p.id,
    numeroPractica: p.numeroPractica   ?? p.numero ?? '—',
    nombre:         p.nombre           ?? p.nombrePractica ?? null,
    materiaNucleo:  p.materiaNucleo    ?? null,
    estado:         typeof p.estado === 'object' ? p.estado?.name?.() ?? String(p.estado) : p.estado,
    // nombreEmpresa puede venir como "Empresa ID: X" si el backend no lo resuelve
    // en ese caso mostramos '—' y dejamos que el backend lo corrija
    nombreEmpresa:  (p.nombreEmpresa && !p.nombreEmpresa.startsWith('Empresa ID:'))
                    ? p.nombreEmpresa : null,
    nombreDocente:  p.nombreDocenteAsesor    ?? p.nombreDocente    ?? null,
    nombreTutor:    p.nombreTutorEmpresarial ?? p.nombreTutor      ?? null,
    notaFinal:      p.notaFinal  ?? null,
    resultado:      p.resultado  ?? null,
    fechaInicio:    p.fechaInicio ?? null,
    fechaFin:       p.fechaFin   ?? null,
    duracionSemanas: p.duracionSemanas ?? null,
  }
}

function TarjetaPractica({ practica: raw }) {
  const practica = normalizar(raw)
  const [abierta, setAbierta] = useState(false)
  const cfg     = ESTADO_CFG[practica.estado] ?? { label: practica.estado, bg: '#f0f2f5', color: '#6b7a8d' }
  const cerrada = ['COMPLETADA','REPROBADA','CANCELADA'].includes(practica.estado)

  return (
    <div className="bg-white rounded-xl overflow-hidden"
      style={{
        border: `0.5px solid ${
          practica.estado === 'COMPLETADA' ? '#b6e8cf'
          : practica.estado === 'REPROBADA' || practica.estado === 'CANCELADA' ? '#f7c1c1'
          : '#e2e8f0'
        }`,
      }}>

      {/* Cabecera */}
      <div className="flex items-start gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setAbierta(v => !v)}
        style={{ borderBottom: abierta ? '0.5px solid #f0f2f5' : 'none' }}>

        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
          style={{ background: cfg.bg, color: cfg.color }}>
          #{practica.numeroPractica}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: '#023859' }}>
                {practica.nombre ?? `Práctica #${practica.numeroPractica}`}
              </p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: '#8a9bb0' }}>
                {practica.materiaNucleo ?? practica.nombreEmpresa ?? '—'}
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

          {/* Meta rápida */}
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            {practica.nombreEmpresa && (
              <span className="text-[10px]" style={{ color: '#6b7a8d' }}>
                🏢 {practica.nombreEmpresa}
              </span>
            )}
            {practica.fechaInicio && (
              <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                📅 {fechaCo(practica.fechaInicio)}
                {practica.fechaFin && ` → ${fechaCo(practica.fechaFin)}`}
              </span>
            )}
            {practica.notaFinal != null && (
              <span className="text-[10px] font-bold"
                style={{ color: Number(practica.notaFinal) >= 3 ? '#1a7a4a' : '#c0392b' }}>
                Nota: {Number(practica.notaFinal).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detalle */}
      {abierta && (
        <div className="px-5 py-4 flex flex-col gap-4" style={{ background: '#f7f9fb' }}>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Empresa"           value={practica.nombreEmpresa  ?? '—'} />
            <InfoItem label="Docente asesor"    value={practica.nombreDocente  ?? '—'} />
            <InfoItem label="Tutor empresarial" value={practica.nombreTutor    ?? '—'} />
            <InfoItem label="Duración"          value={practica.duracionSemanas ? `${practica.duracionSemanas} semanas` : '—'} />
            <InfoItem label="Fecha inicio"      value={fechaCo(practica.fechaInicio)} />
            <InfoItem label="Fecha fin"         value={fechaCo(practica.fechaFin)} />
          </div>

          {/* Resultado */}
          {cerrada ? (
            <div className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: practica.resultado === 'APROBADO' ? '#eaf7f0'
                          : practica.estado    === 'CANCELADA' ? '#f7f9fb' : '#fef0f0',
                border: `0.5px solid ${
                  practica.resultado === 'APROBADO' ? '#b6e8cf'
                  : practica.estado  === 'CANCELADA' ? '#e2e8f0' : '#f7c1c1'
                }`,
              }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-1"
                  style={{ color: '#8a9bb0' }}>Resultado final</p>
                {practica.estado === 'CANCELADA' ? (
                  <span className="text-xs font-bold" style={{ color: '#c0392b' }}>
                    Práctica cancelada
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    {practica.notaFinal != null && (
                      <p className="text-lg font-bold"
                        style={{ color: practica.resultado === 'APROBADO' ? '#1a7a4a' : '#c0392b' }}>
                        {Number(practica.notaFinal).toFixed(2)}
                      </p>
                    )}
                    <span className="text-xs font-bold"
                      style={{ color: practica.resultado === 'APROBADO' ? '#1a7a4a' : '#c0392b' }}>
                      {practica.resultado === 'APROBADO' ? '✓ Aprobado' : practica.resultado ? '✗ Reprobado' : 'Sin resultado'}
                    </span>
                  </div>
                )}
              </div>
              {practica.resultado === 'APROBADO'
                ? <CheckCircle size={28} style={{ color: '#1a7a4a', opacity: 0.35 }} />
                : practica.estado !== 'CANCELADA'
                  ? <XCircle size={28} style={{ color: '#c0392b', opacity: 0.35 }} />
                  : null}
            </div>
          ) : (
            <div className="p-3 rounded-lg"
              style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
              <p className="text-[10px] font-semibold" style={{ color: '#a07010' }}>
                Práctica en curso — el resultado se mostrará al finalizar
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#8a9bb0' }}>{label}</p>
      <p className="text-xs font-medium" style={{ color: (!value || value === '—') ? '#c0c8d4' : '#023859' }}>{value ?? '—'}</p>
    </div>
  )
}

export default function HistorialPracticasPage() {
  const [busqueda,     setBusqueda]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const { data: practicas = [], isLoading } = useQuery({
    queryKey: ['historial-practicas-estudiante'],
    queryFn:  async () => {
      const { data: perfil } = await api.get('/estudiantes/mi-perfil')
      if (!perfil?.id) return []
      const { data } = await api.get(`/estudiantes/${perfil.id}/practicas`)
      return data ?? []
    },
  })

  // Normalizar estados — pueden venir como enum o string
  const normalEstado = (p) => {
    const e = typeof p.estado === 'object' ? String(p.estado) : p.estado
    return e
  }

  const activas  = practicas.filter(p => !['COMPLETADA','REPROBADA','CANCELADA'].includes(normalEstado(p)))
  const cerradas = practicas.filter(p =>  ['COMPLETADA','REPROBADA','CANCELADA'].includes(normalEstado(p)))

  const filtrar = (lista) => lista.filter(p => {
    const q = busqueda.toLowerCase()
    const matchBusq = !busqueda
      || p.nombre?.toLowerCase().includes(q)
      || p.nombreEmpresa?.toLowerCase().includes(q)
    const matchEstado = !filtroEstado || normalEstado(p) === filtroEstado
    return matchBusq && matchEstado
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
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
          Registro completo de todas tus prácticas empresariales
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',       value: practicas.length,
            bg: '#e6f0fb', color: '#0B416B' },
          { label: 'Completadas', value: cerradas.filter(p => normalEstado(p) === 'COMPLETADA').length,
            bg: '#eaf7f0', color: '#1a7a4a' },
          { label: 'En curso',    value: activas.length,
            bg: '#fff8e6', color: '#a07010' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: s.bg }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px]"        style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {practicas.length > 0 && (
        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-lg"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
            <Search size={13} style={{ color: '#8a9bb0' }} />
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o empresa..."
              className="flex-1 text-xs outline-none bg-transparent"
              style={{ color: '#023859' }} />
          </div>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
            className="h-9 px-3 rounded-lg text-xs outline-none"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos</option>
            <option value="EN_PRACTICA">En curso</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="REPROBADA">Reprobadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
      )}

      {practicas.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <BookOpen size={28} className="mx-auto mb-2" style={{ color: '#c0c8d4' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            Aún no tienes prácticas registradas
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
                {filtrar(activas).map(p => <TarjetaPractica key={p.id} practica={p} />)}
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
                {filtrar(cerradas).map(p => <TarjetaPractica key={p.id} practica={p} />)}
              </div>
            </div>
          )}

          {busqueda && filtrar(activas).length === 0 && filtrar(cerradas).length === 0 && (
            <div className="bg-white rounded-xl p-6 text-center"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                Ninguna práctica coincide con la búsqueda
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}