import { ESTADO_VACANTE } from '../api/vacantesApi'

export default function BadgeEstadoVacante({ estado }) {
  const cfg = ESTADO_VACANTE[estado] ?? ESTADO_VACANTE.PENDIENTE
  return (
    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}