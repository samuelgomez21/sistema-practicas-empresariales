import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * Protege rutas según autenticación y rol.
 *
 * Uso sin restricción de rol:
 *   <ProtectedRoute><MiPagina /></ProtectedRoute>
 *
 * Uso con rol específico:
 *   <ProtectedRoute roles={['ADMINISTRADOR', 'COORDINADOR_PRACTICA']}>
 *     <MiPagina />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0 && !roles.includes(user?.rol)) {
    return <Navigate to="/sin-permiso" replace />
  }

  return children
}