import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'

const schema = z.object({
  empresaId:   z.coerce.number().min(1, 'Selecciona una empresa'),
  fecha:       z.string().min(1, 'Selecciona la fecha'),
  duracion:    z.string().min(1, 'Ingresa la duración'),
  motivo:      z.string().min(3, 'Ingresa el motivo'),
  comentarios: z.string().optional(),
})

export default function ModalVisita({ empresas, realizadaPor, tipo, onClose, onGuardado }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fecha: new Date().toISOString().split('T')[0] },
  })

  const mutation = useMutation({
    mutationFn: (data) => empresasApi.crearVisita({
      ...data,
      realizadaPor,
      tipo,
    }),
    onSuccess: onGuardado,
    onError: () => toast.error('Error al registrar la visita'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Registrar visita</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Empresa</label>
            <select {...register('empresaId')} className={ic} style={is}>
              <option value="">Seleccionar empresa...</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.razonSocial}</option>)}
            </select>
            {errors.empresaId && <p className="text-xs" style={{ color: '#D91438' }}>{errors.empresaId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Fecha</label>
              <input {...register('fecha')} type="date" className={ic} style={is} />
              {errors.fecha && <p className="text-xs" style={{ color: '#D91438' }}>{errors.fecha.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Duración</label>
              <input {...register('duracion')} className={ic} style={is} placeholder="Ej: 2 horas" />
              {errors.duracion && <p className="text-xs" style={{ color: '#D91438' }}>{errors.duracion.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Motivo</label>
            <input {...register('motivo')} className={ic} style={is}
              placeholder="Ej: Seguimiento practicante" />
            {errors.motivo && <p className="text-xs" style={{ color: '#D91438' }}>{errors.motivo.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Comentarios</label>
            <textarea {...register('comentarios')} rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={is} placeholder="Observaciones de la visita..." />
          </div>

          {/* Realizada por (solo lectura) */}
          <div className="p-3 rounded-lg flex items-center justify-between"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>Realizada por</p>
            <p className="text-xs font-semibold" style={{ color: '#023859' }}>{realizadaPor}</p>
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
              {mutation.isPending ? 'Guardando...' : 'Registrar visita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}