import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
})

export default function ModalFacultad({ facultad, onClose, onGuardado }) {
  const esEdicion = !!facultad

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: facultad ?? {},
  })

  const mutation = useMutation({
    mutationFn: (data) =>
      esEdicion
        ? configuracionApi.editarFacultad(facultad.id, data)
        : configuracionApi.crearFacultad(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Facultad actualizada' : 'Facultad creada correctamente')
      onGuardado()
    },
    onError: () => toast.error('Error al guardar la facultad'),
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {esEdicion ? 'Editar facultad' : 'Nueva facultad'}
          </p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
          <Campo label="Nombre de la facultad" error={errors.nombre}>
            <input {...register('nombre')} placeholder="Ej: Ingeniería" />
          </Campo>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}
            >
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Campo({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
        {label}
      </label>
      {/* Aplica estilos al input hijo */}
      <div
        className="[&>input]:w-full [&>input]:h-10 [&>input]:px-3 [&>input]:rounded-lg
          [&>input]:text-sm [&>input]:outline-none"
        style={{
          '--input-border': error ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
        }}
      >
        <style>{`input { border: var(--input-border) !important; background: #f7f9fb; color: #023859; }`}</style>
        {children}
      </div>
      {error && <p className="text-xs" style={{ color: '#D91438' }}>{error.message}</p>}
    </div>
  )
}