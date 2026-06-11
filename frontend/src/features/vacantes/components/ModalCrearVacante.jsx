import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { vacantesApi } from '../api/vacantesApi'

const schema = z.object({
  titulo:          z.string().min(3, 'Mínimo 3 caracteres'),
  descripcion:     z.string().min(10, 'Describe la vacante'),
  perfilRequerido: z.string().min(10, 'Describe el perfil requerido'),
  requisitos:      z.string().optional(),
  cuposTotales:    z.coerce.number().min(1, 'Mínimo 1 cupo'),
  semestreMinimo:  z.coerce.number().min(1).max(10),
  modalidad:       z.string().min(1, 'Selecciona la modalidad'),
  tipoContrato:    z.string().min(1, 'Selecciona el tipo de contrato'),
  salario:         z.coerce.number().optional().or(z.literal('')),
  horario:         z.string().optional(),
  habilidades:     z.string().optional(),
})

export default function ModalCrearVacante({ onClose, onCreada }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { semestreMinimo: 7, cuposTotales: 1, modalidad: 'PRESENCIAL', tipoContrato: 'CONTRATO_APRENDIZAJE' },
  })

  const mutation = useMutation({
    mutationFn: (data) => vacantesApi.crearVacante({
      ...data,
      empresaId:    2,
      empresaNombre: 'TechCo S.A.S.',
      programaId:   1,
      programaNombre: 'Ingeniería de Software',
      habilidades: data.habilidades
        ? data.habilidades.split(',').map(h => h.trim()).filter(Boolean)
        : [],
    }),
    onSuccess: onCreada,
    onError: () => toast.error('Error al crear la vacante'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Nueva vacante</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              Quedará pendiente de aprobación por el coordinador
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">

          {/* Información básica */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
              style={{ color: '#8a9bb0' }}>Información básica</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className={lc} style={ls}>Título de la vacante</label>
                <input {...register('titulo')} className={ic} style={is}
                  placeholder="Ej: Practicante Desarrollo Web" />
                {errors.titulo && <p className="text-xs" style={{ color: '#D91438' }}>{errors.titulo.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Modalidad</label>
                <select {...register('modalidad')} className={ic} style={is}>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="REMOTA">Remota</option>
                  <option value="HIBRIDA">Híbrida</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Tipo de contrato</label>
                <select {...register('tipoContrato')} className={ic} style={is}>
                  <option value="CONTRATO_APRENDIZAJE">Contrato aprendizaje</option>
                  <option value="PRACTICA">Práctica</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Semestre mínimo</label>
                <input {...register('semestreMinimo')} type="number" min={1} max={10}
                  className={ic} style={is} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Cupos disponibles</label>
                <input {...register('cuposTotales')} type="number" min={1}
                  className={ic} style={is} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Salario mensual (opcional)</label>
                <input {...register('salario')} type="number"
                  className={ic} style={is} placeholder="Ej: 1300000" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Horario (opcional)</label>
                <input {...register('horario')} className={ic} style={is}
                  placeholder="Ej: Lunes a Viernes 8am - 5pm" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className={lc} style={ls}>Habilidades requeridas (separadas por coma)</label>
                <input {...register('habilidades')} className={ic} style={is}
                  placeholder="Ej: React, Node.js, SQL" />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
              style={{ color: '#8a9bb0' }}>Descripción y perfil</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Descripción de la vacante</label>
                <textarea {...register('descripcion')} rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={is}
                  placeholder="Describe las actividades y responsabilidades del practicante..." />
                {errors.descripcion && <p className="text-xs" style={{ color: '#D91438' }}>{errors.descripcion.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Perfil requerido</label>
                <textarea {...register('perfilRequerido')} rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={is}
                  placeholder="Describe el perfil académico y personal del candidato ideal..." />
                {errors.perfilRequerido && <p className="text-xs" style={{ color: '#D91438' }}>{errors.perfilRequerido.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Requisitos adicionales (opcional)</label>
                <textarea {...register('requisitos')} rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={is}
                  placeholder="Inglés básico, vehículo, etc." />
              </div>
            </div>
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
              {mutation.isPending ? 'Creando...' : 'Crear vacante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}