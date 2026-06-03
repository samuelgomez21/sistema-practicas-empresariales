/**
 * Badge de estado de aptitud del estudiante.
 */
const CONFIG = {
  APTO:        { label: 'Apto',        bg: '#eaf7f0', color: '#1a7a4a' },
  NO_APTO:     { label: 'No apto',     bg: '#fef0f0', color: '#c0392b' },
  EN_REVISION: { label: 'En revisión', bg: '#fff8e6', color: '#a07010' },
  SIN_EVALUAR: { label: 'Sin evaluar', bg: '#f0f2f5', color: '#6b7a8d' },
}

export default function BadgeAptitud({ estado }) {
  const cfg = CONFIG[estado] ?? CONFIG.SIN_EVALUAR
  return (
    <span
      className="text-[9px] font-bold px-2 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}