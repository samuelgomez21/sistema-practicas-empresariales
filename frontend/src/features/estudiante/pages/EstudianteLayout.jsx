import { Outlet } from 'react-router-dom'

/**
 * Layout del módulo estudiante.
 * El sidebar ya está en el Layout principal, aquí solo renderizamos el contenido.
 */
export default function EstudianteLayout() {
  return <Outlet />
}