import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Building2 } from 'lucide-react'
import { coordEmpresarialApi, ESTADO_POSTULACION_LABEL } from '../api/coordEmpresarialApi'
import { ESTADO_PRACTICA_LABEL } from '@/features/docente/api/docenteApi'

export default function PerfilEstudianteHistorialPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante-historial', id],
    queryFn:  () => coordEmpresarialApi.getEstudianteHistorial(id),
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )
  if (!estudiante) return null

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex items-center gap-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: '#e6f0fb', color: '#0B416B' }}>
          {estudiante.nombre[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>{estudiante.nombre}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.programa} · Semestre {estudiante.semestre}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>{estudiante.correo}</p>
        </div>
        <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
          Apto
        </span>
      </div>

      {/* Postulaciones activas */}
      {estudiante.postulaciones?.length > 0 && (
        <div className="bg-white rounded-xl p-5"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Postulaciones actuales
          </p>
          <div className="flex flex-col gap-2">
            {estudiante.postulaciones.map((p, idx) => {
              const cfg = ESTADO_POSTULACION_LABEL[p.estado] ?? ESTADO_POSTULACION_LABEL.POSTULADO
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                  <div className="flex items-center gap-2">
                    <Building2 size={13} style={{ color: '#0B416B' }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>{p.empresaNombre}</p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{p.vacanteTitulo}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Historial de prácticas */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Historial de prácticas
        </p>
        {estudiante.historialPracticas?.length === 0 ? (
          <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin prácticas registradas</p>
        ) : (
          <div className="flex flex-col gap-2">
            {estudiante.historialPracticas.map((p, idx) => {
              const cfg = ESTADO_PRACTICA_LABEL[p.estado] ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      Práctica #{p.numero} — {p.periodo}
                    </p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {p.empresaNombre ?? 'Sin empresa asignada'}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}