import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, ShieldOff, CheckCircle, XCircle } from 'lucide-react'
import { estudianteApi } from '../api/estudianteApi'

export default function PazYSalvoPage() {
  const { data: checklist = [], isLoading } = useQuery({
    queryKey: ['mi-checklist'],
    queryFn:  estudianteApi.getChecklist,
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-8 bg-gray-50 rounded mb-2" />
      ))}
    </div>
  )

  const completados = checklist.filter(c => c.completado).length
  const total       = checklist.length
  const pct         = total > 0 ? Math.round((completados / total) * 100) : 0
  const tienePaz    = completados === total && total > 0

  return (
    <div className="flex flex-col gap-4">

      {/* Estado general */}
      <div className="bg-white rounded-xl p-6 flex items-center gap-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: tienePaz ? '#eaf7f0' : '#fef0f0' }}>
          {tienePaz
            ? <ShieldCheck size={32} style={{ color: '#1a7a4a' }} />
            : <ShieldOff   size={32} style={{ color: '#c0392b' }} />
          }
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold"
            style={{ color: tienePaz ? '#1a7a4a' : '#c0392b' }}>
            {tienePaz ? 'Paz y salvo disponible' : 'Paz y salvo no disponible'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {tienePaz
              ? 'Has completado todos los requisitos de tu práctica empresarial.'
              : `Tienes ${total - completados} requisito(s) pendiente(s) por completar.`
            }
          </p>
          {/* Barra de progreso */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full" style={{ background: '#f0f2f5' }}>
              <div className="h-2 rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: tienePaz ? '#1a7a4a' : '#0B416B',
                }} />
            </div>
            <span className="text-xs font-bold"
              style={{ color: tienePaz ? '#1a7a4a' : '#023859' }}>
              {completados}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* Checklist detallado */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-4 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Requisitos para el paz y salvo
        </p>
        {checklist.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 py-2"
            style={{ borderBottom: i < checklist.length - 1 ? '0.5px solid #f7f9fb' : 'none' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: item.completado ? '#eaf7f0' : '#fef0f0' }}>
              {item.completado
                ? <CheckCircle size={14} style={{ color: '#1a7a4a' }} />
                : <XCircle    size={14} style={{ color: '#c0392b' }} />
              }
            </div>
            <p className="text-xs flex-1"
              style={{
                color:      item.completado ? '#1a7a4a' : '#023859',
                fontWeight: item.completado ? 500 : 400,
              }}>
              {item.label}
            </p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={item.completado
                ? { background: '#eaf7f0', color: '#1a7a4a' }
                : { background: '#fef0f0', color: '#c0392b' }}>
              {item.completado ? 'Listo' : 'Pendiente'}
            </span>
          </div>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="p-3 rounded-lg text-xs leading-relaxed"
        style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0', color: '#6b7a8d' }}>
        El paz y salvo es generado automáticamente por el sistema una vez que todos
        los requisitos estén completados. Algunos requisitos dependen de acciones
        del docente asesor o del tutor empresarial.
      </div>
    </div>
  )
}