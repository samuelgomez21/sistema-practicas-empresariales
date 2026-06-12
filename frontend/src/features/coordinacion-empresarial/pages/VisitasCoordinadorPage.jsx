import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MapPin, Calendar, Clock, User } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi, MOTIVO_VISITA_LABEL } from '../api/coordEmpresarialApi'
import ModalRegistrarVisitaCoord from '../components/ModalRegistrarVisitaCoord'

export default function VisitasCoordinadorPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)

  const { data: visitas = [], isLoading } = useQuery({
    queryKey: ['visitas-coord'],
    queryFn:  coordEmpresarialApi.getVisitas,
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  const misVisitas    = visitas.filter(v => v.rol === 'COORDINADORA').length
  const visitasDocentes = visitas.filter(v => v.rol === 'DOCENTE').length

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Registro de visitas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            Visitas realizadas por la coordinadora empresarial y docentes asesores
          </p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
          style={{ background: '#D91438' }}>
          <Plus size={13} /> Registrar visita
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: '#f3e8ff', border: '0.5px solid #6d28d930' }}>
          <p className="text-2xl font-bold" style={{ color: '#6d28d9' }}>{misVisitas}</p>
          <p className="text-[10px]" style={{ color: '#6d28d9' }}>Mis visitas (coordinadora)</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#e6f0fb', border: '0.5px solid #0B416B30' }}>
          <p className="text-2xl font-bold" style={{ color: '#0B416B' }}>{visitasDocentes}</p>
          <p className="text-[10px]" style={{ color: '#0B416B' }}>Visitas de docentes</p>
        </div>
      </div>

      {/* Historial */}
      <div>
        <p className="text-xs font-bold mb-2" style={{ color: '#023859' }}>
          Historial de visitas
        </p>
        <div className="flex flex-col gap-3">
          {visitas.map(v => (
            <div key={v.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: v.rol === 'COORDINADORA' ? '#f3e8ff' : '#e6f0fb' }}>
                    <MapPin size={15} style={{ color: v.rol === 'COORDINADORA' ? '#6d28d9' : '#0B416B' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{v.empresaNombre}</p>
                    <p className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                      <User size={10} /> {v.responsable}
                      {v.estudianteNombre && ` · ${v.estudianteNombre}`}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={v.rol === 'COORDINADORA'
                    ? { background: '#f3e8ff', color: '#6d28d9' }
                    : { background: '#e6f0fb', color: '#0B416B' }}>
                  {v.rol === 'COORDINADORA' ? 'Coordinadora Empresarial' : 'Docente Asesor'}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-2 pl-12">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                  <Calendar size={11} /> {new Date(v.fecha).toLocaleDateString('es-CO')}
                </span>
                <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                  <Clock size={11} /> {v.duracionHoras} {v.duracionHoras === 1 ? 'hora' : 'horas'}
                </span>
              </div>

              <div className="pl-12 p-2.5 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#023859' }}>
                  Propósito: {MOTIVO_VISITA_LABEL[v.motivo] ?? v.motivo}
                </p>
                <p className="text-[11px]" style={{ color: '#6b7a8d' }}>{v.observaciones}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <ModalRegistrarVisitaCoord
          onClose={() => setModal(false)}
          onCreada={() => {
            qc.invalidateQueries({ queryKey: ['visitas-coord'] })
            setModal(false)
            toast.success('Visita registrada correctamente')
          }}
        />
      )}
    </div>
  )
}