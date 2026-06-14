import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { estudianteApi } from '../../estudiante/api/estudianteApi'
import { ArrowRight, BookOpen, FileText, ClipboardCheck, Users } from 'lucide-react'
import BadgeEstadoPractica from '../../estudiante/components/BadgeEstadoPractica'
import ChecklistItem from '../../estudiante/components/ChecklistItem'
import BadgeEstadoAvance from '../../estudiante/components/BadgeEstadoAvance'

const ESTADO_PRACTICA_LABEL = {
  ASIGNADA_PENDIENTE_INICIO: 'Pendiente inicio',
  EN_PROCESO_VINCULACION:    'En vinculación',
  CONVENIO_REGISTRADO:       'Convenio registrado',
  EN_PRACTICA:               'En práctica',
  COMPLETADA:                'Completada',
  REPROBADA:                 'Reprobada',
  CANCELADA:                 'Cancelada',
  EN_CURSO:                  'En curso',
}

export default function DashboardEstudiante() {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()

  const { data: practica, isLoading: loadP } = useQuery({
    queryKey: ['mi-practica'],
    queryFn:  estudianteApi.getMiPractica,
  })

  const { data: avances = [], isLoading: loadA } = useQuery({
    queryKey: ['mis-avances'],
    queryFn:  estudianteApi.getAvances,
  })

  const { data: checklist = [] } = useQuery({
    queryKey: ['mi-checklist'],
    queryFn:  estudianteApi.getChecklist,
  })

  const { data: postulaciones = [] } = useQuery({
    queryKey: ['mis-postulaciones'],
    queryFn:  estudianteApi.getMisPostulaciones,
  })

  if (loadP || loadA) return <Skeleton />

  // Sin práctica asignada
  if (!practica) return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Hola, {user?.nombre?.split(' ')[0]} 👋
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Bienvenido al sistema de prácticas empresariales
        </p>
      </div>

      {/* Si tiene postulaciones activas */}
      {postulaciones.length > 0 && (
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Mis postulaciones activas
          </p>
          <div className="flex flex-col gap-2">
            {postulaciones.map(p => (
              <div key={p.vacanteId} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                    {p.tituloVacante}
                  </p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{p.empresaNombre}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#e6f0fb', color: '#0B416B' }}>
                  {p.estado}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/estudiante/postulaciones')}
            className="mt-3 text-[10px] font-semibold flex items-center gap-1"
            style={{ color: '#0B416B' }}>
            Ver todas mis postulaciones <ArrowRight size={11} />
          </button>
        </div>
      )}

      {postulaciones.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
          <BookOpen size={32} className="mx-auto mb-3" style={{ color: '#8a9bb0' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            Aún no tienes una práctica asignada
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            El coordinador te postulará a vacantes disponibles cuando estés clasificado como APTO
          </p>
        </div>
      )}
    </div>
  )

  // Con práctica
  const completados  = checklist.filter(c => c.completado).length
  const total        = checklist.length
  const pct          = total > 0 ? Math.round((completados / total) * 100) : 0
  const ultimosAv    = [...avances].reverse().slice(0, 3)
  const estadoLabel  = ESTADO_PRACTICA_LABEL[practica.estado] ?? practica.estado

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Hola, {user?.nombre?.split(' ')[0]} 👋
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {practica.programa} · {practica.nombrePractica}
          </p>
        </div>
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
          {estadoLabel}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
            Empresa
          </p>
          <p className="text-sm font-bold truncate" style={{ color: '#023859' }}>
            {practica.empresa?.razonSocial ?? '—'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
            Docente asesor
          </p>
          <p className="text-sm font-bold truncate" style={{ color: '#023859' }}>
            {practica.docente?.nombre ?? '—'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
            Avances entregados
          </p>
          <p className="text-sm font-bold" style={{ color: '#0B416B' }}>
            {avances.length}
          </p>
        </div>
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

          <div className="w-full h-1.5 rounded-full mb-3" style={{ background: '#f0f2f5' }}>
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct === 100 ? '#1a7a4a' : '#0B416B' }} />
          </div>

          {checklist.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              El checklist se cargará cuando tu práctica esté activa
            </p>
          ) : (
            checklist.map(item => (
              <ChecklistItem key={item.id} label={item.label} completado={item.completado} />
            ))
          )}

          <div className="mt-3 p-3 rounded-lg"
            style={pct === 100
              ? { background: '#eaf7f0', border: '0.5px solid #b6e8cf' }
              : { background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
            <p className="text-xs font-bold"
              style={{ color: pct === 100 ? '#1a7a4a' : '#c0392b' }}>
              {pct === 100
                ? '✓ Paz y salvo disponible'
                : total > 0
                  ? `${total - completados} requisito(s) pendiente(s)`
                  : 'Pendiente de configuración'}
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
                className="text-[10px] font-medium flex items-center gap-1"
                style={{ color: '#0B416B' }}>
                Ver todos <ArrowRight size={10} />
              </button>
            </div>
            {ultimosAv.length === 0 ? (
              <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin avances registrados</p>
            ) : ultimosAv.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 py-2"
                style={{ borderBottom: i < ultimosAv.length - 1 ? '0.5px solid #f7f9fb' : 'none' }}>
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
            ))}
          </div>

          {/* Equipo */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Mi equipo
            </p>
            {[
              { nombre: practica.empresa?.razonSocial, rol: 'Empresa',           bg: '#e6f0fb', color: '#0B416B' },
              { nombre: practica.docente?.nombre,      rol: 'Docente asesor',    bg: '#eaf7f0', color: '#1a7a4a' },
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

          {/* Accesos rápidos */}
          <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-[12px] font-semibold mb-2 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Accesos rápidos
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Registrar avance',   path: '/estudiante/avances',       color: '#0B416B', bg: '#e6f0fb' },
                { label: 'Mis documentos',     path: '/estudiante/documentos',    color: '#1a7a4a', bg: '#eaf7f0' },
                { label: 'Encuesta',           path: '/estudiante/encuestas',     color: '#6d28d9', bg: '#f3e8ff' },
                { label: 'Paz y salvo',        path: '/estudiante/paz-salvo',     color: '#a07010', bg: '#fff8e6' },
              ].map(item => (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between h-8 px-3 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: item.bg, color: item.color }}>
                  {item.label}
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-xl p-5 animate-pulse h-16" style={{ border: '0.5px solid #e2e8f0' }} />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-14" style={{ border: '0.5px solid #e2e8f0' }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1,2].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-40" style={{ border: '0.5px solid #e2e8f0' }} />
        ))}
      </div>
    </div>
  )
}