import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { estudianteApi } from '../api/estudianteApi'
import BadgeEstadoPractica from '../components/BadgeEstadoPractica'
import BadgeEstadoAvance from '../components/BadgeEstadoAvance'
import ChecklistItem from '../components/ChecklistItem'

// Pasos del stepper según el estado de la práctica
const PASOS = [
  { numero: 1, label: 'Inicio',      estado: 'ASIGNADA_PENDIENTE_INICIO' },
  { numero: 2, label: 'Documentos',  estado: 'EN_PROCESO_VINCULACION'    },
  { numero: 3, label: 'Planeador',   estado: 'VINCULADA'                 },
  { numero: 4, label: 'En desarrollo', estado: 'EN_PRACTICA'             },
  { numero: 5, label: 'Cierre',      estado: 'COMPLETADA'                },
]

// Mapea el estado de la práctica al número de paso activo
function obtenerPasoActivo(estado) {
  const map = {
    ASIGNADA_PENDIENTE_INICIO: 1,
    EN_PROCESO_VINCULACION:    2,
    VINCULADA:                 3,
    EN_PRACTICA:               4,
    COMPLETADA:                5,
    REPROBADA:                 5,
    CANCELADA:                 0,
  }
  return map[estado] ?? 1
}

function Stepper({ estadoPractica }) {
  const pasoActivo = obtenerPasoActivo(estadoPractica)

  return (
    <div className="bg-white rounded-xl p-5"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-4" style={{ color: '#023859' }}>
        Progreso de la práctica
      </p>
      <div className="flex items-center">
        {PASOS.map((paso, idx) => {
          const completado = pasoActivo > paso.numero
          const activo     = pasoActivo === paso.numero
          const pendiente  = pasoActivo < paso.numero

          return (
            <div key={paso.numero} className="flex items-center flex-1 last:flex-none">
              {/* Círculo del paso */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                  style={{
                    background: completado ? '#1a7a4a'
                      : activo    ? '#D91438'
                      : '#f0f2f5',
                    color: completado || activo ? '#fff' : '#8a9bb0',
                    border: activo ? '2.5px solid #D91438' : 'none',
                  }}>
                  {completado
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    : paso.numero
                  }
                </div>
                <span
                  className="text-[10px] font-medium whitespace-nowrap"
                  style={{
                    color: completado ? '#1a7a4a'
                      : activo    ? '#D91438'
                      : '#8a9bb0',
                  }}>
                  {paso.label}
                </span>
              </div>

              {/* Línea conectora */}
              {idx < PASOS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all"
                  style={{
                    background: completado ? '#1a7a4a' : '#f0f2f5',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function EstudianteDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: practica,  isLoading: loadP } = useQuery({ queryKey: ['mi-practica'],  queryFn: estudianteApi.getMiPractica  })
  const { data: avances = [], isLoading: loadA } = useQuery({ queryKey: ['mis-avances'], queryFn: estudianteApi.getAvances })
  const { data: checklist = [] } = useQuery({ queryKey: ['mi-checklist'], queryFn: estudianteApi.getChecklist })

  if (loadP || loadA) return <Skeleton />
  if (!practica) return <SinPractica />

  // Últimos 3 avances
  const ultimosAvances = [...avances].reverse().slice(0, 3)
  const completados = checklist.filter(c => c.completado).length
  const total       = checklist.length
  const pct         = Math.round((completados / total) * 100)

  return (
    <div className="flex flex-col gap-4">

      {/* Header con saludo */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Hola, {user?.nombre?.split(' ')[0]} 👋
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {practica.programa} · {practica.nombrePractica} · Semestre 2026-1
          </p>
        </div>
        <BadgeEstadoPractica estado={practica.estado} />
      </div>
      {/* Stepper de progreso */}
      {practica && <Stepper estadoPractica={practica.estado} />}
      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Empresa',       value: practica.empresa?.razonSocial ?? '—', color: '#023859' },
          { label: 'Docente asesor', value: practica.docente?.nombre ?? '—',     color: '#023859' },
          { label: 'Tutor empresarial', value: practica.tutor?.nombre ?? '—', color: '#023859' },
          { label: 'Corte actual',   value: `${obtenerCorteActual(practica, avances)} / ${practica.cortes.length}`, color: '#0B416B' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
              {c.label}
            </p>
            <p className="text-sm font-bold truncate" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Checklist paz y salvo */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-3 pb-2"
            style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-xs font-bold" style={{ color: '#023859' }}>Paz y salvo</p>
            <span className="text-[10px] font-semibold" style={{ color: '#0B416B' }}>
              {completados}/{total}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-1.5 rounded-full mb-3" style={{ background: '#f0f2f5' }}>
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct === 100 ? '#1a7a4a' : '#0B416B' }} />
          </div>

          {checklist.map(item => (
            <ChecklistItem key={item.id} label={item.label} completado={item.completado} />
          ))}

          <div className="mt-3 p-3 rounded-lg"
            style={pct === 100
              ? { background: '#eaf7f0', border: '0.5px solid #b6e8cf' }
              : { background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
            <p className="text-xs font-bold"
              style={{ color: pct === 100 ? '#1a7a4a' : '#c0392b' }}>
              {pct === 100 ? '✓ Paz y salvo disponible' : `Paz y salvo no disponible — ${total - completados} pendiente(s)`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* Últimos avances */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center justify-between mb-3 pb-2"
              style={{ borderBottom: '0.5px solid #f0f2f5' }}>
              <p className="text-xs font-bold" style={{ color: '#023859' }}>Últimos avances</p>
              <button onClick={() => navigate('/estudiante/avances')}
                className="text-[10px] font-medium" style={{ color: '#0B416B' }}>
                Ver todos →
              </button>
            </div>
            {ultimosAvances.length === 0
              ? <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin avances registrados</p>
              : ultimosAvances.map(a => (
                <div key={a.id} className="flex items-center gap-3 py-2"
                  style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                      {a.titulo}
                    </p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      Corte {a.corteNumero} · {a.fechaEntrega ?? 'Sin entregar'}
                    </p>
                  </div>
                  <BadgeEstadoAvance estado={a.estado} />
                </div>
              ))
            }
          </div>

          {/* Equipo */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Mi equipo
            </p>
            {[
              { nombre: practica.empresa?.razonSocial, rol: 'Empresa',          bg: '#e6f0fb', color: '#0B416B' },
              { nombre: practica.docente?.nombre,      rol: 'Docente asesor',   bg: '#eaf7f0', color: '#1a7a4a' },
              { nombre: practica.tutor?.nombre,        rol: 'Tutor empresarial', bg: '#fff8e6', color: '#a07010' },
            ].filter(p => p.nombre).map(p => (
              <div key={p.rol} className="flex items-center gap-3 py-2"
                style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: p.bg, color: p.color }}>
                  {p.nombre[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>{p.nombre}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{p.rol}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function obtenerCorteActual(practica, avances) {
  if (!avances.length) return 1
  const maxCorte = Math.max(...avances.map(a => a.corteNumero))
  return Math.min(maxCorte, practica.cortes.length)
}

function SinPractica() {
  return (
    <div className="bg-white rounded-xl p-10 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm font-semibold" style={{ color: '#023859' }}>
        Aún no tienes una práctica asignada
      </p>
      <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
        El coordinador te asignará una empresa próximamente
      </p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-xl p-5 animate-pulse h-16" style={{ border: '0.5px solid #e2e8f0' }} />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-14" style={{ border: '0.5px solid #e2e8f0' }} />)}
      </div>
    </div>
  )
}