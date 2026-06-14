import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { tutorApi, ESTADO_PRACTICA_LABEL_TUTOR } from '../../tutor/api/tutorApi'
import { ArrowRight, ClipboardCheck, Users, Award } from 'lucide-react'

export default function DashboardTutor() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['mis-estudiantes-tutor'],
    queryFn:  tutorApi.getMisEstudiantes,
  })

  const { data: perfil } = useQuery({
    queryKey: ['perfil-tutor'],
    queryFn:  tutorApi.getPerfilTutor,
  })

  const encuestasPendientes = estudiantes.filter(e => !e.encuestaCompletada).length
  const notasPendientes     = estudiantes.filter(e => e.notaTutor == null).length
  const enPractica          = estudiantes.filter(e => e.estado === 'EN_PRACTICA').length

  if (isLoading) return <Skeleton />

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
            Panel tutor empresarial · {perfil?.empresaNombre ?? '—'}
          </p>
        </div>
        {(encuestasPendientes > 0 || notasPendientes > 0) && (
          <div className="flex gap-2">
            {encuestasPendientes > 0 && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: '#fef0f0', color: '#c0392b' }}>
                {encuestasPendientes} encuesta(s) pendiente(s)
              </span>
            )}
            {notasPendientes > 0 && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: '#fff8e6', color: '#a07010' }}>
                {notasPendientes} nota(s) pendiente(s)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Estudiantes asignados', value: estudiantes.length,
            bg: '#e6f0fb', color: '#0B416B', icon: <Users size={16} /> },
          { label: 'Encuestas pendientes',  value: encuestasPendientes,
            bg: encuestasPendientes > 0 ? '#fef0f0' : '#eaf7f0',
            color: encuestasPendientes > 0 ? '#c0392b' : '#1a7a4a',
            icon: <ClipboardCheck size={16} /> },
          { label: 'Notas pendientes',      value: notasPendientes,
            bg: notasPendientes > 0 ? '#fff8e6' : '#eaf7f0',
            color: notasPendientes > 0 ? '#a07010' : '#1a7a4a',
            icon: <Award size={16} /> },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: s.bg, border: `0.5px solid ${s.color}30` }}>
            <div style={{ color: s.color }}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px]" style={{ color: s.color }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mis practicantes */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-3 pb-2"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <p className="text-xs font-bold" style={{ color: '#023859' }}>
            Mis practicantes ({estudiantes.length})
          </p>
          <button onClick={() => navigate('/tutor/estudiantes')}
            className="text-[10px] font-medium flex items-center gap-1"
            style={{ color: '#0B416B' }}>
            Ver todos <ArrowRight size={10} />
          </button>
        </div>

        {estudiantes.length === 0 ? (
          <div className="p-4 rounded-lg text-center"
            style={{ background: '#f7f9fb' }}>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              No tienes practicantes asignados
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {estudiantes.map((e, idx) => {
              const cfg = ESTADO_PRACTICA_LABEL_TUTOR[e.estado]
                ?? ESTADO_PRACTICA_LABEL_TUTOR.EN_PRACTICA
              return (
                <button key={e.id}
                  onClick={() => navigate(`/tutor/estudiantes/${e.id}`)}
                  className="flex items-center gap-3 py-3 text-left hover:bg-gray-50 px-1 rounded-lg"
                  style={{ borderBottom: idx < estudiantes.length - 1 ? '0.5px solid #f7f9fb' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {e.nombre?.[0] ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                      {e.nombre}
                    </p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {e.programa} · Sem. {e.semestre}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!e.encuestaCompletada && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: '#fef0f0', color: '#D91438' }}>
                        Encuesta
                      </span>
                    )}
                    {e.notaTutor == null && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: '#fff8e6', color: '#a07010' }}>
                        Nota
                      </span>
                    )}
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                </button>
              )
            })}
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
            { label: 'Mis estudiantes', path: '/tutor/estudiantes', color: '#0B416B', bg: '#e6f0fb' },
            { label: 'Mi perfil',       path: '/tutor/perfil',      color: '#1a7a4a', bg: '#eaf7f0' },
          ].map(item => (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between h-9 px-3 rounded-lg text-xs font-semibold"
              style={{ background: item.bg, color: item.color }}>
              {item.label}
              <ArrowRight size={11} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-xl p-5 animate-pulse h-16"
        style={{ border: '0.5px solid #e2e8f0' }} />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-xl p-4 animate-pulse h-16 bg-gray-50" />
        ))}
      </div>
    </div>
  )
}