import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { rolesApi, etiquetaRol } from '../api/rolesApi'
import { usuariosApi } from '../api/usuariosApi'

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email:  z.string().email('Correo inválido'),
  rol:    z.string().min(1, 'Selecciona un rol'),
  activo: z.boolean().optional(),
})


export default function ModalUsuario({ usuario, onClose, onGuardado }) {
  const esEdicion = !!usuario
  const { data: roles = [], isLoading: cargandoRoles } = useQuery({
    queryKey: ['roles-disponibles'],
    queryFn:  rolesApi.getRoles,
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: usuario
      ? { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
      : { nombre: '', email: '', rol: '' },
  })

  const mutation = useMutation({
    mutationFn: (data) => esEdicion
      ? usuariosApi.actualizarUsuario(usuario.id, data)
      : usuariosApi.crearUsuario(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente')
      onGuardado()
    },
    onError: () => toast.error('Error al guardar el usuario'),
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
            {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
          </p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-3">

          <div>
            <label className={lc} style={ls}>Nombre completo</label>
            <input {...register('nombre')} className={ic} style={is} placeholder="Ej: Dr. Juan Pérez" />
            {errors.nombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.nombre.message}</p>}
          </div>

          <div>
            <label className={lc} style={ls}>Correo institucional</label>
            <input {...register('email')} type="email" className={ic} style={is}
              placeholder="usuario@universidad.edu.co" />
            {errors.email && <p className="text-xs" style={{ color: '#D91438' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={lc} style={ls}>Rol</label>
            <select {...register('rol')} className={ic} style={is} disabled={cargandoRoles}>
              <option value="">
                {cargandoRoles ? 'Cargando roles...' : 'Seleccionar rol...'}
              </option>
              {roles.map(r => (
                <option key={r.id} value={r.nombre}>{etiquetaRol(r.nombre)}</option>
              ))}
            </select>
            {errors.rol && <p className="text-xs" style={{ color: '#D91438' }}>{errors.rol.message}</p>}
          </div>

          {!esEdicion && (
            <div className="p-2.5 rounded-lg text-[10px]"
              style={{ background: '#e6f0fb', color: '#0B416B' }}>
              El usuario recibirá una contraseña temporal y deberá cambiarla en su primer inicio de sesión.
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}