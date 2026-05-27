import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { MENU_POR_ROL } from '@/lib/roles'
import logoUAH from '@/assets/images/logo-uah.png'

/**
 * Sidebar institucional UAH.
 * Construye el menú dinámicamente según el rol del usuario autenticado.
 */
export default function Sidebar({ collapsed = false }) {
  const navigate  = useNavigate()
  const { user, logout } = useAuthStore()
  const menu = MENU_POR_ROL[user?.rol] ?? []

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Iniciales del usuario para el avatar
  const iniciales = user?.nombre
    ? user.nombre.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?'

  return (
    <aside
      className="flex flex-col h-screen"
      style={{
        width: collapsed ? 64 : 240,
        background: '#023859',
        transition: 'width 0.2s ease',
        flexShrink: 0,
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        <div className="bg-white rounded-lg p-1.5 flex-shrink-0">
          <img src={logoUAH} alt="UAH" className="h-7 object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-[11px] font-bold truncate leading-tight">
              Gestión de Prácticas
            </p>
            <p style={{ color: '#4a7a9b' }} className="text-[9px]">v1.0</p>
          </div>
        )}
      </div>

      {/* ── Rol activo ────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="px-4 py-3" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#4a7a9b' }} className="text-[9px] uppercase tracking-widest mb-1">
            Rol activo
          </p>
          <p className="text-white text-[11px] font-semibold truncate">
            {user?.rol?.replace(/_/g, ' ')}
          </p>
        </div>
      )}

      {/* ── Menú ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {menu.map((grupo) => (
          <div key={grupo.section} className="mb-4">
            {!collapsed && (
              <p
                style={{ color: '#4a7a9b' }}
                className="text-[9px] uppercase tracking-widest px-2 mb-1"
              >
                {grupo.section}
              </p>
            )}
            {grupo.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-[12px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? '#D91438' : 'transparent',
                  color: isActive ? '#fff' : '#a8c8e0',
                })}
                title={collapsed ? item.label : undefined}
              >
                {/* Ícono usando Tabler via clase CSS */}
                <i
                  className={`ti ti-${item.icon}`}
                  style={{ fontSize: 17, flexShrink: 0 }}
                  aria-hidden="true"
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Usuario y logout ──────────────────────────────────────── */}
      <div
        className="px-2 py-3"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer group"
            style={{ color: '#a8c8e0' }}
            onClick={handleLogout}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{ background: '#0B416B', color: '#fff' }}
            >
              {iniciales}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">
                {user?.nombre ?? 'Usuario'}
              </p>
              <p style={{ color: '#4a7a9b' }} className="text-[9px] truncate">
                {user?.correo ?? ''}
              </p>
            </div>
            <LogOut size={14} className="flex-shrink-0 group-hover:text-red-400" />
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 rounded-lg"
            style={{ color: '#a8c8e0' }}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  )
}