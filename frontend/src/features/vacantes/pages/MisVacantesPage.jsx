import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { vacantesApi } from '../api/vacantesApi'
import { empresasApi } from '@/features/empresas/api/empresasApi'
import BadgeEstadoVacante from '../components/BadgeEstadoVacante'
import TagHabilidad from '../components/TagHabilidad'
import ModalCrearVacante from '../components/ModalCrearVacante'

export default function MisVacantesPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)

  const { data: empresa } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  const { data: vacantes = [], isLoading } = useQuery({
    queryKey: ['mis-vacantes', empresa?.id],
    queryFn:  () => vacantesApi.getVacantesPorEmpresa(empresa.id),
    enabled:  !!empresa?.id,
  })

  const cerrarMutation = useMutation({
    mutationFn: (id) => vacantesApi.cerrarVacante(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mis-vacantes', empresa?.id] })
      toast.success('Vacante cerrada correctamente')
    },
  })

  if (isLoading || !empresa) return (
    <div className="flex flex-col gap-3">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl px-5 py-3 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Mis vacantes</p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            {vacantes.length} vacante(s) registrada(s)
          </p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
          style={{ background: '#D91438' }}>
          <Plus size={13} /> Nueva vacante
        </button>
      </div>

      {vacantes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no has publicado vacantes
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {vacantes.map(v => (
            <div key={v.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{v.titulo}</p>
                    <BadgeEstadoVacante estado={v.estado} />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {v.salario && (
                      <span className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                        ${Number(v.salario).toLocaleString('es-CO')}/mes
                      </span>
                    )}
                    {v.horario && (
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>{v.horario}</span>
                    )}
                    <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {v.cuposDisponibles}/{v.cuposTotales} cupos
                    </span>
                  </div>
                </div>

                {v.estado === 'APROBADA' && (
                  <button
                    onClick={() => cerrarMutation.mutate(v.id)}
                    className="h-7 px-3 rounded-lg text-[10px] font-semibold"
                    style={{ background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
                    Cerrar vacante
                  </button>
                )}
              </div>

              {v.habilidades?.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {v.habilidades.map(h => <TagHabilidad key={h} label={h} />)}
                </div>
              )}

              {v.estado === 'PENDIENTE' && (
                <div className="mt-2 p-2 rounded"
                  style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
                  <p className="text-[10px]" style={{ color: '#a07010' }}>
                    Esperando aprobación del coordinador de práctica
                  </p>
                </div>
              )}

              {v.estado === 'RECHAZADA' && v.motivoRechazo && (
                <div className="mt-2 p-2 rounded"
                  style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
                  <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#c0392b' }}>
                    Vacante rechazada
                  </p>
                  <p className="text-[10px]" style={{ color: '#c0392b' }}>
                    {v.motivoRechazo}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ModalCrearVacante
          empresaId={empresa.id}
          onClose={() => setModal(false)}
          onCreada={() => {
            qc.invalidateQueries({ queryKey: ['mis-vacantes', empresa.id] })
            setModal(false)
            toast.success('Vacante creada. Está pendiente de aprobación.')
          }}
        />
      )}
    </div>
  )
}