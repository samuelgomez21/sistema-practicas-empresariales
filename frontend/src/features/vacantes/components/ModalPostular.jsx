import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { X, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { vacantesApi } from '../api/vacantesApi'

export default function ModalPostular({ vacante, postuladosIds = [], onClose, onPostulado }) {
  const [estudianteId, setEstudianteId] = useState('')

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['estudiantes-aptos'],
    queryFn:  vacantesApi.getEstudiantesAptos,
  })

  const disponibles = estudiantes.filter(e => !postuladosIds.includes(e.id))

  const mutation = useMutation({
    mutationFn: () => vacantesApi.crearPostulacion(vacante.id, Number(estudianteId)),
    onSuccess: onPostulado,
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Error al postular estudiante'
      toast.error(msg)
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Postular estudiante
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {vacante.titulo} — {vacante.empresaNombre}
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
              style={{ color: '#023859' }}>
              Seleccionar estudiante apto
            </p>
            <select
              value={estudianteId}
              onChange={e => setEstudianteId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
              <option value="">Seleccionar estudiante...</option>
              {disponibles.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.nombrePrograma} (Sem. {e.semestre})
                </option>
              ))}
            </select>
            {disponibles.length === 0 && (
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                No hay estudiantes aptos disponibles para postular
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <div className="flex justify-between py-1">
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Cupos disponibles</p>
              <p className="text-[10px] font-semibold" style={{ color: '#023859' }}>
                {vacante.cuposDisponibles} de {vacante.cuposTotales}
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!estudianteId || mutation.isPending}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: !estudianteId || mutation.isPending ? '#a0aab4' : '#0B416B' }}>
              <UserPlus size={13} />
              {mutation.isPending ? 'Postulando...' : 'Postular estudiante'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}