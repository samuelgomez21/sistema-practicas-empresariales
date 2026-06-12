import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MapPin, Calendar, Clock, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { docenteApi } from '../api/docenteApi'
import ModalRegistrarVisita from '../components/ModalRegistrarVisita'

export default function VisitasPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)

  const { data: visitas = [], isLoading } = useQuery({
    queryKey: ['visitas-docente'],
    queryFn:  docenteApi.getVisitas,
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
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Visitas a empresas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {visitas.length} visita(s) registrada(s)
          </p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
          style={{ background: '#D91438' }}>
          <Plus size={13} /> Registrar visita
        </button>
      </div>

      {/* Lista de visitas */}
      {visitas.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <MapPin size={28} className="mx-auto mb-2" style={{ color: '#8a9bb0' }} />
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no has registrado visitas a empresas
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visitas.map(v => (
            <div key={v.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#e6f0fb' }}>
                    <MapPin size={16} style={{ color: '#0B416B' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>
                      {v.estudianteNombre}
                    </p>
                    <p className="flex items-center gap-1 text-[10px] mt-0.5" style={{ color: '#0B416B' }}>
                      <Building2 size={10} /> {v.empresaNombre}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="flex items-center justify-end gap-1 text-[10px] font-semibold" style={{ color: '#023859' }}>
                      <Calendar size={10} />
                      {new Date(v.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="flex items-center justify-end gap-1 text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                      <Clock size={10} /> {v.horaInicio} - {v.horaFin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <span className="inline-block text-[9px] font-bold px-2 py-1 rounded-full mb-2"
                style={{ background: '#f0f2f5', color: '#6b7a8d' }}>
                {MOTIVO_LABEL[v.motivo] ?? v.motivo}
              </span>

              {/* Observaciones */}
              <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
                {v.observaciones}
              </p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ModalRegistrarVisita
          onClose={() => setModal(false)}
          onCreada={() => {
            qc.invalidateQueries({ queryKey: ['visitas-docente'] })
            setModal(false)
            toast.success('Visita registrada correctamente')
          }}
        />
      )}
    </div>
  )
}

const MOTIVO_LABEL = {
  SEGUIMIENTO: 'Seguimiento general',
  INDUCCION:   'Verificación de inducción',
  EVALUACION:  'Evaluación intermedia',
  CIERRE:      'Visita de cierre',
  OTRO:        'Otro',
}