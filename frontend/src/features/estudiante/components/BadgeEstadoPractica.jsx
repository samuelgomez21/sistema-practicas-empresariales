const CONFIG = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio',    bg: '#f0f2f5', color: '#6b7a8d' },
  EN_PROCESO_VINCULACION:    { label: 'En vinculación',       bg: '#e6f0fb', color: '#0B416B' },
  VINCULADA:                 { label: 'Convenio registrado',  bg: '#f3e8ff', color: '#6d28d9' },
  EN_PRACTICA:               { label: 'En práctica',          bg: '#eaf7f0', color: '#1a7a4a' },
  COMPLETADA:                { label: 'Completada',           bg: '#eaf7f0', color: '#1a7a4a' },
  REPROBADA:                 { label: 'Reprobada',            bg: '#fef0f0', color: '#c0392b' },
  CANCELADA:                 { label: 'Cancelada',            bg: '#fef0f0', color: '#c0392b' },
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