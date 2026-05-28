import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, CheckCircle, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { estudianteApi } from '../api/estudianteApi'

const DOCS_CONFIG = [
  {
    key:   'hojaVida',
    label: 'Hoja de vida',
    nota:  'Requerida para ser postulado a vacantes',
    requerida: true,
  },
  {
    key:   'arl',
    label: 'Afiliación ARL',
    nota:  'Afiliación a riesgos laborales',
    requerida: true,
  },
  {
    key:   'contratoFirmado',
    label: 'Contrato firmado',
    nota:  'Firmado por universidad, estudiante y empresa',
    requerida: true,
  },
]

export default function DocumentosPage() {
  const qc       = useQueryClient()
  const refs     = useRef({})

  const { data: docs, isLoading } = useQuery({
    queryKey: ['mis-documentos'],
    queryFn:  estudianteApi.getMisDocumentos,
  })

  const subirMutation = useMutation({
    mutationFn: (tipo) => estudianteApi.subirDocumento(tipo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mis-documentos'] })
      toast.success('Documento cargado correctamente')
    },
    onError: () => toast.error('Error al subir el documento'),
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 rounded mb-3" />)}
    </div>
  )

  const subidos   = DOCS_CONFIG.filter(d => docs?.[d.key]?.url).length
  const total     = DOCS_CONFIG.length

  return (
    <div className="flex flex-col gap-4">

      {/* Resumen */}
      <div className="bg-white rounded-xl p-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Mis documentos</p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            {subidos}/{total} documentos cargados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 rounded-full" style={{ background: '#f0f2f5' }}>
            <div className="h-2 rounded-full"
              style={{ width: `${(subidos / total) * 100}%`, background: subidos === total ? '#1a7a4a' : '#0B416B' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: subidos === total ? '#1a7a4a' : '#023859' }}>
            {Math.round((subidos / total) * 100)}%
          </span>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="flex flex-col gap-3">
        {DOCS_CONFIG.map(doc => {
          const d = docs?.[doc.key]
          const tiene = !!d?.url
          return (
            <div key={doc.key} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: tiene ? '#eaf7f0' : '#f0f2f5' }}>
                    {tiene
                      ? <CheckCircle size={20} style={{ color: '#1a7a4a' }} />
                      : <FileText    size={20} style={{ color: '#8a9bb0' }} />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#023859' }}>{doc.label}</p>
                    <p className="text-xs" style={{ color: '#8a9bb0' }}>{doc.nota}</p>
                    {tiene && (
                      <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                        Cargado el {new Date(d.fechaCarga).toLocaleDateString('es-CO')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {tiene && (
                    <a href={d.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-medium"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      <ExternalLink size={12} /> Ver
                    </a>
                  )}
                  <input ref={el => refs.current[doc.key] = el}
                    type="file" className="hidden" accept=".pdf,.doc,.docx"
                    onChange={() => subirMutation.mutate(doc.key)} />
                  <button
                    onClick={() => refs.current[doc.key]?.click()}
                    disabled={subirMutation.isPending}
                    className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold"
                    style={tiene
                      ? { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
                      : { background: '#D91438', color: '#fff' }}>
                    <Upload size={12} />
                    {tiene ? 'Reemplazar' : 'Subir documento'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Nota hoja de vida */}
      <div className="p-3 rounded-lg text-xs"
        style={{ background: '#e6f0fb', border: '0.5px solid #b5d4f4', color: '#0B416B' }}>
        <strong>Importante:</strong> la hoja de vida debe estar cargada para que el coordinador
        pueda postularte a una vacante empresarial.
      </div>
    </div>
  )
}