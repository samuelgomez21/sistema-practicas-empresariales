const CONFIG = {
  PENDIENTE: { label: 'Pendiente',  bg: '#fff8e6', color: '#a07010' },
  REVISADO:  { label: 'Revisado',   bg: '#eaf7f0', color: '#1a7a4a' },
  APROBADO:  { label: 'Aprobado',   bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADO: { label: 'Rechazado',  bg: '#fef0f0', color: '#c0392b' },
}

export default function BadgeEstadoAvance({ estado }) {
  const cfg = CONFIG[estado] ?? { label: estado ?? '—', bg: '#f0f2f5', color: '#6b7a8d' }
  return (
    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}