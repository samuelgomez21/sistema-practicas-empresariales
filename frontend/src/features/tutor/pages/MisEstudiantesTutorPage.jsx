import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Calendar, User } from 'lucide-react'
import { tutorApi, ESTADO_PRACTICA_LABEL_TUTOR } from '../api/tutorApi'

export default function MisEstudiantesTutorPage() {
  const navigate = useNavigate()

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['mis-estudiantes-tutor'],
    queryFn:  tutorApi.getMisEstudiantes,
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Mis practicantes
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          {estudiantes.length} estudiante(s) bajo tu supervisión
        </p>
      </div>

      {estudiantes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no tienes estudiantes asignados
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {estudiantes.map(e => {
            const cfg = ESTADO_PRACTICA_LABEL_TUTOR[e.estado] ?? ESTADO_PRACTICA_LABEL_TUTOR.EN_PRACTICA
            return (
              <button key={e.id}
                onClick={() => navigate(`/tutor/estudiantes/${e.id}`)}
                className="bg-white rounded-xl p-5 flex items-center justify-between text-left transition-all hover:shadow-sm"
                style={{ border: '0.5px solid #e2e8f0' }}>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: '#fde6ea', color: '#D91438' }}>
                    {e.nombre[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {e.programa} · Sem. {e.semestre} · Práctica #{e.numeroPractica}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                        <Calendar size={10} />
                        {new Date(e.fechaInicio).toLocaleDateString('es-CO')} - {new Date(e.fechaFinEstimada).toLocaleDateString('es-CO')}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                        <User size={10} /> {e.docenteNombre}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                    {e.notaTutor == null && (
                        <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                            style={{ background: '#fde6ea', color: '#D91438' }}>
                            Nota pendiente
                        </span>
                    )}
                  {!e.encuestaCompletada && (
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: '#fff8e6', color: '#a07010' }}>
                      Encuesta pendiente
                    </span>
                  )}
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <ChevronRight size={16} style={{ color: '#8a9bb0' }} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}