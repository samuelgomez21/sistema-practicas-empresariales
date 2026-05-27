import { Bell, Settings, Menu, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLocation } from 'react-router-dom'

/**
 * Header principal del layout.
 * Muestra título de la página, fecha, notificaciones y avatar del usuario.
 */

// Mapeo ruta → título legible
const TITULOS = {
  '/dashboard/admin':                  'Dashboard',
  '/dashboard/coordinacion-academica': 'Dashboard',
  '/dashboard/coordinador-practica':   'Dashboard',
  '/dashboard/secretaria':             'Dashboard',
  '/dashboard/docente':                'Dashboard',
  '/dashboard/empresa':                'Dashboard',
  '/dashboard/tutor':                  'Dashboard',
  '/dashboard/estudiante':             'Dashboard',
  '/dashboard/direccion':              'Dashboard',
  '/admin/usuarios':         'Gestión de usuarios',
  '/admin/facultades':       'Facultades',
  '/admin/programas':        'Programas académicos',
  '/admin/plantillas':       'Plantillas de correo',
  '/admin/catalogos':        'Catálogos',
  '/admin/bitacora':         'Bitácora de auditoría',
  '/academica/estudiantes':  'Estudiantes',
  '/academica/docentes':     'Docentes asesores',
  '/academica/catalogo':     'Catálogo de prácticas',
  '/academica/aptitud':      'Validar aptitud',
  '/practica/empresas':      'Empresas vinculadas',
  '/practica/vacantes':      'Vacantes',
  '/practica/estudiantes':   'Estudiantes',
  '/practica/asignaciones':  'Asignaciones',
  '/practica/activas':       'Prácticas activas',
  '/practica/reportes':      'Reportes',
}

function fechaActual() {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Header({ onToggleSidebar }) {
  const { user } = useAuthStore()
  const { pathname } = useLocation()

  const titulo = TITULOS[pathname] ?? 'Sistema de Prácticas'

  const iniciales = user?.nombre
    ? user.nombre.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?'

  return (
    <header
      className="flex items-center justify-between px-6"
      style={{
        height: 56,
        background: '#fff',
        borderBottom: '0.5px solid #e2e8f0',
        flexShrink: 0,
      }}
    >
      {/* Izquierda */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: '#6b7a8d' }}
          title="Colapsar menú"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-[15px] font-bold leading-tight" style={{ color: '#023859' }}>
            {titulo}
          </h1>
          <p className="text-[11px] capitalize" style={{ color: '#8a9bb0' }}>
            {fechaActual()}
          </p>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-2">
        {/* Notificaciones */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ border: '0.5px solid #e2e8f0', color: '#6b7a8d' }}
          title="Notificaciones"
        >
          <Bell size={17} />
          {/* Punto rojo de notificación pendiente */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#D91438', border: '1.5px solid #fff' }}
          />
        </button>

        {/* Configuración */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ border: '0.5px solid #e2e8f0', color: '#6b7a8d' }}
          title="Configuración"
        >
          <Settings size={17} />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer ml-1"
          style={{ background: '#0B416B', color: '#fff' }}
          title={user?.nombre}
        >
          {iniciales}
        </div>
      </div>
    </header>
  )
}