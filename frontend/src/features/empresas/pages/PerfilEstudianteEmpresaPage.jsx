import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Download, ExternalLink, FileX } from 'lucide-react'
import api from '@/lib/axios'

const APTITUD_STYLE = {
  APTO:        { bg: '#eaf7f0', color: '#1a7a4a', label: 'Apto'        },
  NO_APTO:     { bg: '#fef0f0', color: '#c0392b', label: 'No apto'     },
  EN_REVISION: { bg: '#fff8e6', color: '#a07010', label: 'En revisión' },
  SIN_EVALUAR: { bg: '#f0f2f5', color: '#6b7a8d', label: 'Sin evaluar' },
}

export default function PerfilEstudianteEmpresaPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante-perfil-empresa', id],
    queryFn:  async () => {
      const { data } = await api.get(`/estudiantes/${id}`)
      return data
    },
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  if (!estudiante) return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Estudiante no encontrado</p>
    </div>
  )

  const iniciales = estudiante.nombre
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  const aptitud = APTITUD_STYLE[estudiante.estadoAptitud] ?? APTITUD_STYLE.SIN_EVALUAR

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver a candidatos
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex items-center gap-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: '#e6f0fb', color: '#0B416B' }}>
          {iniciales}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            {estudiante.nombre}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.nombrePrograma}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.email}
          </p>
        </div>
        <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: aptitud.bg, color: aptitud.color }}>
          {aptitud.label}
        </span>
      </div>

      {/* Métricas académicas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Semestre',           value: `Semestre ${estudiante.semestre}` },
          { label: 'Promedio acumulado', value: `${Number(estudiante.promedioAcumulado ?? 0).toFixed(2)} / 5.0` },
          { label: 'Créditos aprobados', value: estudiante.creditosAprobados },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl p-4 text-center"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>{m.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Hoja de vida */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Hoja de vida
        </p>

        {estudiante.hojaVidaUrl ? (
          <div className="flex items-center gap-4 p-4 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#eaf7f0' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#1a7a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                Hoja de vida
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                Documento cargado por el estudiante
              </p>
            </div>
            <div className="flex gap-2">
              <a href={estudiante.hojaVidaUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                <ExternalLink size={11} /> Ver
              </a>
              <a href={estudiante.hojaVidaUrl} download
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                <Download size={11} /> Descargar
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <FileX size={20} style={{ color: '#8a9bb0' }} />
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              El estudiante aún no ha cargado su hoja de vida
            </p>
          </div>
        )}
      </div>
    </div>
  )
}