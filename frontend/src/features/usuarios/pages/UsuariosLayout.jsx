import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'
import { Users, GraduationCap, BookOpen } from 'lucide-react'

/**
 * Layout del módulo de usuarios.
 * El submenú muestra solo las secciones permitidas por rol.
 * - Admin: Coordinadores + Estudiantes + Docentes
 * - Coord. Académica: Estudiantes + Docentes
 */

const SECCIONES = [
  { label: 'Coordinadores',   path: '/usuarios/coordinadores', icon: Users,              roles: [ROLES.ADMINISTRADOR] },
  { label: 'Estudiantes',     path: '/usuarios/estudiantes',   icon: GraduationCap,      roles: [ROLES.ADMINISTRADOR, ROLES.COORDINACION_ACADEMICA] },
  { label: 'Docentes asesores', path: '/usuarios/docentes',   icon: BookOpen,  roles: [ROLES.ADMINISTRADOR, ROLES.COORDINACION_ACADEMICA] },
]

export default function UsuariosLayout() {
  const { user } = useAuthStore()

  const seccionesVisibles = SECCIONES.filter(s => s.roles.includes(user?.rol))

  return (
    <div className="flex gap-5 h-full">
      <aside className="w-52 flex-shrink-0 bg-white rounded-xl p-3"
        style={{ border: '0.5px solid #e2e8f0', alignSelf: 'flex-start' }}>
        <p className="text-[9px] uppercase tracking-widest px-2 mb-2" style={{ color: '#8a9bb0' }}>
          Usuarios
        </p>
        {seccionesVisibles.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-all`
            }
            style={({ isActive }) => ({
              background: isActive ? '#D91438' : 'transparent',
              color: isActive ? '#fff' : '#6b7a8d',
            })}>
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </aside>

      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}