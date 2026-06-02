import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'
import BadgeEstado from '../components/BadgeEstado'
import ModalPlantilla from '../components/ModalPlantilla'

export default function PlantillasCorreoPage() {
  const qc = useQueryClient()
  const [editando, setEditando] = useState(null)

  const { data: plantillas = [], isLoading } = useQuery({
    queryKey: ['plantillas-correo'],
    queryFn: configuracionApi.getPlantillas,
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => configuracionApi.togglePlantilla(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['plantillas-correo'] })
      toast.success('Estado de plantilla actualizado')
    },
    onError: () => toast.error('Error al cambiar el estado'),
  })

  if (isLoading) return <div className="text-xs text-gray-400 p-4">Cargando...</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="px-5 py-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Plantillas de correo</p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Personaliza los correos automáticos del sistema
          </p>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Plantilla', 'Evento', 'Variables disponibles', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plantillas.map((p) => (
              <tr key={p.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{p.nombre}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[9px] font-mono px-2 py-1 rounded"
                    style={{ background: '#f0f2f5', color: '#6b7a8d' }}>
                    {p.evento}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.variables.map((v) => (
                      <span key={v} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <BadgeEstado activo={p.activa} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditando(p)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar plantilla">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => toggleMutation.mutate(p.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title={p.activa ? 'Desactivar' : 'Activar'}>
                      <Power size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <ModalPlantilla
          plantilla={editando}
          onClose={() => setEditando(null)}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['plantillas-correo'] })
            setEditando(null)
            toast.success('Plantilla actualizada')
          }}
        />
      )}
    </div>
  )
}