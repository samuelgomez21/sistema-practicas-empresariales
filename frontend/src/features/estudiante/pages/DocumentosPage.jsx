import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Upload, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { estudianteApi } from '../api/estudianteApi'

const DOCS_CONFIG = [
  {
    key:      'arl',
    apiKey:   'ARL',
    label:    'ARL',
    nota:     'Afiliación a riesgos laborales vigente',
    icono:    '🛡️',
  },
  {
    key:      'planeador',
    apiKey:   'PLANEADOR',
    label:    'Planeador de práctica',
    nota:     'Formato firmado por el docente',
    icono:    '📋',
  },
  {
    key:      'informeEjecutivo',
    apiKey:   'INFORME_EJECUTIVO',
    label:    'Informe ejecutivo',
    nota:     'Resumen ejecutivo de tu práctica',
    icono:    '📄',
  },
  {
    key:      'presentacion',
    apiKey:   'PRESENTACION',
    label:    'Presentación final',
    nota:     'Diapositivas de sustentación',
    icono:    '🎯',
  },
  {
    key:      'documentoFinal',
    apiKey:   'DOCUMENTO_FINAL',
    label:    'Documento final',
    nota:     'Informe final de práctica',
    icono:    '📑',
  },
]

const ESTADO_DOC = {
  PENDIENTE:  { label: 'Pendiente revisión', icon: <Clock    size={12} />, bg: '#fff8e6', color: '#a07010' },
  APROBADO:   { label: 'Aprobado',           icon: <CheckCircle size={12} />, bg: '#eaf7f0', color: '#1a7a4a' },
  RECHAZADO:  { label: 'Rechazado',          icon: <XCircle  size={12} />, bg: '#fef0f0', color: '#c0392b' },
}

export default function DocumentosPage() {
  const qc      = useQueryClient()
  const refs    = useRef({})
  const [subiendo, setSubiendo] = useState({})

  const { data: documentos = {}, isLoading } = useQuery({
    queryKey: ['mis-documentos'],
    queryFn:  estudianteApi.getMisDocumentos,
  })

  const handleSubir = async (config, archivo) => {
    if (!archivo) return
    setSubiendo(prev => ({ ...prev, [config.key]: true }))
    try {
      await estudianteApi.subirDocumento(config.apiKey, archivo)
      qc.invalidateQueries({ queryKey: ['mis-documentos'] })
      qc.invalidateQueries({ queryKey: ['mi-checklist'] })
      toast.success(`${config.label} cargado correctamente`)
    } catch (err) {
      toast.error(err?.message ?? `Error al cargar ${config.label}`)
    } finally {
      setSubiendo(prev => ({ ...prev, [config.key]: false }))
    }
  }

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  const aprobados = DOCS_CONFIG.filter(d => documentos[d.key]?.estado === 'APROBADO').length
  const subidos   = DOCS_CONFIG.filter(d => !!documentos[d.key]?.url).length

  return (
    <div className="flex flex-col gap-4">

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total requeridos', value: DOCS_CONFIG.length, color: '#023859' },
          { label: 'Cargados',         value: subidos,            color: '#0B416B' },
          { label: 'Aprobados',        value: aprobados,          color: '#1a7a4a' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Lista de documentos */}
      <div className="flex flex-col gap-3">
        {DOCS_CONFIG.map(config => {
          const doc     = documentos[config.key]
          const cargado = !!doc?.url
          const estado  = doc?.estado ? ESTADO_DOC[doc.estado] : null
          const esSub   = subiendo[config.key]

          return (
            <div key={config.key} className="bg-white rounded-xl p-5"
              style={{
                border: cargado && doc.estado === 'APROBADO'
                  ? '0.5px solid #b6e8cf'
                  : '0.5px solid #e2e8f0',
              }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{config.icono}</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#023859' }}>{config.label}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{config.nota}</p>
                    {doc?.fechaCarga && (
                      <p className="text-[10px] mt-0.5" style={{ color: '#6b7a8d' }}>
                        Cargado el {new Date(doc.fechaCarga).toLocaleDateString('es-CO')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {estado && (
                    <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: estado.bg, color: estado.color }}>
                      {estado.icon} {estado.label}
                    </span>
                  )}

                  {cargado && (
                    <a href={doc.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      <ExternalLink size={11} /> Ver
                    </a>
                  )}

                  <input
                    ref={el => refs.current[config.key] = el}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="hidden"
                    onChange={e => handleSubir(config, e.target.files?.[0])}
                  />

                  <button
                    onClick={() => refs.current[config.key]?.click()}
                    disabled={esSub}
                    className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                    style={cargado
                      ? { background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }
                      : { background: '#D91438', color: '#fff' }}>
                    <Upload size={11} />
                    {esSub ? 'Subiendo...' : cargado ? 'Actualizar' : 'Cargar'}
                  </button>
                </div>
              </div>

              {doc?.estado === 'RECHAZADO' && (
                <div className="mt-3 p-2 rounded-lg" style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
                  <p className="text-[10px]" style={{ color: '#c0392b' }}>
                    Este documento fue rechazado. Por favor carga una nueva versión.
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 rounded-lg text-[10px] leading-relaxed"
        style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0', color: '#6b7a8d' }}>
        Los documentos son revisados por el docente asesor. Una vez aprobados, se actualiza
        automáticamente tu checklist de paz y salvo.
      </div>
    </div>
  )
}