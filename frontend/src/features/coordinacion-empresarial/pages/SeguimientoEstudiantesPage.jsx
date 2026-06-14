import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, CheckCircle, XCircle, Users } from 'lucide-react'
import { coordEmpresarialApi, ESTADO_POSTULACION_LABEL } from '../api/coordEmpresarialApi'

const TABS = [
  { value: 'TODOS',       label: 'Todos los estudiantes' },
  { value: 'PROCESO',     label: 'Aptos para práctica'   },
  { value: 'SELECCION',   label: 'En proceso de selección' },
  { value: 'EN_PRACTICA', label: 'Paz y salvo'           },
]

// Etiqueta de estado de práctica
const ESTADO_LABEL = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio', bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'Vinculando',       bg: '#e6f0fb', color: '#0B416B' },
  VINCULADA:                 { label: 'Convenio',         bg: '#f3e8ff', color: '#6d28d9' },
  EN_PRACTICA:               { label: 'En práctica',      bg: '#eaf7f0', color: '#1a7a4a' },
  COMPLETADA:                { label: 'Completada',       bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',        bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',        bg: '#fef0f0', color: '#c0392b' },
}

export default function SeguimientoEstudiantesPage() {
  const navigate = useNavigate()
  const [tab,      setTab]      = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['seguimiento-estudiantes'],
    queryFn:  coordEmpresarialApi.getEstudiantesSeguimiento,
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  const proceso    = estudiantes.filter(e => e.categoria === 'PROCESO' || e.categoria === 'ASIGNADA_PENDIENTE_INICIO')
  const enPractica = estudiantes.filter(e => e.categoria === 'EN_PRACTICA')
  const todos      = estudiantes

  const totalEnSeleccion = proceso.reduce((acc, e) =>
    acc + (e.postulaciones ?? []).filter(p =>
      !['SELECCIONADO', 'RECHAZADO'].includes(p.estado)
    ).length, 0
  )

  const counts = {
    TODOS:       todos.length,
    PROCESO:     proceso.length,
    SELECCION:   totalEnSeleccion,
    EN_PRACTICA: enPractica.length,
  }

  const filtrar = (lista) => !busqueda
    ? lista
    : lista.filter(e => e.nombre?.toLowerCase().includes(busqueda.toLowerCase())
        || e.programa?.toLowerCase().includes(busqueda.toLowerCase())
        || e.empresaNombre?.toLowerCase().includes(busqueda.toLowerCase()))

  let lista = tab === 'EN_PRACTICA' ? enPractica
            : tab === 'PROCESO'     ? proceso
            : tab === 'TODOS'       ? todos
            : []

  lista = filtrar(lista)

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Seguimiento de estudiantes
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Proceso completo de prácticas — vista de seguimiento
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.value}
            onClick={() => setTab(t.value)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.value
              ? { background: '#023859', color: '#fff' }
              : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
            }>
            {t.label}
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: tab === t.value ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color:      tab === t.value ? '#fff' : '#6b7a8d',
              }}>
              {counts[t.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      {tab !== 'SELECCION' && (
        <div className="relative max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, programa o empresa..."
            className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
          />
        </div>
      )}

      {/* ── TAB: TODOS ── */}
      {tab === 'TODOS' && (
        <TabTodos lista={lista} navigate={navigate} />
      )}

      {/* ── TAB: PROCESO y EN_PRACTICA ── */}
      {(tab === 'PROCESO' || tab === 'EN_PRACTICA') && (
        <div className="flex flex-col gap-3">
          {lista.length === 0 ? (
            <Vacio />
          ) : lista.map(e => (
            <div key={e.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {e.nombre?.[0] ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {e.programa} · Sem. {e.semestre}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                        Apto
                      </span>
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        Práctica #{e.numeroPractica}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/coordinacion-empresarial/estudiantes/${e.id}`)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}>
                  <Eye size={14} />
                </button>
              </div>

              {tab === 'PROCESO' && (
                <div className="pl-12">
                  <p className="text-[9px] font-bold uppercase tracking-wide mb-2"
                    style={{ color: '#8a9bb0' }}>
                    Postulaciones ({(e.postulaciones ?? []).length})
                  </p>
                  {(e.postulaciones ?? []).length === 0 ? (
                    <p className="text-[10px]" style={{ color: '#c0c8d4' }}>
                      Sin postulaciones registradas
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {(e.postulaciones ?? []).map((p, idx) => {
                        const cfg = ESTADO_POSTULACION_LABEL[p.estado] ?? ESTADO_POSTULACION_LABEL.POSTULADO
                        return (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg"
                            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                                {p.empresaNombre}
                              </span>
                              <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                                {p.vacanteTitulo}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: cfg.bg, color: cfg.color }}>
                              {cfg.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {tab === 'EN_PRACTICA' && (
                <ChecklistResumen checklist={e.checklist} empresaNombre={e.empresaNombre} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: SELECCION ── */}
      {tab === 'SELECCION' && (
        <div className="flex flex-col gap-2">
          {proceso.flatMap(e =>
            (e.postulaciones ?? [])
              .filter(p => !['SELECCIONADO', 'RECHAZADO'].includes(p.estado))
              .map((p, idx) => {
                const cfg = ESTADO_POSTULACION_LABEL[p.estado] ?? ESTADO_POSTULACION_LABEL.POSTULADO
                return (
                  <div key={`${e.id}-${idx}`}
                    className="bg-white rounded-xl p-4 flex items-center justify-between"
                    style={{ border: '0.5px solid #e2e8f0' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        {e.nombre?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                          {p.empresaNombre} — {p.vacanteTitulo}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })
          )}
          {totalEnSeleccion === 0 && <Vacio mensaje="No hay estudiantes en proceso de selección" />}
        </div>
      )}
    </div>
  )
}

// ── Tab Todos ─────────────────────────────────────────────────────────────────

function TabTodos({ lista, navigate }) {
  if (lista.length === 0) return <Vacio />

  return (
    <div className="flex flex-col gap-2">
      {/* Header tabla */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-wide"
        style={{ color: '#8a9bb0' }}>
        <div className="col-span-4">Estudiante</div>
        <div className="col-span-3">Empresa</div>
        <div className="col-span-2 text-center">Práctica</div>
        <div className="col-span-2 text-center">Estado</div>
        <div className="col-span-1 text-center">Checklist</div>
      </div>

      {lista.map(e => {
        const estadoCfg = ESTADO_LABEL[e.estado] ?? { label: e.estado ?? '—', bg: '#f0f2f5', color: '#6b7a8d' }
        const ckCompletados = (e.checklist ?? []).filter(c => c.completado).length
        const ckTotal       = (e.checklist ?? []).length
        const ckPct         = ckTotal > 0 ? Math.round((ckCompletados / ckTotal) * 100) : 0

        return (
          <div key={e.id}
            className="bg-white rounded-xl grid grid-cols-12 gap-2 items-center px-4 py-3"
            style={{ border: '0.5px solid #e2e8f0' }}>

            {/* Estudiante */}
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                {e.nombre?.[0] ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                  {e.nombre}
                </p>
                <p className="text-[10px] truncate" style={{ color: '#8a9bb0' }}>
                  {e.programa} · Sem. {e.semestre}
                </p>
              </div>
            </div>

            {/* Empresa */}
            <div className="col-span-3 min-w-0">
              <p className="text-[11px] truncate"
                style={{ color: e.empresaNombre && e.empresaNombre !== '—' ? '#023859' : '#c0c8d4' }}>
                {e.empresaNombre && e.empresaNombre !== '—' ? e.empresaNombre : 'Sin empresa'}
              </p>
            </div>

            {/* Práctica */}
            <div className="col-span-2 text-center">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                #{e.numeroPractica ?? '—'}
              </span>
            </div>

            {/* Estado */}
            <div className="col-span-2 text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: estadoCfg.bg, color: estadoCfg.color }}>
                {estadoCfg.label}
              </span>
            </div>

            {/* Checklist mini + botón */}
            <div className="col-span-1 flex items-center justify-end gap-2">
              {ckTotal > 0 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${ckPct}%`,
                        background: ckPct === 100 ? '#1a7a4a' : '#0B416B',
                      }} />
                  </div>
                  <p className="text-[9px] mt-0.5" style={{ color: '#8a9bb0' }}>
                    {ckCompletados}/{ckTotal}
                  </p>
                </div>
              )}
              <button
                onClick={() => navigate(`/coordinacion-empresarial/estudiantes/${e.id}`)}
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}>
                <Eye size={13} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Checklist resumen ─────────────────────────────────────────────────────────

function ChecklistResumen({ checklist = [], empresaNombre }) {
  return (
    <div className="pl-12">
      {empresaNombre && empresaNombre !== '—' && (
        <p className="text-[10px] mb-2" style={{ color: '#0B416B' }}>{empresaNombre}</p>
      )}
      {checklist.length === 0 ? (
        <p className="text-[10px]" style={{ color: '#c0c8d4' }}>
          Checklist no disponible
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
              <div className="h-1.5 rounded-full"
                style={{
                  width: `${(checklist.filter(c => c.completado).length / checklist.length) * 100}%`,
                  background: '#0B416B',
                }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#023859' }}>
              {checklist.filter(c => c.completado).length}/{checklist.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {checklist.map(c => (
              <div key={c.clave} className="flex items-center gap-1.5">
                {c.completado
                  ? <CheckCircle size={11} style={{ color: '#1a7a4a', flexShrink: 0 }} />
                  : <XCircle    size={11} style={{ color: '#c0392b', flexShrink: 0 }} />
                }
                <p className="text-[10px]"
                  style={{ color: c.completado ? '#1a7a4a' : '#6b7a8d' }}>
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────

function Vacio({ mensaje = 'No hay estudiantes en esta categoría' }) {
  return (
    <div className="bg-white rounded-xl p-8 text-center"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <Users size={24} className="mx-auto mb-2" style={{ color: '#c0c8d4' }} />
      <p className="text-xs" style={{ color: '#8a9bb0' }}>{mensaje}</p>
    </div>
  )
}