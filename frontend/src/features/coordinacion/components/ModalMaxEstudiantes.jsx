import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { coordinacionApi } from '../api/coordinacionApi'

export default function ModalMaxEstudiantes({ docente, onClose, onGuardado }) {
  const [max, setMax] = useState(docente.maxEstudiantes)

  const mutation = useMutation({
    mutationFn: () => coordinacionApi.actualizarMaxEstudiantes(docente.id, Number(max)),
    onSuccess: onGuardado,
    onError: () => toast.error('Error al actualizar'),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-sm p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Capacidad máxima
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {docente.nombre}
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs" style={{ color: '#6b7a8d' }}>
            Define cuántos estudiantes puede tener asignados simultáneamente este docente.
          </p>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-1.5"
              style={{ color: '#023859' }}>
              Máximo de estudiantes
            </p>
            <input
              type="number"
              min={docente.estudiantesActivos.length}
              max={20}
              value={max}
              onChange={e => setMax(e.target.value)}
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
            <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
              Actualmente tiene {docente.estudiantesActivos.length} asignado(s).
              El mínimo es {docente.estudiantesActivos.length}.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white"
            style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}