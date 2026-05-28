/**
 * Avatar con iniciales del usuario.
 * La paleta de colores se asigna automáticamente según la inicial del nombre.
 */
const PALETA = [
  { bg: '#e6f0fb', color: '#0B416B' },
  { bg: '#eaf7f0', color: '#1a7a4a' },
  { bg: '#fff8e6', color: '#a07010' },
  { bg: '#fef0f0', color: '#c0392b' },
  { bg: '#f3e8ff', color: '#6d28d9' },
]

export default function Avatar({ nombre, size = 28 }) {
  const iniciales = nombre
    ? nombre.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?'

  const p = PALETA[(nombre?.charCodeAt(0) ?? 0) % PALETA.length]

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{
        width:      size,
        height:     size,
        fontSize:   size * 0.36,
        background: p.bg,
        color:      p.color,
      }}
    >
      {iniciales}
    </div>
  )
}