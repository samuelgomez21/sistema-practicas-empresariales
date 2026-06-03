import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'

const schema = z.object({
  razonSocial:     z.string().min(3, 'Mínimo 3 caracteres'),
  nit:             z.string().min(5, 'NIT inválido'),
  sectorEconomico: z.string().min(1, 'Selecciona un sector'),
  direccion:       z.string().min(5, 'Ingresa la dirección'),
  municipio:       z.string().min(3, 'Ingresa el municipio'),
  telefono:        z.string().min(7, 'Teléfono inválido'),
  nombreContacto:  z.string().min(3, 'Ingresa el nombre del contacto'),
  emailContacto:   z.string().email('Correo inválido'),
  correoAcceso:    z.string().email('Correo de acceso inválido'),
})

const SECTORES = [
  'Tecnología', 'Finanzas', 'Turismo', 'Comercio', 'Manufactura',
  'Salud', 'Educación', 'Construcción', 'Agropecuario', 'Servicios',
]

export default function ModalNuevaEmpresa({ onClose, onGuardado }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: empresasApi.crearEmpresaPerfil,
    onSuccess: () => {
      toast.success('Empresa creada. Se enviaron credenciales temporales al correo de acceso.')
      onGuardado()
    },
    onError: () => toast.error('Error al crear la empresa'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  const Campo = ({ name, label, error, children }) => (
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
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Nueva empresa</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              Se crearán credenciales temporales para el correo de acceso
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
              style={{ color: '#8a9bb0' }}>Información general</p>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Razón social" error={errors.razonSocial}>
                <input {...register('razonSocial')} className={ic} style={is}
                  placeholder="Nombre legal de la empresa" />
              </Campo>
              <Campo label="NIT" error={errors.nit}>
                <input {...register('nit')} className={ic} style={is}
                  placeholder="Ej: 890.903.938-8" />
              </Campo>
              <Campo label="Sector económico" error={errors.sectorEconomico}>
                <select {...register('sectorEconomico')} className={ic} style={is}>
                  <option value="">Seleccionar...</option>
                  {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Campo>
              <Campo label="Teléfono" error={errors.telefono}>
                <input {...register('telefono')} className={ic} style={is}
                  placeholder="Ej: (606) 555-0101" />
              </Campo>
              <Campo label="Dirección" error={errors.direccion}>
                <input {...register('direccion')} className={ic} style={is}
                  placeholder="Dirección de la empresa" />
              </Campo>
              <Campo label="Municipio" error={errors.municipio}>
                <input {...register('municipio')} className={ic} style={is}
                  placeholder="Ej: Armenia" />
              </Campo>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
              style={{ color: '#8a9bb0' }}>Contacto y acceso</p>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Nombre del contacto principal" error={errors.nombreContacto}>
                <input {...register('nombreContacto')} className={ic} style={is}
                  placeholder="Nombre completo" />
              </Campo>
              <Campo label="Email del contacto" error={errors.emailContacto}>
                <input {...register('emailContacto')} className={ic} style={is}
                  placeholder="contacto@empresa.com" />
              </Campo>
              <div className="col-span-2">
                <Campo label="Correo de acceso al sistema" error={errors.correoAcceso}>
                  <input {...register('correoAcceso')} className={ic} style={is}
                    placeholder="correo para ingresar al portal" />
                </Campo>
                <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                  A este correo se enviarán las credenciales temporales de acceso
                </p>
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
              {mutation.isPending ? 'Creando...' : 'Crear empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}