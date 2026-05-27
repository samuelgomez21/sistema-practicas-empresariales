import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'

const schema = z.object({
  nombre:            z.string().min(3, 'Mínimo 3 caracteres'),
  facultadId:        z.coerce.number().min(1, 'Selecciona una facultad'),
  numeroPracticas:   z.coerce.number().min(1).max(5),
  corteseguimiento:  z.coerce.number().min(1).max(10),
  notaMinima:        z.coerce.number().min(0).max(5),
})

export default function ModalPrograma({ programa, facultades, onClose, onGuardado }) {
  const esEdicion = !!programa

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: programa ?? { numeroPracticas: 2, corteseguimiento: 4, notaMinima: 3.5 },
  })

  const mutation = useMutation({
    mutationFn: (data) =>
      esEdicion
        ? configuracionApi.editarPrograma(programa.id, data)
        : configuracionApi.crearPrograma(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Programa actualizado' : 'Programa creado')
      onGuardado()
    },
    onError: () => toast.error('Error al guardar el programa'),
  })

  const inputClass = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const inputStyle = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const labelClass = "text-[10px] font-bold uppercase tracking-wide"
  const labelStyle = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {esEdicion ? 'Editar programa' : 'Nuevo programa'}
          </p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} style={labelStyle}>Nombre del programa</label>
            <input {...register('nombre')} className={inputClass} style={inputStyle}
              placeholder="Ej: Ingeniería de Software" />
            {errors.nombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass} style={labelStyle}>Facultad</label>
            <select {...register('facultadId')} className={inputClass} style={inputStyle}>
              <option value="">Selecciona una facultad</option>
              {facultades.map((f) => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
            {errors.facultadId && <p className="text-xs" style={{ color: '#D91438' }}>{errors.facultadId.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} style={labelStyle}>N° prácticas</label>
              <input {...register('numeroPracticas')} type="number" min="1" max="5"
                className={inputClass} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} style={labelStyle}>Cortes</label>
              <input {...register('corteseguimiento')} type="number" min="1" max="10"
                className={inputClass} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass} style={labelStyle}>Nota mínima</label>
              <input {...register('notaMinima')} type="number" step="0.1" min="0" max="5"
                className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
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