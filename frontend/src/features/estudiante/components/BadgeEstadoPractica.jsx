const CONFIG = {
  EN_CURSO:   { label: 'Práctica activa',  bg: '#eaf7f0', color: '#1a7a4a' },
  ASIGNADA:   { label: 'Asignada',         bg: '#e6f0fb', color: '#0B416B' },
  CERRADA:    { label: 'Cerrada',          bg: '#f0f2f5', color: '#6b7a8d' },
  PENDIENTE:  { label: 'Pendiente empresa',bg: '#fff8e6', color: '#a07010' },
}

export default function BadgeEstadoPractica({ estado }) {
  const cfg = CONFIG[estado] ?? CONFIG.PENDIENTE
  return (
    <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}