import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import logoUAH from '@/assets/images/logo-uah.png'
import { useLocation, useNavigate } from 'react-router-dom'

const schema = z
  .object({
    passwordActual: z.string().min(1, 'Ingresa tu contraseña temporal'),
    passwordNueva: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmar: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((d) => d.passwordNueva === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  })

export default function CambiarPasswordPage() {
  const navigate = useNavigate()
  const location  = useLocation()
  const [ver, setVer] = useState({ actual: false, nueva: false, conf: false })

  const email = location.state?.email

  const toggle = (campo) => setVer((v) => ({ ...v, [campo]: !v[campo] }))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (formData) => authApi.cambiarPasswordInicial({
      email,
      currentPassword: formData.passwordActual,
      newPassword: formData.passwordNueva,
    }),
    onSuccess: () => {
      toast.success('Contraseña actualizada. Inicia sesión nuevamente.')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      const msg = error.response?.data?.message ?? 'Error al cambiar la contraseña'
      toast.error(msg)
    },
  })

  const onSubmit = (formData) => {
    if (!email) {
      toast.error('Sesión inválida. Inicia el proceso de login de nuevo.')
      navigate('/login', { replace: true })
      return
    }
    mutation.mutate(formData)
  }

  // Campo de contraseña reutilizable
  const PasswordField = ({ id, label, campo, error }) => (
    <div className="flex flex-col gap-[7px]">
      <label className="text-[11px] font-semibold tracking-wide uppercase"
        style={{ color: '#023859' }}>
        {label}
      </label>
      <div className="relative flex items-center">
        <Lock size={16} className="absolute left-3 text-gray-400" />
        <input
          {...register(id)}
          type={ver[campo] ? 'text' : 'password'}
          className="w-full h-11 pl-10 pr-11 rounded-lg text-sm outline-none"
          style={{
            border: error ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
            background: '#f7f9fb',
            color: '#023859',
          }}
        />
        <button type="button" onClick={() => toggle(campo)}
          className="absolute right-3 text-gray-400 hover:text-gray-600">
          {ver[campo] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs" style={{ color: '#D91438' }}>{error.message}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-10">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoUAH} alt="Logo UAH" className="h-14 object-contain" />
        </div>

        {/* Ícono y título */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#E6EEFF' }}>
            <ShieldCheck size={26} style={{ color: '#0B416B' }} />
          </div>
          <h3 className="text-xl font-bold text-center" style={{ color: '#023859' }}>
            Cambio de contraseña obligatorio
          </h3>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            Es tu primer ingreso. Por seguridad debes<br />
            establecer una nueva contraseña.
          </p>
          {email && (
            <p className="text-xs font-medium" style={{ color: '#0B416B' }}>
              {email}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <PasswordField
            id="passwordActual"
            label="Contraseña temporal"
            campo="actual"
            error={errors.passwordActual}
          />
          <PasswordField
            id="passwordNueva"
            label="Nueva contraseña"
            campo="nueva"
            error={errors.passwordNueva}
          />
          <PasswordField
            id="confirmar"
            label="Confirmar nueva contraseña"
            campo="conf"
            error={errors.confirmar}
          />

          {/* Requisitos */}
          <ul className="text-[11px] text-gray-400 flex flex-col gap-1 pl-1">
            <li>· Mínimo 8 caracteres</li>
            <li>· Al menos una letra mayúscula</li>
            <li>· Al menos un número</li>
          </ul>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-11 rounded-lg text-white text-sm font-bold uppercase tracking-wide mt-1"
            style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}
          >
            {mutation.isPending ? 'Guardando...' : 'Establecer contraseña'}
          </button>
        </form>

      </div>
    </div>
  )
}