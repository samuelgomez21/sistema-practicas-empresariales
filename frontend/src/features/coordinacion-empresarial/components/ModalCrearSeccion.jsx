import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'

const schema = z.object({
  codigo: z.string().min(1, 'Ingresa un código'),
  titulo: z.string().min(3, 'Mínimo 3 caracteres'),
  orden:  z.coerce.number().min(1),
})

export default function ModalCrearSeccion({ plantillaId, onClose, onCreada }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { orden: 1 },
  })

  const mutation = useMutation({
    mutationFn: (data) => coordEmpresarialApi.crearSeccion({ ...data, plantillaId }),
    onSuccess: onCreada,
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al crear sección'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Nueva sección</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className={lc} style={ls}>Código</label>
              <input {...register('codigo')} className={ic} style={is} placeholder="Ej: A" />
              {errors.codigo && <p className="text-xs mt-1" style={{ color: '#D91438' }}>{errors.codigo.message}</p>}
            </div>
            <div className="col-span-1">
              <label className={lc} style={ls}>Orden</label>
              <input {...register('orden')} type="number" min={1} className={ic} style={is} />
            </div>
          </div>
          <div>
            <label className={lc} style={ls}>Título de la sección</label>
            <input {...register('titulo')} className={ic} style={is}
              placeholder="Ej: Condiciones del ambiente de trabajo" />
            {errors.titulo && <p className="text-xs mt-1" style={{ color: '#D91438' }}>{errors.titulo.message}</p>}
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
              {mutation.isPending ? 'Creando...' : 'Crear sección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}