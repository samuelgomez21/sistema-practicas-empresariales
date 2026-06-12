import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import logoUAH from '@/assets/images/logo-uah.png'

// ── Validación del formulario ──────────────────────────────────────────────
const loginSchema = z.object({
  correo: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria'),
})

export default function LoginPage() {
  const [verPass, setVerPass] = useState(false)
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()
  const login    = useAuthStore(s => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (formData) => {
    setCargando(true)
    try {
      await login(formData.correo, formData.password)
      // RootRedirect se encarga de mandar al dashboard correcto
      navigate('/')
    } catch (error) {
      if (error.code === 'DEBE_CAMBIAR_PASSWORD') {
        navigate('/cambiar-password', {
          state: { email: error.email, currentPassword: error.currentPassword },
        })
        return
      }
      toast.error('Credenciales inválidas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-lg border border-gray-100">

        {/* ── Panel izquierdo ─────────────────────────────────────── */}
        <div className="hidden md:flex w-[44%] flex-col items-center justify-between py-12 px-9"
          style={{ background: '#0B416B' }}>

          {/* Logo */}
          <div className="w-full bg-white rounded-xl p-5 flex justify-center">
            <img
              src={logoUAH}
              alt="Logo Universidad Alexander Von Humboldt"
              className="h-16 object-contain"
            />
          </div>

          {/* Acento y título */}
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-9 h-[3px] rounded-full" style={{ background: '#D91438' }} />
            <h2 className="text-white text-[17px] font-semibold leading-snug">
              Sistema de Gestión de<br />Prácticas Empresariales
            </h2>
            <p style={{ color: '#7aaac9' }} className="text-xs leading-relaxed">
              Plataforma institucional para la administración<br />
              del ciclo completo de prácticas duales
            </p>
          </div>

          {/* Programas en texto */}
          <div className="flex flex-col gap-[6px] w-full text-center">
            {[
              'Ingeniería de Software',
              'Ingeniería Industrial',
              'Administración de Empresas',
              'Turismo',
            ].map((p) => (
              <p key={p} style={{ color: '#a8c8e0' }} className="text-xs font-medium">
                {p}
              </p>
            ))}
          </div>

          {/* Footer */}
          <p style={{ color: '#4a7a9b' }} className="text-[10px] text-center leading-relaxed">
            © 2025 Universidad Alexander Von Humboldt<br />
            Todos los derechos reservados
          </p>
        </div>

        {/* ── Panel derecho — formulario ───────────────────────────── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12">

          <div className="mb-9">
            <h3 className="text-[22px] font-bold mb-1" style={{ color: '#023859' }}>
              Iniciar sesión
            </h3>
            <p className="text-sm text-gray-500">
              Ingresa con tus credenciales institucionales
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Correo */}
            <div className="flex flex-col gap-[7px]">
              <label className="text-[11px] font-semibold tracking-wide uppercase"
                style={{ color: '#023859' }}>
                Correo electrónico
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-gray-400" />
                <input
                  {...register('correo')}
                  type="email"
                  placeholder="usuario@uah.edu.co"
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: errors.correo ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
                    background: '#f7f9fb',
                    color: '#023859',
                  }}
                />
              </div>
              {errors.correo && (
                <p className="text-xs" style={{ color: '#D91438' }}>
                  {errors.correo.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-[7px]">
              <label className="text-[11px] font-semibold tracking-wide uppercase"
                style={{ color: '#023859' }}>
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-gray-400" />
                <input
                  {...register('password')}
                  type={verPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: errors.password ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
                    background: '#f7f9fb',
                    color: '#023859',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setVerPass(!verPass)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  {verPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: '#D91438' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ¿Olvidaste tu contraseña? */}
            <div className="text-right -mt-2">
              <button
                type="button"
                className="text-xs font-medium hover:underline"
                style={{ color: '#0B416B' }}
                onClick={() => navigate('/recuperar-password')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full h-11 rounded-lg text-white text-sm font-bold uppercase tracking-wide transition-all"
              style={{ background: cargando ? '#a0aab4' : '#D91438' }}
            >
              {cargando ? 'Verificando...' : 'Ingresar al sistema'}
            </button>

          </form>

          {/* Soporte */}
          <p className="mt-8 text-[11px] text-gray-400 text-center border-t border-gray-100 pt-5">
            ¿Tienes problemas para acceder?{' '}
            <a href="mailto:soporte@uah.edu.co"
              className="font-medium"
              style={{ color: '#0B416B' }}>
              Contacta soporte institucional
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}