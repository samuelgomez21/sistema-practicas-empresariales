import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'
import { Building, FileCheck, MapPin, BadgeCheck, Users, UserCheck } from 'lucide-react'

const SECCIONES_ADMIN = [
  { label: 'Todas las empresas',  path: '/empresas/listado',   icon: Building   },
  { label: 'Validar documentos',  path: '/empresas/validar',   icon: FileCheck  },
  { label: 'Visitas realizadas',  path: '/empresas/visitas',   icon: MapPin     },
]

const SECCIONES_EMPRESA = [
  { label: 'Mi perfil',           path: '/empresas/mi-perfil',      icon: BadgeCheck },
  { label: 'Mis practicantes',    path: '/empresas/practicantes',   icon: Users      },
  { label: 'Tutores',             path: '/empresas/tutores',        icon: UserCheck  },
]

const ROLES_ADMIN = [
  ROLES.ADMINISTRADOR,
  ROLES.COORDINADOR_PRACTICA,
  ROLES.SECRETARIA,
]

export default function EmpresasLayout() {
  const { user } = useAuthStore()
  const esEmpresa = user?.rol === ROLES.EMPRESA

  const secciones = esEmpresa ? SECCIONES_EMPRESA : SECCIONES_ADMIN

  return (
    <div className="flex gap-5 h-full">
      <aside className="w-52 flex-shrink-0 bg-white rounded-xl p-3"
        style={{ border: '0.5px solid #e2e8f0', alignSelf: 'flex-start' }}>
        <p className="text-[9px] uppercase tracking-widest px-2 mb-2" style={{ color: '#8a9bb0' }}>
          {esEmpresa ? 'Mi portal' : 'Empresas'}
        </p>
        {secciones.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-all"
            style={({ isActive }) => ({
              background: isActive ? '#D91438' : 'transparent',
              color:      isActive ? '#fff'    : '#6b7a8d',
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