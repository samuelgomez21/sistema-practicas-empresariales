import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../../docente/api/docenteApi'
import { ArrowRight, BookOpen, ClipboardCheck } from 'lucide-react'

export default function DashboardDocente() {
  const navigate   = useNavigate()
  const { user }   = useAuthStore()

  const { data: estudiantes = [], isLoading: loadEst } = useQuery({
    queryKey: ['mis-estudiantes-docente'],
    queryFn:  docenteApi.getMisEstudiantes,
  })

  const { data: avancesPendientes = [], isLoading: loadAv } = useQuery({
    queryKey: ['avances-pendientes-docente'],
    queryFn:  docenteApi.getAvancesPendientes,
  })

  const { data: perfil } = useQuery({
    queryKey: ['perfil-docente'],
    queryFn:  docenteApi.getPerfilDocente,
  })

  const conEmpresa  = estudiantes.filter(e => e.practica?.empresaNombre).length
  const sinEmpresa  = estudiantes.length - conEmpresa
  const enPractica  = estudiantes.filter(e => e.practica?.estado === 'EN_PRACTICA').length

  if (loadEst || loadAv) return <Skeleton />

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
            Panel docente asesor · Seguimiento de tus estudiantes
          </p>
        </div>
        {avancesPendientes.length > 0 && (
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: '#fff8e6', color: '#a07010' }}>
            {avancesPendientes.length} avance(s) por revisar
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Asignados',         value: estudiantes.length,      bg: '#e6f0fb', color: '#0B416B' },
          { label: 'En práctica',        value: enPractica,              bg: '#eaf7f0', color: '#1a7a4a' },
          { label: 'Sin empresa',        value: sinEmpresa,              bg: '#fff8e6', color: '#a07010' },
          { label: 'Avances pendientes', value: avancesPendientes.length, bg: '#fef0f0', color: '#c0392b' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center"
            style={{ background: s.bg, border: `0.5px solid ${s.color}30` }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Mis estudiantes */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-3 pb-2"
            style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-xs font-bold" style={{ color: '#023859' }}>
              Mis estudiantes ({estudiantes.length})
            </p>
            <button onClick={() => navigate('/docente/estudiantes')}
              className="text-[10px] font-medium flex items-center gap-1"
              style={{ color: '#0B416B' }}>
              Ver todos <ArrowRight size={10} />
            </button>
          </div>

          {estudiantes.length === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-lg"
              style={{ background: '#f7f9fb' }}>
              <BookOpen size={14} style={{ color: '#8a9bb0' }} />
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                No tienes estudiantes asignados
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {estudiantes.slice(0, 5).map(e => {
                const cfg = ESTADO_PRACTICA_LABEL[e.practica?.estado]
                  ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO
                return (
                  <button key={e.id}
                    onClick={() => navigate(`/docente/estudiantes/${e.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {e.nombre?.[0] ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                        {e.nombre}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: '#8a9bb0' }}>
                        {e.programa} · Sem. {e.semestre}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">

          {/* Avances pendientes */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center justify-between mb-3 pb-2"
              style={{ borderBottom: '0.5px solid #f0f2f5' }}>
              <p className="text-xs font-bold" style={{ color: '#023859' }}>
                Avances por revisar
              </p>
              <button onClick={() => navigate('/docente/seguimientos')}
                className="text-[10px] font-medium flex items-center gap-1"
                style={{ color: '#0B416B' }}>
                Ver todos <ArrowRight size={10} />
              </button>
            </div>

            {avancesPendientes.length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-lg"
                style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
                <ClipboardCheck size={14} style={{ color: '#1a7a4a' }} />
                <p className="text-xs" style={{ color: '#1a7a4a' }}>
                  Sin avances pendientes
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {avancesPendientes.slice(0, 4).map(a => (
                  <div key={a.id} className="p-3 rounded-lg"
                    style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
                    <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                      {a.estudianteNombre}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: '#6b7a8d' }}>
                      {a.titulo}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Accesos rápidos
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Mis estudiantes',    path: '/docente/estudiantes',  color: '#0B416B', bg: '#e6f0fb' },
                { label: 'Seguimientos',        path: '/docente/seguimientos', color: '#a07010', bg: '#fff8e6' },
                { label: 'Mi perfil docente',   path: '/docente/perfil',       color: '#1a7a4a', bg: '#eaf7f0' },
              ].map(item => (
                <button key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between h-8 px-3 rounded-lg text-xs font-semibold"
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
      <div className="grid grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-xl p-4 animate-pulse h-16 bg-gray-50" />
        ))}
      </div>
    </div>
  )
}