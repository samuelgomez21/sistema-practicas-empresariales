import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'

const schema = z.object({
  nombre:    z.string().min(3, 'Mínimo 3 caracteres'),
  cargo:     z.string().min(2, 'Ingresa el cargo'),
  telefono:  z.string().min(7, 'Teléfono inválido'),
  correo:    z.string().email('Correo inválido'),
  empresaId: z.coerce.number().min(1, 'Selecciona una empresa'),
})

export default function ModalTutor({ tutor, empresas, empresaIdFijo, onClose, onGuardado }) {
  const esEdicion = !!tutor

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: tutor
      ? { ...tutor, empresaId: tutor.empresaId }
      : { empresaId: empresaIdFijo ? Number(empresaIdFijo) : '' },
  })

  const mutation = useMutation({
    mutationFn: (data) =>
      esEdicion
        ? empresasApi.editarTutor(tutor.id, data)
        : empresasApi.crearTutor(data.empresaId, data),
    onSuccess: onGuardado,
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Error al guardar'
      toast.error(msg)
    },
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const isDisabled = { border: '1.5px solid #e2e8f0', background: '#f0f2f5', color: '#8a9bb0' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  // Si hay empresaIdFijo, el campo va oculto pero registrado para que
  // el formulario lo incluya en la validación y el submit.
  const mostrarSelectorEmpresa = !empresaIdFijo

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {esEdicion ? 'Editar tutor' : 'Nuevo tutor empresarial'}
          </p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">

          {mostrarSelectorEmpresa ? (
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Empresa</label>
              <select {...register('empresaId')} className={ic} style={esEdicion ? isDisabled : is} disabled={esEdicion}>
                <option value="">Seleccionar empresa...</option>
                {empresas.map(e => <option key={e.id} value={e.id}>{e.razonSocial}</option>)}
              </select>
              {errors.empresaId && <p className="text-xs" style={{ color: '#D91438' }}>{errors.empresaId.message}</p>}
            </div>
          ) : (
            <input type="hidden" {...register('empresaId')} />
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className={lc} style={ls}>Nombre completo</label>
              <input {...register('nombre')} className={ic} style={is} placeholder="Nombre del tutor" />
              {errors.nombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.nombre.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Cargo</label>
              <input {...register('cargo')} className={ic} style={is} placeholder="Ej: Jefe de TI" />
              {errors.cargo && <p className="text-xs" style={{ color: '#D91438' }}>{errors.cargo.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={lc} style={ls}>Teléfono</label>
              <input {...register('telefono')} className={ic} style={is} placeholder="3001234567" />
              {errors.telefono && <p className="text-xs" style={{ color: '#D91438' }}>{errors.telefono.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className={lc} style={ls}>Correo electrónico</label>
              <input {...register('correo')} className={ic} style={esEdicion ? isDisabled : is}
                placeholder="tutor@empresa.com" disabled={esEdicion} />
              {errors.correo && <p className="text-xs" style={{ color: '#D91438' }}>{errors.correo.message}</p>}
              {esEdicion && (
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  El correo no puede modificarse una vez creado el tutor.
                </p>
              )}
            </div>
          </div>

          {!esEdicion && (
            <div className="p-2.5 rounded-lg text-[10px]"
              style={{ background: '#e6f0fb', color: '#0B416B' }}>
              El tutor recibirá una contraseña temporal por correo y deberá cambiarla en su primer inicio de sesión.
            </div>
          )}

          <div className="flex gap-2 justify-end">
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