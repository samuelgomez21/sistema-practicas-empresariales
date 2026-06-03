import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'
import {
  School, BookOpen, Settings2, ClipboardList, Mail, Table,
} from 'lucide-react'
/**
 * Layout del módulo de configuración.
 * Muestra un submenú lateral con las secciones disponibles
 * según el rol del usuario autenticado.
 */

const SECCIONES_POR_ROL = {
  [ROLES.ADMINISTRADOR]: [
    { label: 'Facultades',         path: '/configuracion/facultades',   icon: School },
    { label: 'Programas',          path: '/configuracion/programas',    icon: BookOpen },
    { label: 'Parámetros',         path: '/configuracion/parametros',   icon: Settings2 },
    { label: 'Catálogo prácticas', path: '/configuracion/catalogo',     icon: ClipboardList },
    { label: 'Plantillas correo',  path: '/configuracion/plantillas',   icon: Mail },
    { label: 'Catálogos maestros', path: '/configuracion/catalogos',    icon: Table },
  ],
  [ROLES.COORDINACION_ACADEMICA]: [
    { label: 'Facultades',         path: '/configuracion/facultades',   icon: School },
    { label: 'Programas',          path: '/configuracion/programas',    icon: BookOpen },
    { label: 'Parámetros',         path: '/configuracion/parametros',   icon: Settings2 },
    { label: 'Catálogo prácticas', path: '/configuracion/catalogo',     icon: ClipboardList },
  ],
  [ROLES.COORDINADOR_PRACTICA]: [
    { label: 'Catálogo prácticas', path: '/configuracion/catalogo',     icon: ClipboardList },
    { label: 'Plantillas correo',  path: '/configuracion/plantillas',   icon: Mail },
    { label: 'Catálogos maestros', path: '/configuracion/catalogos',    icon: Table },
  ],
}

export default function ConfiguracionLayout() {
  const { user } = useAuthStore()
  const secciones = SECCIONES_POR_ROL[user?.rol] ?? []

  return (
    <div className="flex gap-5 h-full">

      {/* Submenú lateral */}
      <aside
        className="w-52 flex-shrink-0 bg-white rounded-xl p-3"
        style={{ border: '0.5px solid #e2e8f0', alignSelf: 'flex-start' }}
      >
        <p
          className="text-[9px] uppercase tracking-widest px-2 mb-2"
          style={{ color: '#8a9bb0' }}
        >
          Configuración
        </p>
        {secciones.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-0.5 transition-all ${
                isActive ? 'text-white' : ''
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? '#D91438' : 'transparent',
              color: isActive ? '#fff' : '#6b7a8d',
            })}
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </aside>

      {/* Contenido de la sección */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}