import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'

export default function ModalPlantilla({ plantilla, onClose, onGuardado }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { asunto: plantilla.asunto ?? '', cuerpo: plantilla.cuerpo ?? '' },
  })

  const mutation = useMutation({
    mutationFn: (data) => configuracionApi.editarPlantilla(plantilla.id, data),
    onSuccess: onGuardado,
    onError: () => toast.error('Error al guardar'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-lg p-6" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Editar plantilla: {plantilla.nombre}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              Evento: <span className="font-mono">{plantilla.evento}</span>
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        {/* Variables disponibles */}
        <div className="mb-4 p-3 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#023859' }}>
            Variables disponibles
          </p>
          <div className="flex flex-wrap gap-1">
            {plantilla.variables.map((v) => (
              <span key={v} className="text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
                style={{ background: '#e6f0fb', color: '#0B416B' }}
                title="Haz clic para copiar"
                onClick={() => navigator.clipboard.writeText(v)}>
                {v}
              </span>
            ))}
          </div>
          <p className="text-[9px] mt-1" style={{ color: '#8a9bb0' }}>
            Haz clic en una variable para copiarla
          </p>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
              Asunto del correo
            </label>
            <input {...register('asunto')} className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={is} placeholder="Asunto del correo" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
              Cuerpo del mensaje
            </label>
            <textarea {...register('cuerpo')} rows={6}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={is}
              placeholder="Hola {{nombre}}, escribe aquí el cuerpo del correo..." />
          </div>

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Guardando...' : 'Guardar plantilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}