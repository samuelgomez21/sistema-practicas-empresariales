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


import EmpresasLayout         from '@/features/empresas/pages/EmpresasLayout'
import EmpresasListadoPage    from '@/features/empresas/pages/EmpresasListadoPage'
import DetalleEmpresaPage     from '@/features/empresas/pages/DetalleEmpresaPage'
import ValidarDocumentosPage  from '@/features/empresas/pages/ValidarDocumentosPage'
import VisitasPage            from '@/features/empresas/pages/VisitasPage'
import TutoresAdminPage       from '@/features/empresas/pages/TutoresAdminPage'
import MiPerfilEmpresaPage    from '@/features/empresas/pages/MiPerfilEmpresaPage'
import MisPracticantesPage    from '@/features/empresas/pages/MisPracticantesPage'


import EstudianteLayout          from '@/features/estudiante/pages/EstudianteLayout'
import EstudianteDashboardPage   from '@/features/estudiante/pages/EstudianteDashboardPage'
import MiPracticaPage            from '@/features/estudiante/pages/MiPracticaPage'
import MiPerfilEstudiantePage    from '@/features/estudiante/pages/MiPerfilEstudiantePage'
import DocumentosPage            from '@/features/estudiante/pages/DocumentosPage'
import AvancesPage               from '@/features/estudiante/pages/AvancesPage'
import EncuestasPage             from '@/features/estudiante/pages/EncuestasPage'
import PazYSalvoPage             from '@/features/estudiante/pages/PazYSalvoPage'

import VacantesLayout      from '@/features/vacantes/pages/VacantesLayout'
import VacantesListadoPage from '@/features/vacantes/pages/VacantesListadoPage'
import DetalleVacantePage  from '@/features/vacantes/pages/DetalleVacantePage'
import MisVacantesPage     from '@/features/vacantes/pages/MisVacantesPage'

import MisPostulacionesPage    from '@/features/estudiante/pages/MisPostulacionesPage'
import CandidatosEmpresaPage   from '@/features/vacantes/pages/CandidatosEmpresaPage'

import ClasificacionPage   from '@/features/coordinacion/pages/ClasificacionPage'
import CargaDocentesPage   from '@/features/coordinacion/pages/CargaDocentesPage'

import PerfilEstudianteEmpresaPage from '@/features/empresas/pages/PerfilEstudianteEmpresaPage'
import DetalleEmpresaCoordPage     from '@/features/empresas/pages/DetalleEmpresaPage'

import MisEstudiantesPage          from '@/features/docente/pages/MisEstudiantesPage'
import PerfilEstudianteDocentePage from '@/features/docente/pages/PerfilEstudianteDocentePage'
import SeguimientosPage            from '@/features/docente/pages/SeguimientosPage'
import VisitasDocentePage          from '@/features/docente/pages/VisitasPage'
import DocenteLayout                from '@/features/docente/pages/DocenteLayout'
import MiPerfilDocentePage from '@/features/docente/pages/MiPerfilDocentePage'


import SeguimientoEstudiantesPage     from '@/features/coordinacion-empresarial/pages/SeguimientoEstudiantesPage'
import PerfilEstudianteHistorialPage  from '@/features/coordinacion-empresarial/pages/PerfilEstudianteHistorialPage'
import ContratosPage                  from '@/features/coordinacion-empresarial/pages/ContratosPage'
import VisitasCoordinadoraPage        from '@/features/coordinacion-empresarial/pages/VisitasCoordinadorPage'
import PazYSalvoCoordPage             from '@/features/coordinacion-empresarial/pages/PazYSalvoCoordPage'

import MiPerfilTutorPage         from '@/features/tutor/pages/MiPerfilTutorPage'
import MisEstudiantesTutorPage   from '@/features/tutor/pages/MisEstudiantesTutorPage'
import EncuestaTutorPage         from '@/features/tutor/pages/EncuestaTutorPage'


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
      { path: '/estudiante/dashboard',
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
      {  path: '/empresas',
        element: (
          <ProtectedRoute roles={[
            ROLES.ADMINISTRADOR,
            ROLES.COORDINADOR_PRACTICA,
            ROLES.SECRETARIA,
            ROLES.EMPRESA,
            ROLES.ESTUDIANTE,
          ]}>
            <EmpresasLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/empresas/listado" replace /> },
          // Admin / Coordinadora / Secretaria
          { path: 'listado',        element: <EmpresasListadoPage /> },
          { path: ':id',            element: <DetalleEmpresaPage /> },
          { path: ':id/editar',     element: <DetalleEmpresaPage editMode /> },
          { path: 'validar',        element: <ValidarDocumentosPage /> },
          { path: 'visitas',        element: <VisitasPage /> },
          { path: 'tutores-admin',  element: <TutoresAdminPage /> },
          // Portal empresa
          { path: 'mi-perfil',      element:
            <ProtectedRoute roles={[ROLES.EMPRESA]}>
              <MiPerfilEmpresaPage />
            </ProtectedRoute>
          },
          { path: 'practicantes',   element:
            <ProtectedRoute roles={[ROLES.EMPRESA]}>
              <MisPracticantesPage />
            </ProtectedRoute>
          },
          { path: 'tutores',        element:
            <ProtectedRoute roles={[ROLES.EMPRESA, ROLES.ADMINISTRADOR, ROLES.COORDINADOR_PRACTICA, ROLES.SECRETARIA]}>
              <TutoresAdminPage empresaId={2} />
            </ProtectedRoute>
          },
          { path: 'candidatos', element:
            <ProtectedRoute roles={[ROLES.EMPRESA]}>
              <CandidatosEmpresaPage />
            </ProtectedRoute>
          },
          {
            path: 'estudiante/:id',
            element: <PerfilEstudianteEmpresaPage />,
          },
        ],
      },
      {  path: '/estudiante',
        element: (
          <ProtectedRoute roles={[ROLES.ESTUDIANTE]}>
            <EstudianteLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true,         element: <Navigate to="/estudiante/dashboard" replace /> },
          { path: 'dashboard',   element: <EstudianteDashboardPage /> },
          { path: 'practica',    element: <MiPracticaPage /> },
          { path: 'perfil',      element: <MiPerfilEstudiantePage /> },
          { path: 'documentos',  element: <DocumentosPage /> },
          { path: 'avances',     element: <AvancesPage /> },
          { path: 'encuestas',   element: <EncuestasPage /> },
          { path: 'paz-salvo',   element: <PazYSalvoPage /> },
          { path: 'postulaciones', element: <MisPostulacionesPage /> },
        ],
      },
      {
        path: '/dashboard/estudiante',
        element: <Navigate to="/estudiante/dashboard" replace />,
      },
      {
        path: '/vacantes',
        element: (
          <ProtectedRoute roles={[
            ROLES.ADMINISTRADOR,
            ROLES.COORDINADOR_PRACTICA,
            ROLES.SECRETARIA,
            ROLES.EMPRESA,
          ]}>
            <VacantesLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true,          element: <Navigate to="/vacantes/listado" replace /> },
          { path: 'listado',      element: <VacantesListadoPage /> },
          { path: ':id',          element: <DetalleVacantePage />  },
          { path: 'mis-vacantes', element:
            <ProtectedRoute roles={[ROLES.EMPRESA]}>
              <MisVacantesPage />
            </ProtectedRoute>
          },
        ],
      },
      {
        path: '/coordinacion/clasificacion',
        element: (
          <ProtectedRoute roles={[ROLES.COORDINACION_ACADEMICA, ROLES.ADMINISTRADOR]}>
            <ClasificacionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coordinador/docentes',
        element: <CargaDocentesPage />
      },
      {
        path: '/docente',
        element: (
          <ProtectedRoute roles={[ROLES.DOCENTE_ASESOR]}>
            <DocenteLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true,        element: <Navigate to="/docente/estudiantes" replace /> },
          { path: 'estudiantes',     element: <MisEstudiantesPage /> },
          { path: 'estudiantes/:id', element: <PerfilEstudianteDocentePage /> },
          { path: 'seguimientos',    element: <SeguimientosPage /> },
          { path: 'visitas',         element: <VisitasDocentePage /> },
          { path: 'perfil', element: <MiPerfilDocentePage /> },

        ]
      },
      {
        path: '/coordinacion-empresarial/estudiantes',
        element: (
          <ProtectedRoute roles={[ROLES.COORDINADOR_PRACTICA, ROLES.ADMINISTRADOR]}>
            <SeguimientoEstudiantesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coordinacion-empresarial/estudiantes/:id',
        element: (
          <ProtectedRoute roles={[ROLES.COORDINADOR_PRACTICA, ROLES.ADMINISTRADOR]}>
            <PerfilEstudianteHistorialPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coordinacion-empresarial/contratos',
        element: (
          <ProtectedRoute roles={[ROLES.COORDINADOR_PRACTICA, ROLES.ADMINISTRADOR]}>
            <ContratosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coordinacion-empresarial/visitas',
        element: (
          <ProtectedRoute roles={[ROLES.COORDINADOR_PRACTICA, ROLES.ADMINISTRADOR]}>
            <VisitasCoordinadoraPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/coordinacion-empresarial/paz-salvo',
        element: (
          <ProtectedRoute roles={[ROLES.COORDINADOR_PRACTICA, ROLES.ADMINISTRADOR]}>
            <PazYSalvoCoordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tutor/perfil',
        element: (
          <ProtectedRoute roles={[ROLES.TUTOR_EMPRESARIAL]}>
            <MiPerfilTutorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tutor/estudiantes',
        element: (
          <ProtectedRoute roles={[ROLES.TUTOR_EMPRESARIAL]}>
            <MisEstudiantesTutorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tutor/estudiantes/:id',
        element: (
          <ProtectedRoute roles={[ROLES.TUTOR_EMPRESARIAL]}>
            <EncuestaTutorPage />
          </ProtectedRoute>
        ),
      },
    ],
    
  },

  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}