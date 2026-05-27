import { AlertTriangle } from 'lucide-react'

/**
 * Banner informativo que recuerda las reglas de protección
 * de datos históricos en todas las vistas de configuración.
 */
export default function ProteccionBanner() {
  return (
    <div
      className="flex gap-3 items-start rounded-lg p-3 text-xs leading-relaxed"
      style={{ background: '#fff8e6', border: '0.5px solid #f0c040', color: '#a07010' }}
    >
      <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
      <p>
        <strong>Protección de datos históricos:</strong> los cambios en este módulo
        solo aplican a prácticas futuras. Las prácticas actualmente activas mantienen
        sus condiciones originales. No es posible desactivar un elemento con prácticas
        activas vinculadas.
      </p>
    </div>
  )
}