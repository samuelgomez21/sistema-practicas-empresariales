export default function BadgeEstadoUsuario({ activo }) {
  return (
    <span
      className="text-[9px] font-bold px-2 py-1 rounded-full"
      style={activo
        ? { background: '#eaf7f0', color: '#1a7a4a' }
        : { background: '#f0f2f5', color: '#6b7a8d' }}
    >
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  )
}