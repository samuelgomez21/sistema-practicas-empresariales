import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { coordinacionApi, APTITUD_CONFIG } from '../api/coordinacionApi'

export default function ModalEvaluarAptitud({ estudiante, onClose, onGuardado }) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(
    estudiante.estadoAptitud ?? 'SIN_EVALUAR'
  )
  const [catalogoId,         setCatalogoId]         = useState('')
  const [numeroPractica,     setNumeroPractica]      = useState(
    estudiante.numeroPractica ?? 1
  )

  const { data: catalogos = [] } = useQuery({
    queryKey: ['catalogos', estudiante.programaId],
    queryFn:  () => coordinacionApi.getCatalogos(estudiante.programaId),
  })

  const aptitudMutation = useMutation({
    mutationFn: () => coordinacionApi.evaluarAptitud(
      estudiante.id, numeroPractica, estadoSeleccionado
    ),
    onSuccess: async () => {
      // Si quedó APTO y se seleccionó catálogo, crear práctica automáticamente
      if (estadoSeleccionado === 'APTO' && catalogoId) {
        await coordinacionApi.crearPracticaAutomatica(estudiante.id, Number(catalogoId))
        toast.success('Estudiante marcado como APTO y práctica creada automáticamente')
      } else {
        toast.success('Aptitud actualizada correctamente')
      }
      onGuardado()
    },
    onError: () => toast.error('Error al guardar'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Evaluar aptitud
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {estudiante.nombre} · {estudiante.programa}
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        {/* Info del estudiante */}
        <div className="p-3 rounded-lg mb-4"
          style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Semestre',           `Semestre ${estudiante.semestre}`],
              ['Créditos aprobados', estudiante.creditosAprobados],
              ['Promedio',           estudiante.promedioAcumulado?.toFixed(2)],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[9px] uppercase tracking-wide" style={{ color: '#8a9bb0' }}>{l}</p>
                <p className="text-xs font-semibold" style={{ color: '#023859' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* Selección de estado */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
              style={{ color: '#023859' }}>
              Estado de aptitud
            </p>
            <div className="flex flex-col gap-2">
              {Object.entries(APTITUD_CONFIG).filter(([k]) => k !== 'SIN_EVALUAR').map(([k, v]) => (
                <button key={k}
                  onClick={() => setEstadoSeleccionado(k)}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                  style={{
                    border:     estadoSeleccionado === k ? `1.5px solid ${v.color}` : '0.5px solid #e2e8f0',
                    background: estadoSeleccionado === k ? v.bg : '#f7f9fb',
                  }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: v.dot }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: v.color }}>{v.label}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {k === 'APTO'        ? 'Cumple todos los requisitos para iniciar práctica'
                        : k === 'EN_REVISION' ? 'Tiene materias pendientes pero puede continuar proceso'
                        : 'No cumple los requisitos mínimos del programa'}
                    </p>
                  </div>
                  {estadoSeleccionado === k && (
                    <CheckCircle size={14} style={{ color: v.color }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selección de práctica — solo si es APTO */}
          {estadoSeleccionado === 'APTO' && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
                style={{ color: '#023859' }}>
                Práctica a realizar
              </p>
              <select
                value={catalogoId}
                onChange={e => {
                  setCatalogoId(e.target.value)
                  const c = catalogos.find(c => String(c.id) === e.target.value)
                  if (c) setNumeroPractica(c.numeroPractica)
                }}
                className="w-full h-10 px-3 rounded-lg text-sm outline-none"
                style={is}>
                <option value="">Seleccionar práctica...</option>
                {catalogos.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {!catalogoId && (
                <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                  Al seleccionar la práctica se creará automáticamente en el sistema
                </p>
              )}
              {catalogoId && (
                <div className="mt-2 flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
                  <CheckCircle size={12} style={{ color: '#1a7a4a' }} />
                  <p className="text-[10px]" style={{ color: '#1a7a4a' }}>
                    Se creará la práctica automáticamente al guardar
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button
            onClick={() => aptitudMutation.mutate()}
            disabled={aptitudMutation.isPending || (estadoSeleccionado === 'APTO' && !catalogoId)}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white"
            style={{
              background: aptitudMutation.isPending || (estadoSeleccionado === 'APTO' && !catalogoId)
                ? '#a0aab4' : '#D91438',
            }}>
            {aptitudMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}