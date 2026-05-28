import { CheckCircle, XCircle, Clock } from 'lucide-react'

/**
 * Indicador visual del estado de un documento.
 * validado: true | false | null (no subido)
 */
export default function DocPill({ label, url, validado }) {
  if (!url) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: '#fef0f0', color: '#c0392b' }}>
      <XCircle size={10} /> {label}
    </span>
  )
  if (!validado) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: '#fff8e6', color: '#a07010' }}>
      <Clock size={10} /> {label}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
      <CheckCircle size={10} /> {label}
    </span>
  )
}