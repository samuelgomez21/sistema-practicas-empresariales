import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import logoUAH from '@/assets/images/logo-uah.png'

// ── Schemas de validación por paso ────────────────────────────────────────
const schemaCorreo = z.object({
  correo: z.string().min(1, 'El correo es obligatorio').email('Correo inválido'),
})

const schemaCodigo = z.object({
  codigo: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
})

const schemaPassword = z
  .object({
    passwordNueva: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirmar: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((d) => d.passwordNueva === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  })

// ── Indicador de pasos ────────────────────────────────────────────────────
function StepIndicator({ paso }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="h-1 w-7 rounded-full transition-all duration-300"
          style={{
            background:
              n < paso ? '#0B416B' : n === paso ? '#D91438' : '#dce4ec',
          }}
        />
      ))}
    </div>
  )
}

// ── Campo de input reutilizable ───────────────────────────────────────────
function Campo({ label, icono: Icono, error, children }) {
  return (
    <div className="flex flex-col gap-[6px] mb-4">
      <label
        className="text-[10px] font-bold uppercase tracking-wide"
        style={{ color: '#023859' }}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <Icono size={16} className="absolute left-3 text-gray-400" />
        {children}
      </div>
      {error && (
        <p className="text-xs" style={{ color: '#D91438' }}>
          {error.message}
        </p>
      )}
    </div>
  )
}

// ── Paso 1: Solicitar código ───────────────────────────────────────────────
function PasoCorreo({ onSiguiente }) {
  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schemaCorreo) })

  const mutation = useMutation({
    mutationFn: ({ correo }) => authApi.solicitarCodigo(correo),
    onSuccess: (_, { correo }) => {
      toast.success('Código enviado a tu correo')
      onSiguiente(correo)
    },
    onError: (err) => {
      toast.error(err.response?.data?.mensaje ?? 'No se pudo enviar el código')
    },
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
      {/* Ícono */}
      <div
        className="w-13 h-13 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: '#e6eef7', width: 52, height: 52 }}
      >
        <Mail size={24} style={{ color: '#0B416B' }} />
      </div>

      <h3
        className="text-[17px] font-bold text-center mb-2"
        style={{ color: '#023859' }}
      >
        Recuperar contraseña
      </h3>
      <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
        Ingresa tu correo institucional y te enviaremos
        un código para restablecer tu contraseña.
      </p>

      <Campo label="Correo electrónico" icono={Mail} error={errors.correo}>
        <input
          {...register('correo')}
          type="email"
          placeholder="usuario@uah.edu.co"
          className="w-full h-11 pl-10 pr-4 rounded-lg text-sm outline-none"
          style={{
            border: errors.correo ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
            background: '#f7f9fb',
            color: '#023859',
          }}
        />
      </Campo>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-11 rounded-lg text-white text-sm font-bold uppercase tracking-wide mb-3"
        style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}
      >
        {mutation.isPending ? 'Enviando...' : 'Enviar código'}
      </button>
    </form>
  )
}

// ── Paso 2: Verificar código ───────────────────────────────────────────────
function PasoCodigo({ correo, onSiguiente, onReenviar }) {
  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schemaCodigo) })

  const mutation = useMutation({
    mutationFn: (data) => authApi.verificarCodigo({ correo, ...data }),
    onSuccess: (_, { codigo }) => {
      toast.success('Código verificado correctamente')
      onSiguiente(codigo)
    },
    onError: (err) => {
      toast.error(err.response?.data?.mensaje ?? 'Código incorrecto o expirado')
    },
  })

  const reenviarMutation = useMutation({
    mutationFn: () => authApi.solicitarCodigo(correo),
    onSuccess: () => toast.success('Código reenviado'),
    onError: () => toast.error('No se pudo reenviar el código'),
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
      <div
        className="rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: '#fff8e6', width: 52, height: 52 }}
      >
        <Hash size={24} style={{ color: '#a07010' }} />
      </div>

      <h3
        className="text-[17px] font-bold text-center mb-2"
        style={{ color: '#023859' }}
      >
        Ingresa el código
      </h3>
      <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
        Enviamos un código de 6 dígitos a{' '}
        <strong style={{ color: '#023859' }}>{correo}</strong>
      </p>

      <Campo label="Código de verificación" icono={Hash} error={errors.codigo}>
        <input
          {...register('codigo')}
          type="text"
          maxLength={6}
          placeholder="000000"
          className="w-full h-11 pl-10 pr-4 rounded-lg text-sm outline-none text-center font-bold tracking-[6px]"
          style={{
            border: errors.codigo ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
            background: '#f7f9fb',
            color: '#023859',
            fontSize: 20,
          }}
        />
      </Campo>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-11 rounded-lg text-white text-sm font-bold uppercase tracking-wide mb-3"
        style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}
      >
        {mutation.isPending ? 'Verificando...' : 'Verificar código'}
      </button>

      <button
        type="button"
        disabled={reenviarMutation.isPending}
        onClick={() => reenviarMutation.mutate()}
        className="w-full h-11 rounded-lg text-sm font-semibold"
        style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}
      >
        {reenviarMutation.isPending ? 'Reenviando...' : 'Reenviar código'}
      </button>
    </form>
  )
}

// ── Paso 3: Nueva contraseña ───────────────────────────────────────────────
function PasoNuevaPassword({ correo, codigo, onExito }) {
  const [verNueva, setVerNueva] = useState(false)
  const [verConf, setVerConf]   = useState(false)

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schemaPassword) })

  const mutation = useMutation({
    mutationFn: (data) =>
      authApi.restablecerPassword({ correo, codigo, ...data }),
    onSuccess: () => {
      toast.success('Contraseña restablecida correctamente')
      onExito()
    },
    onError: (err) => {
      toast.error(err.response?.data?.mensaje ?? 'Error al restablecer la contraseña')
    },
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
      <div
        className="rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: '#eaf7f0', width: 52, height: 52 }}
      >
        <Lock size={24} style={{ color: '#1a7a4a' }} />
      </div>

      <h3
        className="text-[17px] font-bold text-center mb-2"
        style={{ color: '#023859' }}
      >
        Nueva contraseña
      </h3>
      <p className="text-xs text-gray-400 text-center leading-relaxed mb-6">
        Crea una contraseña segura para tu cuenta institucional.
      </p>

      {/* Nueva contraseña */}
      <div className="flex flex-col gap-[6px] mb-4">
        <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
          Nueva contraseña
        </label>
        <div className="relative flex items-center">
          <Lock size={16} className="absolute left-3 text-gray-400" />
          <input
            {...register('passwordNueva')}
            type={verNueva ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-11 pl-10 pr-11 rounded-lg text-sm outline-none"
            style={{
              border: errors.passwordNueva ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
              background: '#f7f9fb',
              color: '#023859',
            }}
          />
          <button type="button" onClick={() => setVerNueva(!verNueva)}
            className="absolute right-3 text-gray-400 hover:text-gray-600">
            {verNueva ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.passwordNueva && (
          <p className="text-xs" style={{ color: '#D91438' }}>{errors.passwordNueva.message}</p>
        )}
      </div>

      {/* Confirmar */}
      <div className="flex flex-col gap-[6px] mb-4">
        <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
          Confirmar contraseña
        </label>
        <div className="relative flex items-center">
          <Lock size={16} className="absolute left-3 text-gray-400" />
          <input
            {...register('confirmar')}
            type={verConf ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-11 pl-10 pr-11 rounded-lg text-sm outline-none"
            style={{
              border: errors.confirmar ? '1.5px solid #D91438' : '1.5px solid #dce4ec',
              background: '#f7f9fb',
              color: '#023859',
            }}
          />
          <button type="button" onClick={() => setVerConf(!verConf)}
            className="absolute right-3 text-gray-400 hover:text-gray-600">
            {verConf ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmar && (
          <p className="text-xs" style={{ color: '#D91438' }}>{errors.confirmar.message}</p>
        )}
      </div>

      {/* Requisitos */}
      <ul className="text-[11px] text-gray-400 flex flex-col gap-1 pl-1 mb-5">
        <li>· Mínimo 8 caracteres</li>
        <li>· Al menos una letra mayúscula</li>
        <li>· Al menos un número</li>
      </ul>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-11 rounded-lg text-white text-sm font-bold uppercase tracking-wide"
        style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}
      >
        {mutation.isPending ? 'Guardando...' : 'Restablecer contraseña'}
      </button>
    </form>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
export default function RecuperarPasswordPage() {
  const navigate       = useNavigate()
  const [paso, setPaso] = useState(1)
  const [correo, setCorreo] = useState('')
  const [codigo, setCodigo] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#f4f6f9' }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logoUAH} alt="Logo UAH" className="h-12 object-contain" />
        </div>

        {/* Indicador de pasos */}
        <StepIndicator paso={paso} />

        {/* Contenido del paso activo */}
        {paso === 1 && (
          <PasoCorreo
            onSiguiente={(c) => { setCorreo(c); setPaso(2) }}
          />
        )}
        {paso === 2 && (
          <PasoCodigo
            correo={correo}
            onSiguiente={(c) => { setCodigo(c); setPaso(3) }}
            onReenviar={() => {}}
          />
        )}
        {paso === 3 && (
          <PasoNuevaPassword
            correo={correo}
            codigo={codigo}
            onExito={() => navigate('/login', { replace: true })}
          />
        )}

        {/* Volver al login — visible en pasos 1 y 2 */}
        {paso < 3 && (
          <button
            onClick={() => paso === 1 ? navigate('/login') : setPaso(paso - 1)}
            className="w-full h-11 rounded-lg text-sm font-semibold mt-3"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}
          >
            {paso === 1 ? 'Volver al inicio de sesión' : 'Volver al paso anterior'}
          </button>
        )}

        {/* Soporte — solo paso 1 */}
        {paso === 1 && (
          <p className="mt-4 text-[11px] text-gray-400 text-center">
            ¿No tienes acceso a tu correo?{' '}
            <a href="mailto:soporte@uah.edu.co"
              className="font-medium" style={{ color: '#0B416B' }}>
              Contacta soporte
            </a>
          </p>
        )}
      </div>
    </div>
  )
}