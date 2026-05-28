import { AlertTriangle } from 'lucide-react'

export default function ModalConfirmUsuario({ titulo, mensaje, onConfirmar, onCancelar, cargando }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#fef0f0' }}>
            <AlertTriangle size={20} style={{ color: '#D91438' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>{titulo}</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>{mensaje}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancelar}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button onClick={onConfirmar} disabled={cargando}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white"
            style={{ background: cargando ? '#a0aab4' : '#D91438' }}>
            {cargando ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}