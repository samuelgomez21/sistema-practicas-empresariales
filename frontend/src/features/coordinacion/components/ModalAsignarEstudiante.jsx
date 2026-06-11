import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { coordinacionApi, APTITUD_CONFIG } from '../api/coordinacionApi'

export default function ModalAsignarEstudiante({ docente, onClose, onAsignado }) {
  const [estudianteId, setEstudianteId] = useState('')
  const [loading,      setLoading]      = useState(false)

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['estudiantes-clasificacion'],
    queryFn:  coordinacionApi.getEstudiantes,
  })

  // Solo aptos, con práctica creada y sin docente asignado
  const disponibles = estudiantes.filter(e =>
    e.estadoAptitud === 'APTO' &&
    e.practicaId &&
    !e.docenteId &&
    !docente.estudiantesActivos.find(ea => ea.id === e.id)
  )

  const handleAsignar = async () => {
    if (!estudianteId) return
    setLoading(true)
    const est = estudiantes.find(e => e.id === Number(estudianteId))
    try {
      await coordinacionApi.asignarDocente(est.practicaId, docente.id)
      onAsignado()
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
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Asignar estudiante</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {docente.nombre} · {docente.estudiantesActivos.length}/{docente.maxEstudiantes} estudiantes
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
            style={{ color: '#023859' }}>
            Estudiantes aptos sin docente asignado
          </p>
          <select
            value={estudianteId}
            onChange={e => setEstudianteId(e.target.value)}
            className="w-full h-10 px-3 rounded-lg text-sm outline-none"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Seleccionar estudiante...</option>
            {disponibles.map(e => (
              <option key={e.id} value={e.id}>
                {e.nombre} — {e.programa} (Sem. {e.semestre})
              </option>
            ))}
          </select>
          {disponibles.length === 0 && (
            <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
              No hay estudiantes aptos disponibles para asignar
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button onClick={handleAsignar}
            disabled={!estudianteId || loading}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white"
            style={{ background: !estudianteId || loading ? '#a0aab4' : '#D91438' }}>
            {loading ? 'Asignando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  )
}