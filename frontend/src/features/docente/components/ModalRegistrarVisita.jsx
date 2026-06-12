import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { docenteApi } from '../api/docenteApi'

const schema = z.object({
  estudianteId:  z.coerce.number().min(1, 'Selecciona un estudiante'),
  fecha:         z.string().min(1, 'La fecha es obligatoria'),
  horaInicio:    z.string().min(1, 'La hora de inicio es obligatoria'),
  horaFin:       z.string().min(1, 'La hora de fin es obligatoria'),
  motivo:        z.string().min(1, 'Selecciona un motivo'),
  observaciones: z.string().min(10, 'Describe brevemente la visita'),
}).refine(d => d.horaFin > d.horaInicio, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['horaFin'],
})

export default function ModalRegistrarVisita({ onClose, onCreada }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { motivo: 'SEGUIMIENTO', fecha: new Date().toISOString().split('T')[0] },
  })

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['estudiantes-con-empresa'],
    queryFn:  docenteApi.getEstudiantesConEmpresa,
  })

  const estudianteId = watch('estudianteId')
  const estudianteSeleccionado = estudiantes.find(e => e.id === Number(estudianteId))

  const mutation = useMutation({
    mutationFn: (data) => docenteApi.crearVisita({
      ...data,
      estudianteId:    Number(data.estudianteId),
      estudianteNombre: estudianteSeleccionado?.nombre,
      empresaNombre:    estudianteSeleccionado?.practica?.empresaNombre,
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
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            Registrar visita a empresa
          </p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-3">

          {/* Estudiante */}
          <div>
            <label className={lc} style={ls}>Estudiante</label>
            <select {...register('estudianteId')} className={ic} style={is}>
              <option value="">Seleccionar estudiante...</option>
              {estudiantes.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.practica?.empresaNombre}
                </option>
              ))}
            </select>
            {errors.estudianteId && <p className="text-xs" style={{ color: '#D91438' }}>{errors.estudianteId.message}</p>}
            {estudiantes.length === 0 && (
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                No tienes estudiantes vinculados a una empresa actualmente
              </p>
            )}
          </div>

          {/* Empresa (autocompletada, solo lectura) */}
          {estudianteSeleccionado && (
            <div className="p-2 rounded-lg text-[11px]"
              style={{ background: '#e6f0fb', color: '#0B416B' }}>
              Empresa: <strong>{estudianteSeleccionado.practica?.empresaNombre}</strong>
            </div>
          )}

          {/* Fecha y horario */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={lc} style={ls}>Fecha</label>
              <input {...register('fecha')} type="date" className={ic} style={is} />
              {errors.fecha && <p className="text-xs" style={{ color: '#D91438' }}>{errors.fecha.message}</p>}
            </div>
            <div>
              <label className={lc} style={ls}>Hora inicio</label>
              <input {...register('horaInicio')} type="time" className={ic} style={is} />
            </div>
            <div>
              <label className={lc} style={ls}>Hora fin</label>
              <input {...register('horaFin')} type="time" className={ic} style={is} />
              {errors.horaFin && <p className="text-xs" style={{ color: '#D91438' }}>{errors.horaFin.message}</p>}
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className={lc} style={ls}>Motivo de la visita</label>
            <select {...register('motivo')} className={ic} style={is}>
              <option value="SEGUIMIENTO">Seguimiento general</option>
              <option value="INDUCCION">Verificación de inducción</option>
              <option value="EVALUACION">Evaluación intermedia</option>
              <option value="CIERRE">Visita de cierre</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className={lc} style={ls}>Observaciones</label>
            <textarea {...register('observaciones')} rows={4}
              placeholder="Describe lo evidenciado durante la visita: condiciones laborales, adaptación del estudiante, cumplimiento de funciones, etc."
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