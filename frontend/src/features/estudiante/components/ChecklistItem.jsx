import { CheckCircle, XCircle } from 'lucide-react'

export default function ChecklistItem({ label, completado }) {
  return (
    <div className="flex items-center gap-3 py-2"
      style={{ borderBottom: '0.5px solid #f7f9fb' }}>
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: completado ? '#eaf7f0' : '#fef0f0' }}>
        {completado
          ? <CheckCircle size={14} style={{ color: '#1a7a4a' }} />
          : <XCircle    size={14} style={{ color: '#c0392b' }} />
        }
      </div>
      <p className="text-xs flex-1"
        style={{ color: completado ? '#1a7a4a' : '#023859', fontWeight: completado ? 500 : 400 }}>
        {label}
      </p>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
        style={completado
          ? { background: '#eaf7f0', color: '#1a7a4a' }
          : { background: '#fef0f0', color: '#c0392b' }}>
        {completado ? 'Listo' : 'Pendiente'}
      </span>
    </div>
  )
}