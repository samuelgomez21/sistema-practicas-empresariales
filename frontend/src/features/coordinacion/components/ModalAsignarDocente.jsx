import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, CheckCircle } from 'lucide-react'
import { coordinacionApi } from '../api/coordinacionApi'

export default function ModalAsignarDocente({ estudiante, onClose, onAsignado }) {
  const [docenteId, setDocenteId] = useState('')
  const [loading,   setLoading]   = useState(false)

  const { data: docentes = [] } = useQuery({
    queryKey: ['docentes-carga'],
    queryFn:  coordinacionApi.getDocentes,
  })

  const disponibles = docentes.filter(
    d => d.estudiantesActivos.length < d.maxEstudiantes
  )

  const handleAsignar = async () => {
    if (!docenteId) return
    setLoading(true)
    try {
      await coordinacionApi.asignarDocente(estudiante.practicaId, Number(docenteId))
      onAsignado()
    } finally {
      setLoading(false)
    }
  }

  const docenteSeleccionado = docentes.find(d => d.id === Number(docenteId))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Asignar docente asesor</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {estudiante.nombre}
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
              style={{ color: '#023859' }}>
              Docentes con cupo disponible
            </p>
            <div className="flex flex-col gap-2">
              {disponibles.map(d => {
                const pct = Math.round((d.estudiantesActivos.length / d.maxEstudiantes) * 100)
                return (
                  <button key={d.id}
                    onClick={() => setDocenteId(String(d.id))}
                    className="flex items-start gap-3 p-3 rounded-lg text-left transition-all"
                    style={{
                      border:     String(docenteId) === String(d.id) ? '1.5px solid #0B416B' : '0.5px solid #e2e8f0',
                      background: String(docenteId) === String(d.id) ? '#e6f0fb' : '#f7f9fb',
                    }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      {d.nombre[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                        {d.nombre}
                      </p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        {d.facultad}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                          <div className="h-1.5 rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: pct > 70 ? '#a07010' : '#1a7a4a',
                            }} />
                        </div>
                        <span className="text-[9px] font-medium" style={{ color: '#6b7a8d' }}>
                          {d.estudiantesActivos.length}/{d.maxEstudiantes}
                        </span>
                      </div>
                    </div>
                    {String(docenteId) === String(d.id) && (
                      <CheckCircle size={14} style={{ color: '#0B416B', flexShrink: 0 }} />
                    )}
                  </button>
                )
              })}
              {disponibles.length === 0 && (
                <p className="text-xs py-2" style={{ color: '#8a9bb0' }}>
                  No hay docentes con cupo disponible en este momento
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button onClick={handleAsignar}
            disabled={!docenteId || loading}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white"
            style={{ background: !docenteId || loading ? '#a0aab4' : '#0B416B' }}>
            {loading ? 'Asignando...' : 'Asignar docente'}
          </button>
        </div>
      </div>
    </div>
  )
}