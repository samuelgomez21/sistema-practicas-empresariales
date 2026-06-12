import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle } from 'lucide-react'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'

export default function PazYSalvoCoordPage() {
  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['seguimiento-estudiantes'],
    queryFn:  coordEmpresarialApi.getEstudiantesSeguimiento,
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  const enPractica = estudiantes.filter(e => e.categoria === 'EN_PRACTICA')
  const conPazYSalvo = enPractica.filter(e => e.checklist.every(c => c.completado))
  const pendientes   = enPractica.filter(e => !e.checklist.every(c => c.completado))

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Paz y salvo de práctica
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Seguimiento del cumplimiento de requisitos para cierre de práctica
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4 text-center" style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
          <p className="text-3xl font-bold" style={{ color: '#1a7a4a' }}>{conPazYSalvo.length}</p>
          <p className="text-[10px]" style={{ color: '#1a7a4a' }}>Con paz y salvo</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
          <p className="text-3xl font-bold" style={{ color: '#c0392b' }}>{pendientes.length}</p>
          <p className="text-[10px]" style={{ color: '#c0392b' }}>Pendientes</p>
        </div>
        <div className="rounded-xl p-4 text-center bg-white" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-3xl font-bold" style={{ color: '#023859' }}>{enPractica.length}</p>
          <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Total en práctica</p>
        </div>
      </div>

      {/* Pendientes */}
      {pendientes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a07010' }} />
            <p className="text-xs font-bold" style={{ color: '#023859' }}>
              Pendientes por paz y salvo
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {pendientes.map(e => {
              const completados = e.checklist.filter(c => c.completado).length
              const total       = e.checklist.length
              return (
                <div key={e.id} className="bg-white rounded-xl p-5"
                  style={{ border: '0.5px solid #e2e8f0' }}>

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        {e.programa} · {e.empresaNombre}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: '#fff8e6', color: '#a07010' }}>
                      {completados}/{total} requisitos
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full h-1.5 rounded-full mb-3" style={{ background: '#f0f2f5' }}>
                    <div className="h-1.5 rounded-full"
                      style={{ width: `${(completados / total) * 100}%`, background: '#a07010' }} />
                  </div>

                  {/* Checklist en 2 columnas */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {e.checklist.map(c => (
                      <div key={c.clave} className="flex items-center gap-1.5">
                        {c.completado
                          ? <CheckCircle size={12} style={{ color: '#1a7a4a' }} />
                          : <XCircle    size={12} style={{ color: '#c0392b' }} />
                        }
                        <p className="text-[10px]" style={{ color: c.completado ? '#1a7a4a' : '#6b7a8d' }}>
                          {c.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Con paz y salvo */}
      {conPazYSalvo.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1a7a4a' }} />
            <p className="text-xs font-bold" style={{ color: '#023859' }}>
              Con paz y salvo completo
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {conPazYSalvo.map(e => (
              <div key={e.id} className="bg-white rounded-xl p-4 flex items-center justify-between"
                style={{ border: '0.5px solid #b6e8cf', background: '#f7fdf9' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.empresaNombre}</p>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
                  style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                  <CheckCircle size={11} /> Listo para cierre
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}