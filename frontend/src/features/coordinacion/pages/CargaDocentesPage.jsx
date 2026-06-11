import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, UserPlus, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { coordinacionApi } from '../api/coordinacionApi'
import ModalAsignarEstudiante from '../components/ModalAsignarEstudiante'
import ModalMaxEstudiantes from '../components/ModalMaxEstudiantes'

export default function CargaDocentesPage() {
  const qc = useQueryClient()
  const [expandido,     setExpandido]     = useState(null)
  const [filtroDisponible, setFiltroDisponible] = useState(false)
  const [modalAsignar,  setModalAsignar]  = useState(null)
  const [modalMax,      setModalMax]      = useState(null)

  const { data: docentes = [], isLoading } = useQuery({
    queryKey: ['docentes-carga'],
    queryFn:  coordinacionApi.getDocentes,
  })

  const filtrados = filtroDisponible
    ? docentes.filter(d => d.estudiantesActivos.length < d.maxEstudiantes)
    : docentes

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

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Carga de docentes asesores
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {docentes.length} docente(s) registrado(s)
          </p>
        </div>
        <button
          onClick={() => setFiltroDisponible(prev => !prev)}
          className="h-8 px-3 rounded-lg text-xs font-semibold transition-all"
          style={filtroDisponible
            ? { background: '#023859', color: '#fff' }
            : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
          }>
          {filtroDisponible ? '✓ Con cupos disponibles' : 'Filtrar con cupos disponibles'}
        </button>
      </div>

      {/* Cards de docentes */}
      <div className="flex flex-col gap-3">
        {filtrados.map(d => {
          const pct       = d.maxEstudiantes > 0
            ? (d.estudiantesActivos.length / d.maxEstudiantes) * 100 : 0
          const lleno     = d.estudiantesActivos.length >= d.maxEstudiantes
          const abierto   = expandido === d.id

          return (
            <div key={d.id} className="bg-white rounded-xl overflow-hidden"
              style={{ border: '0.5px solid #e2e8f0' }}>

              {/* Cabecera del docente */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      {d.nombre[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold" style={{ color: '#023859' }}>{d.nombre}</p>
                        <span className="text-[9px] px-2 py-0.5 rounded"
                          style={{ background: '#f0f2f5', color: '#6b7a8d' }}>
                          {d.dedicacion}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#8a9bb0' }}>{d.facultad}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                        {d.correo}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModalMax(d)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Configurar máximo estudiantes">
                      <Settings size={13} />
                    </button>
                  </div>
                </div>

                {/* Barra de carga */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-medium" style={{ color: '#8a9bb0' }}>
                      Carga asignada
                    </p>
                    <p className="text-[10px] font-bold" style={{ color: '#023859' }}>
                      {d.estudiantesActivos.length} / {d.maxEstudiantes} estudiantes
                    </p>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#f0f2f5' }}>
                    <div className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        background: lleno ? '#c0392b' : pct > 70 ? '#a07010' : '#1a7a4a',
                      }} />
                  </div>
                  {lleno && (
                    <p className="text-[9px] mt-1" style={{ color: '#c0392b' }}>
                      Cupo completo — no se pueden asignar más estudiantes
                    </p>
                  )}
                </div>

                {/* Toggle estudiantes */}
                <button
                  onClick={() => setExpandido(abierto ? null : d.id)}
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-medium"
                  style={{ color: '#0B416B' }}>
                  {abierto ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {d.estudiantesActivos.length} estudiante(s) asignado(s)
                </button>
              </div>

              {/* Lista expandida de estudiantes */}
              {abierto && (
                <div className="px-5 pb-5"
                  style={{ borderTop: '0.5px solid #f0f2f5' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide py-3"
                    style={{ color: '#8a9bb0' }}>
                    Estudiantes asignados
                  </p>

                  {d.estudiantesActivos.length === 0 ? (
                    <p className="text-xs pb-2" style={{ color: '#8a9bb0' }}>
                      Sin estudiantes asignados
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1 mb-3">
                      {d.estudiantesActivos.map(e => (
                        <div key={e.id}
                          className="flex items-center justify-between py-2"
                          style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                              {e.nombre}
                            </p>
                            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                              {e.programa} · Sem. {e.semestre}
                            </p>
                          </div>
                          <div className="w-2 h-2 rounded-full" style={{ background: '#1a7a4a' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botón asignar — solo si tiene cupo */}
                  {!lleno && (
                    <button
                      onClick={() => setModalAsignar(d)}
                      className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-semibold transition-all"
                      style={{ border: '1px dashed #b5d4f4', color: '#0B416B', background: '#f7fbff' }}>
                      <UserPlus size={13} />
                      + Asignar estudiante
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modalAsignar && (
        <ModalAsignarEstudiante
          docente={modalAsignar}
          onClose={() => setModalAsignar(null)}
          onAsignado={() => {
            qc.invalidateQueries({ queryKey: ['docentes-carga'] })
            qc.invalidateQueries({ queryKey: ['estudiantes-clasificacion'] })
            setModalAsignar(null)
            toast.success('Estudiante asignado correctamente')
          }}
        />
      )}

      {modalMax && (
        <ModalMaxEstudiantes
          docente={modalMax}
          onClose={() => setModalMax(null)}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['docentes-carga'] })
            setModalMax(null)
            toast.success('Máximo de estudiantes actualizado')
          }}
        />
      )}
    </div>
  )
}