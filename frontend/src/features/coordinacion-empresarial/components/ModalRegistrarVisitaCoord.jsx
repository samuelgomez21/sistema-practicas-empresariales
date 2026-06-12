import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'

const schema = z.object({
  empresaNombre:    z.string().min(1, 'Selecciona una empresa'),
  estudianteNombre: z.string().optional(),
  fecha:            z.string().min(1, 'La fecha es obligatoria'),
  duracionHoras:    z.coerce.number().min(0.5, 'Mínimo 0.5 horas'),
  motivo:           z.string().min(1, 'Selecciona un motivo'),
  observaciones:    z.string().min(10, 'Describe brevemente la visita'),
})

export default function ModalRegistrarVisitaCoord({ onClose, onCreada }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { motivo: 'VERIFICACION', fecha: new Date().toISOString().split('T')[0], duracionHoras: 1 },
  })

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas-activas'],
    queryFn:  coordEmpresarialApi.getEmpresasActivas,
  })

  const mutation = useMutation({
    mutationFn: (data) => coordEmpresarialApi.crearVisita({
      ...data,
      estudianteNombre: data.estudianteNombre || null,
    }),
    onSuccess: onCreada,
    onError: () => toast.error('Error al registrar la visita'),
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
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Registrar visita</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-3">

          <div>
            <label className={lc} style={ls}>Empresa</label>
            <select {...register('empresaNombre')} className={ic} style={is}>
              <option value="">Seleccionar empresa...</option>
              {empresas.map(e => (
                <option key={e.id} value={e.razonSocial}>{e.razonSocial}</option>
              ))}
            </select>
            {errors.empresaNombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.empresaNombre.message}</p>}
          </div>

          <div>
            <label className={lc} style={ls}>Estudiante (opcional)</label>
            <input {...register('estudianteNombre')} className={ic} style={is}
              placeholder="Solo si la visita está relacionada con un estudiante" />
            <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
              Déjalo vacío si la visita es para renovación de convenio u otro propósito general.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lc} style={ls}>Fecha</label>
              <input {...register('fecha')} type="date" className={ic} style={is} />
              {errors.fecha && <p className="text-xs" style={{ color: '#D91438' }}>{errors.fecha.message}</p>}
            </div>
            <div>
              <label className={lc} style={ls}>Duración (horas)</label>
              <input {...register('duracionHoras')} type="number" step="0.5" min="0.5" className={ic} style={is} />
              {errors.duracionHoras && <p className="text-xs" style={{ color: '#D91438' }}>{errors.duracionHoras.message}</p>}
            </div>
          </div>

          <div>
            <label className={lc} style={ls}>Motivo</label>
            <select {...register('motivo')} className={ic} style={is}>
              <option value="VERIFICACION">Verificación de condiciones</option>
              <option value="SEGUIMIENTO">Seguimiento académico</option>
              <option value="RENOVACION_CONVENIO">Renovación de convenio</option>
              <option value="EVALUACION">Evaluación intermedia</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className={lc} style={ls}>Observaciones</label>
            <textarea {...register('observaciones')} rows={4}
              placeholder="Describe lo evidenciado durante la visita..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={is} />
            {errors.observaciones && <p className="text-xs" style={{ color: '#D91438' }}>{errors.observaciones.message}</p>}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Registrando...' : 'Registrar visita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}