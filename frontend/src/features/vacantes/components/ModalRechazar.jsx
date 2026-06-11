import { useState } from 'react'
import { X } from 'lucide-react'

export default function ModalRechazar({ vacante, onClose, onRechazada }) {
  const [motivo,  setMotivo]  = useState('')
  const [loading, setLoading] = useState(false)

  const handleRechazar = async () => {
    if (!motivo.trim()) return
    setLoading(true)
    try {
      await onRechazada(motivo)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Rechazar vacante
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {vacante.titulo}
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
              style={{ color: '#023859' }}>
              Motivo del rechazo
            </p>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              rows={4}
              placeholder="Explica por qué se rechaza esta vacante para que la empresa pueda corregirla..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
            {motivo.length === 0 && (
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                El motivo es obligatorio para notificar a la empresa
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={handleRechazar}
              disabled={!motivo.trim() || loading}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: !motivo.trim() || loading ? '#a0aab4' : '#D91438' }}>
              {loading ? 'Rechazando...' : 'Confirmar rechazo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}