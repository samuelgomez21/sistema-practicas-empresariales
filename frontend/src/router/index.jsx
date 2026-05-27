import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

import LoginPage from '@/features/auth/pages/LoginPage'
import CambiarPasswordPage from '@/features/auth/pages/CambiarPasswordPage'
import RecuperarPasswordPage from '@/features/auth/pages/RecuperarPasswordPage'

// Rutas protegidas — redirige al login si no hay sesión
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/cambiar-password',
    element: <CambiarPasswordPage />,
  },
  {
    path: '/recuperar-password/*',
    element: (
      <RecuperarPasswordPage />
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        {/* Aquí irá el Layout con sidebar y los paneles */}
        <div>Dashboard (próximo paso)</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}