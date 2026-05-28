import { AlertTriangle } from 'lucide-react'

/**
 * Muestra alerta cuando la cámara de comercio está
 * próxima a vencer (≤30 días) o ya venció.
 */
export default function AlertaCamara({ alerta }) {
  if (!alerta) return null
  const vencida = alerta.tipo === 'VENCIDA'
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
      style={{
        background: vencida ? '#fef0f0' : '#fff8e6',
        border:     vencida ? '0.5px solid #f7c1c1' : '0.5px solid #f0d080',
        color:      vencida ? '#c0392b' : '#a07010',
      }}>
      <AlertTriangle size={13} className="flex-shrink-0" />
      <span>
        {vencida
          ? `Cámara de comercio vencida hace ${alerta.dias} día(s). Debe actualizarla para abrir vacantes.`
          : `Cámara de comercio vence en ${alerta.dias} día(s). Recuérdele a la empresa actualizarla.`
        }
      </span>
    </div>
  )
}