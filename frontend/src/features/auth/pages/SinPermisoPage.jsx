import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { DASHBOARD_POR_ROL } from '@/lib/roles'

export default function SinPermisoPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#f4f6f9' }}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow p-12
        flex flex-col items-center gap-4 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#fef0f0' }}>
          <ShieldOff size={30} style={{ color: '#D91438' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: '#023859' }}>
          Sin permiso
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          No tienes acceso a esta sección.<br />
          Contacta al administrador si crees que es un error.
        </p>
        <button
          onClick={() => navigate(DASHBOARD_POR_ROL[user?.rol] ?? '/login')}
          className="mt-2 h-11 px-8 rounded-lg text-white text-sm font-bold uppercase tracking-wide"
          style={{ background: '#D91438' }}
        >
          Volver a mi panel
        </button>
      </div>
    </div>
  )
}