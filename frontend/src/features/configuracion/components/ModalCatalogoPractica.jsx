import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'

const schema = z.object({
  nombre:        z.string().min(2, 'Mínimo 2 caracteres'),
  programaId:    z.coerce.number().min(1, 'Selecciona un programa'),
  materiaNucleo: z.string().min(3, 'Ingresa la materia núcleo'),
  descripcion:   z.string().min(10, 'Describe qué puede hacer el estudiante en esta práctica'),
})

export default function ModalCatalogoPractica({ item, programas, onClose, onGuardado }) {
  const esEdicion = !!item

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: item ?? {},
  })

  const mutation = useMutation({
    mutationFn: (data) =>
      esEdicion
        ? configuracionApi.editarCatalogoPractica(item.id, data)
        : configuracionApi.crearCatalogoPractica(data),
    onSuccess: onGuardado,
    onError: () => toast.error('Error al guardar'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-lg p-6" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              {esEdicion ? 'Editar práctica del catálogo' : 'Nueva práctica en el catálogo'}
            </p>
            {esEdicion && (
              <p className="text-[10px] mt-0.5" style={{ color: '#a07010' }}>
                Los cambios solo aplican a prácticas futuras
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Nombre</label>
              <input {...register('nombre')} className={ic} style={is} placeholder="Ej: Práctica I" />
              {errors.nombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.nombre.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Programa</label>
              <select {...register('programaId')} className={ic} style={is}>
                <option value="">Seleccionar...</option>
                {programas.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {errors.programaId && <p className="text-xs" style={{ color: '#D91438' }}>{errors.programaId.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Materia núcleo</label>
            <input {...register('materiaNucleo')} className={ic} style={is}
              placeholder="Ej: Proyecto de Grado I" />
            {errors.materiaNucleo && <p className="text-xs" style={{ color: '#D91438' }}>{errors.materiaNucleo.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>¿Qué puede hacer el estudiante?</label>
            <textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Describe las actividades y competencias que el estudiante desarrollará en esta práctica..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={is}
            />
            {errors.descripcion && <p className="text-xs" style={{ color: '#D91438' }}>{errors.descripcion.message}</p>}
          </div>

          <div className="flex gap-2 justify-end mt-1">
            <button type="button" onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}