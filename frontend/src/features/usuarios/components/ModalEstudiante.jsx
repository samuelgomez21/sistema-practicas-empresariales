import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { estudiantesApi } from '../api/estudiantesApi'
import { programasApi } from '@/features/configuracion/api/programasApi'

const TIPOS_IDENTIFICACION = [
  { value: 'cedula', label: 'Cédula de ciudadanía' },
  { value: 'tarjeta_identidad', label: 'Tarjeta de identidad' },
  { value: 'cedula_extranjeria', label: 'Cédula de extranjería' },
  { value: 'pasaporte', label: 'Pasaporte' },
]

const schema = z.object({
  nombre:             z.string().min(3, 'Mínimo 3 caracteres'),
  email:              z.string().email('Correo inválido'),
  tipoIdentificacion: z.string().min(1, 'Selecciona el tipo'),
  identificacion:     z.string().min(3, 'Identificación inválida'),
  telefono:           z.string().optional(),
  contactoEmergencia: z.string().optional(),
  programaId:         z.coerce.number().min(1, 'Selecciona un programa'),
  semestre:           z.coerce.number().min(1).max(12),
  creditosAprobados:  z.coerce.number().min(0),
  promedioAcumulado:  z.coerce.number().min(0).max(5),
})

export default function ModalEstudiante({ estudiante, onClose, onGuardado }) {
  const esEdicion = !!estudiante

  const { data: programas = [] } = useQuery({
    queryKey: ['programas-todos'],
    queryFn:  programasApi.getProgramas,
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: estudiante
      ? {
          nombre:             estudiante.nombre,
          email:              estudiante.email,
          tipoIdentificacion: estudiante.tipoIdentificacion,
          identificacion:     estudiante.documento,
          telefono:           estudiante.telefono ?? '',
          contactoEmergencia: estudiante.contactoEmergencia ?? '',
          programaId:         estudiante.programaId,
          semestre:           estudiante.semestre,
          creditosAprobados:  estudiante.creditosAprobados,
          promedioAcumulado:  estudiante.promedioAcumulado,
        }
      : { semestre: 1, creditosAprobados: 0, promedioAcumulado: 0 },
  })

  const mutation = useMutation({
    mutationFn: (data) =>
      esEdicion
        ? estudiantesApi.actualizarEstudiante(estudiante.id, data)
        : estudiantesApi.crearEstudiante(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Estudiante actualizado' : 'Estudiante creado — se envió la contraseña temporal al correo')
      onGuardado()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Error al guardar el estudiante'
      toast.error(msg)
    },
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const isDisabled = { border: '1.5px solid #e2e8f0', background: '#f0f2f5', color: '#8a9bb0' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  const Campo = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className={lc} style={ls}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: '#D91438' }}>{error.message}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              {esEdicion ? 'Editar estudiante' : 'Nuevo estudiante'}
            </p>
            {!esEdicion && (
              <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                Se generará una contraseña temporal (la identificación) y se enviará al correo registrado
              </p>
            )}
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">

          {/* Sección datos personales */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
              style={{ color: '#8a9bb0' }}>Datos personales</p>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Nombre completo" error={errors.nombre}>
                <input {...register('nombre')} className={ic} style={esEdicion ? isDisabled : is}
                  placeholder="Nombre completo" disabled={esEdicion} />
              </Campo>
              <Campo label="Correo electrónico" error={errors.email}>
                <input {...register('email')} className={ic} style={esEdicion ? isDisabled : is}
                  placeholder="correo@uah.edu.co" disabled={esEdicion} />
              </Campo>
              <Campo label="Tipo de identificación" error={errors.tipoIdentificacion}>
                <select {...register('tipoIdentificacion')} className={ic} style={esEdicion ? isDisabled : is} disabled={esEdicion}>
                  <option value="">Seleccionar...</option>
                  {TIPOS_IDENTIFICACION.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Número de identificación" error={errors.identificacion}>
                <input {...register('identificacion')} className={ic} style={esEdicion ? isDisabled : is}
                  placeholder="Ej: 1046527082" disabled={esEdicion} />
              </Campo>
              <Campo label="Teléfono" error={errors.telefono}>
                <input {...register('telefono')} className={ic} style={is} placeholder="Ej: 3001234567" />
              </Campo>
              <Campo label="Contacto de emergencia" error={errors.contactoEmergencia}>
                <input {...register('contactoEmergencia')} className={ic} style={is}
                  placeholder="Nombre - Teléfono" />
              </Campo>
            </div>
          </div>

          {/* Sección datos académicos */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
              style={{ color: '#8a9bb0' }}>Datos académicos</p>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Programa" error={errors.programaId}>
                <select {...register('programaId')} className={ic} style={esEdicion ? isDisabled : is} disabled={esEdicion}>
                  <option value="">Seleccionar programa...</option>
                  {programas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Semestre actual" error={errors.semestre}>
                <input {...register('semestre')} type="number" min="1" max="12"
                  className={ic} style={is} />
              </Campo>
              <Campo label="Créditos aprobados" error={errors.creditosAprobados}>
                <input {...register('creditosAprobados')} type="number" min="0"
                  className={ic} style={is} />
              </Campo>
              <Campo label="Promedio acumulado" error={errors.promedioAcumulado}>
                <input {...register('promedioAcumulado')} type="number" step="0.01" min="0" max="5"
                  className={ic} style={is} />
              </Campo>
            </div>
            {esEdicion && (
              <p className="text-[10px] mt-2" style={{ color: '#8a9bb0' }}>
                Nombre, correo, identificación y programa no pueden modificarse desde aquí.
              </p>
            )}
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
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}