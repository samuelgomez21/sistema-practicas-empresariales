import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { toast } from 'sonner'
import { Mail, CheckCircle } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Correo inválido'),
})

export default function RecuperarPasswordPage() {
  const [enviado, setEnviado] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }) => {
    try {
      await authApi.solicitarRecuperacion(email)
      setEnviado(true)
    } catch {
      // Por seguridad, no revelamos si el correo existe o no
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f9fb' }}>
        <div className="bg-white rounded-xl p-8 max-w-sm text-center" style={{ border: '0.5px solid #e2e8f0' }}>
          <CheckCircle size={32} className="mx-auto mb-3" style={{ color: '#1a7a4a' }} />
          <h2 className="text-base font-bold mb-2" style={{ color: '#023859' }}>
            Revisa tu correo
          </h2>
          <p className="text-xs" style={{ color: '#6b7a8d' }}>
            Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
            El enlace expira en 1 hora.
          </p>
          <Link to="/login" className="text-xs font-semibold mt-4 inline-block" style={{ color: '#0B416B' }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f9fb' }}>
      <div className="bg-white rounded-xl p-8 max-w-sm w-full" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold mb-1" style={{ color: '#023859' }}>
          Recuperar contraseña
        </h2>
        <p className="text-xs mb-5" style={{ color: '#8a9bb0' }}>
          Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: '#023859' }}>
              Correo institucional
            </label>
            <input {...register('email')}
              type="email"
              placeholder="usuario@universidad.edu.co"
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#D91438' }}>{errors.email.message}</p>}
          </div>

          <button type="submit"
            className="h-10 rounded-lg text-sm font-bold text-white mt-2"
            style={{ background: '#D91438' }}>
            Enviar enlace de recuperación
          </button>

          <Link to="/login" className="text-xs text-center font-medium" style={{ color: '#0B416B' }}>
            Volver al inicio de sesión
          </Link>
        </form>
      </div>
    </div>
  )
}