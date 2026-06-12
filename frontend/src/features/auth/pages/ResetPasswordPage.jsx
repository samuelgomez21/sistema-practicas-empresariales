import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'

const schema = z.object({
  newPassword:     z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token    = searchParams.get('token')
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ newPassword }) => {
    try {
      await authApi.resetearPassword({ token, newPassword })
      toast.success('Contraseña actualizada correctamente')
      navigate('/login')
    } catch (error) {
      toast.error('El enlace expiró o no es válido. Solicita uno nuevo.')
    }
  }

  // Si no hay token en la URL, no tiene sentido mostrar el formulario
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f9fb' }}>
        <div className="bg-white rounded-xl p-8 max-w-sm text-center" style={{ border: '0.5px solid #e2e8f0' }}>
          <AlertCircle size={32} className="mx-auto mb-3" style={{ color: '#c0392b' }} />
          <h2 className="text-base font-bold mb-2" style={{ color: '#023859' }}>
            Enlace inválido
          </h2>
          <p className="text-xs" style={{ color: '#6b7a8d' }}>
            Este enlace no es válido o ya expiró.
          </p>
          <Link to="/recuperar-password" className="text-xs font-semibold mt-4 inline-block" style={{ color: '#0B416B' }}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f9fb' }}>
      <div className="bg-white rounded-xl p-8 max-w-sm w-full" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold mb-1" style={{ color: '#023859' }}>
          Nueva contraseña
        </h2>
        <p className="text-xs mb-5" style={{ color: '#8a9bb0' }}>
          Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: '#023859' }}>
              Nueva contraseña
            </label>
            <input {...register('newPassword')} type="password"
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
            {errors.newPassword && <p className="text-xs mt-1" style={{ color: '#D91438' }}>{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: '#023859' }}>
              Confirmar contraseña
            </label>
            <input {...register('confirmPassword')} type="password"
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
            {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#D91438' }}>{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit"
            className="h-10 rounded-lg text-sm font-bold text-white mt-2"
            style={{ background: '#D91438' }}>
            Restablecer contraseña
          </button>
        </form>
      </div>
    </div>
  )
}