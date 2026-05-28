const CONFIG = {
  HABILITADA:             { label: 'Habilitada',          bg: '#eaf7f0', color: '#1a7a4a' },
  PENDIENTE_HABILITACION: { label: 'Pend. habilitación',  bg: '#fff8e6', color: '#a07010' },
  SIN_COMPLETAR:          { label: 'Sin completar',       bg: '#f0f2f5', color: '#6b7a8d' },
  INHABILITADA:           { label: 'Inhabilitada',        bg: '#fef0f0', color: '#c0392b' },
}

export default function BadgeEstadoEmpresa({ estado }) {
  const cfg = CONFIG[estado] ?? CONFIG.SIN_COMPLETAR
  return (
    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}