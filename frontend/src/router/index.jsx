import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'

import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

import LoginPage             from '@/features/auth/pages/LoginPage'
import CambiarPasswordPage   from '@/features/auth/pages/CambiarPasswordPage'
import RecuperarPasswordPage from '@/features/auth/pages/RecuperarPasswordPage'
import SinPermisoPage        from '@/features/auth/pages/SinPermisoPage'

import DashboardAdmin                  from '@/features/dashboard/pages/DashboardAdmin'
import DashboardCoordinacionAcademica  from '@/features/dashboard/pages/DashboardCoordinacionAcademica'
import DashboardCoordinadorPractica    from '@/features/dashboard/pages/DashboardCoordinadorPractica'
import DashboardSecretaria             from '@/features/dashboard/pages/DashboardSecretaria'
import DashboardDocente                from '@/features/dashboard/pages/DashboardDocente'
import DashboardEmpresa                from '@/features/dashboard/pages/DashboardEmpresa'
import DashboardTutor                  from '@/features/dashboard/pages/DashboardTutor'
import DashboardEstudiante             from '@/features/dashboard/pages/DashboardEstudiante'
import DashboardDireccion              from '@/features/dashboard/pages/DashboardDireccion'

import ConfiguracionLayout from '@/features/configuracion/pages/ConfiguracionLayout'
import FacultadesPage      from '@/features/configuracion/pages/FacultadesPage'
import ProgramasPage       from '@/features/configuracion/pages/ProgramasPage'
import ParametrosPage      from '@/features/configuracion/pages/ParametrosPage'
import CatalogoPracticasPage from '@/features/configuracion/pages/CatalogoPracticasPage'
import PlantillasCorreoPage  from '@/features/configuracion/pages/PlantillasCorreoPage'
import CatalogosMaestrosPage from '@/features/configuracion/pages/CatalogosMaestrosPage'

import UsuariosLayout         from '@/features/usuarios/pages/UsuariosLayout'
import CoordinadoresPage      from '@/features/usuarios/pages/CoordinadoresPage'
import EstudiantesPage        from '@/features/usuarios/pages/EstudiantesPage'
import DocentesPage           from '@/features/usuarios/pages/DocentesPage'
import DetalleEstudiantePage  from '@/features/usuarios/pages/DetalleEstudiantePage'



// Redirige al dashboard del rol activo
function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const RUTAS = {
    [ROLES.ADMINISTRADOR]:          '/dashboard/admin',
    [ROLES.COORDINACION_ACADEMICA]: '/dashboard/coordinacion-academica',
    [ROLES.COORDINADOR_PRACTICA]:   '/dashboard/coordinador-practica',
    [ROLES.SECRETARIA]:             '/dashboard/secretaria',
    [ROLES.DOCENTE_ASESOR]:         '/dashboard/docente',
    [ROLES.EMPRESA]:                '/dashboard/empresa',
    [ROLES.TUTOR_EMPRESARIAL]:      '/dashboard/tutor',
    [ROLES.ESTUDIANTE]:             '/dashboard/estudiante',
    [ROLES.DIRECCION]:              '/dashboard/direccion',
  }
  return <Navigate to={RUTAS[user?.rol] ?? '/login'} replace />
}

const router = createBrowserRouter([
  // Rutas públicas
  { path: '/login',              element: <LoginPage /> },
  { path: '/cambiar-password',   element: <CambiarPasswordPage /> },
  { path: '/recuperar-password', element: <RecuperarPasswordPage /> },
  { path: '/sin-permiso',        element: <SinPermisoPage /> },

  // Raíz → redirige al dashboard del rol
  { path: '/', element: <RootRedirect /> },

  // Rutas protegidas dentro del Layout
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard/admin',
        element: <ProtectedRoute roles={[ROLES.ADMINISTRADOR]}><DashboardAdmin /></ProtectedRoute> },
      { path: '/dashboard/coordinacion-academica',
        element: <ProtectedRoute roles={[ROLES.COORDINACION_ACADEMICA]}><DashboardCoordinacionAcademica /></ProtectedRoute> },
      { path: '/dashboard/coordinador-practica',
        element: <ProtectedRoute roles={[ROLES.COORDINADOR_PRACTICA]}><DashboardCoordinadorPractica /></ProtectedRoute> },
      { path: '/dashboard/secretaria',
        element: <ProtectedRoute roles={[ROLES.SECRETARIA]}><DashboardSecretaria /></ProtectedRoute> },
      { path: '/dashboard/docente',
        element: <ProtectedRoute roles={[ROLES.DOCENTE_ASESOR]}><DashboardDocente /></ProtectedRoute> },
      { path: '/dashboard/empresa',
        element: <ProtectedRoute roles={[ROLES.EMPRESA]}><DashboardEmpresa /></ProtectedRoute> },
      { path: '/dashboard/tutor',
        element: <ProtectedRoute roles={[ROLES.TUTOR_EMPRESARIAL]}><DashboardTutor /></ProtectedRoute> },
      { path: '/dashboard/estudiante',
        element: <ProtectedRoute roles={[ROLES.ESTUDIANTE]}><DashboardEstudiante /></ProtectedRoute> },
      { path: '/dashboard/direccion',
        element: <ProtectedRoute roles={[ROLES.DIRECCION]}><DashboardDireccion /></ProtectedRoute> },
      { path: '/configuracion',
        element: (
          <ProtectedRoute roles={[
            ROLES.ADMINISTRADOR,
            ROLES.COORDINACION_ACADEMICA,
            ROLES.COORDINADOR_PRACTICA,
          ]}>
            <ConfiguracionLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/configuracion/facultades" replace /> },
          { path: 'facultades', element: <FacultadesPage /> },
          { path: 'programas',  element: <ProgramasPage /> },
          { path: 'parametros', element: <ParametrosPage /> },
          { path: 'catalogo',   element: <CatalogoPracticasPage /> },
          { path: 'plantillas', element: <PlantillasCorreoPage /> },
          { path: 'catalogos',  element: <CatalogosMaestrosPage /> },
        ],
      },
      {  path: '/usuarios',
        element: (
          <ProtectedRoute roles={[ROLES.ADMINISTRADOR, ROLES.COORDINACION_ACADEMICA]}>
            <UsuariosLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/usuarios/estudiantes" replace /> },
          {
            path: 'coordinadores',
            element: (
              <ProtectedRoute roles={[ROLES.ADMINISTRADOR]}>
                <CoordinadoresPage />
              </ProtectedRoute>
            ),
          },
          { path: 'estudiantes',       element: <EstudiantesPage /> },
          { path: 'estudiantes/:id',   element: <DetalleEstudiantePage /> },
          { path: 'docentes',          element: <DocentesPage /> },
        ],
      },
    ],
    
  },

  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}