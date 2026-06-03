import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Upload, ExternalLink, MessageSquare, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { estudianteApi } from '../api/estudianteApi'
import BadgeEstadoAvance from '../components/BadgeEstadoAvance'

const schema = z.object({
  titulo:       z.string().min(3, 'Mínimo 3 caracteres'),
  corteNumero:  z.coerce.number().min(1).max(10),
  descripcion:  z.string().min(10, 'Describe brevemente tu avance'),
})

export default function AvancesPage() {
  const qc             = useQueryClient()
  const fileRef        = useRef(null)
  const [modal, setModal]           = useState(false)
  const [archivoNombre, setArchivo] = useState(null)
  const [corteActivo, setCorteActivo] = useState(null)

  const { data: practica }      = useQuery({ queryKey: ['mi-practica'],  queryFn: estudianteApi.getMiPractica })
  const { data: avances = [], isLoading } = useQuery({ queryKey: ['mis-avances'], queryFn: estudianteApi.getAvances })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { corteNumero: corteActivo ?? 1 },
  })

  const mutation = useMutation({
    mutationFn: (data) => estudianteApi.crearAvance({ ...data, archivo: archivoNombre }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mis-avances'] })
      toast.success('Avance registrado correctamente')
      setModal(false)
      setArchivo(null)
      reset()
    },
    onError: () => toast.error('Error al registrar el avance'),
  })

  // Agrupar avances por corte
  const avancesPorCorte = (practica?.cortes ?? []).map(c => ({
    corte:   c,
    avances: avances.filter(a => a.corteNumero === c.numero),
  }))

  const totalAvances  = avances.length
  const revisados     = avances.filter(a => a.estado === 'REVISADO').length
  const enRevision    = avances.filter(a => a.estado === 'EN_REVISION').length

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"

  return (
    <div className="flex flex-col gap-4">

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total avances',  value: totalAvances, color: '#023859' },
          { label: 'Revisados',      value: revisados,    color: '#1a7a4a' },
          { label: 'En revisión',    value: enRevision,   color: '#a07010' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
              {c.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Mis avances</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              Agrupados por corte — puedes tener múltiples avances por corte
            </p>
          </div>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#D91438' }}>
            <Plus size={13} /> Nuevo avance
          </button>
        </div>

        {/* Avances agrupados por corte */}
        <div className="p-4 flex flex-col gap-4">
          {avancesPorCorte.map(({ corte, avances: av }) => (
            <div key={corte.numero}>
              {/* Encabezado del corte */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: '#023859', color: '#fff' }}>
                  {corte.numero}
                </div>
                <p className="text-xs font-bold" style={{ color: '#023859' }}>{corte.nombre}</p>
                <span className="text-[9px]" style={{ color: '#8a9bb0' }}>
                  Límite: {new Date(corte.fechaLimite).toLocaleDateString('es-CO')}
                </span>
                <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: '#f0f2f5', color: '#6b7a8d' }}>
                  {av.length} entrega(s)
                </span>
              </div>

              {/* Entregas del corte */}
              {av.length === 0 ? (
                <div className="ml-9 p-3 rounded-lg text-xs" style={{ background: '#f7f9fb', color: '#8a9bb0' }}>
                  Sin entregas en este corte
                </div>
              ) : (
                <div className="ml-9 flex flex-col gap-2">
                  {av.map(a => (
                    <div key={a.id} className="p-4 rounded-lg"
                      style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: '#023859' }}>{a.titulo}</p>
                          <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                            Entregado: {a.fechaEntrega
                              ? new Date(a.fechaEntrega).toLocaleDateString('es-CO')
                              : 'Sin entregar'}
                          </p>
                        </div>
                        <BadgeEstadoAvance estado={a.estado} />
                      </div>

                      {/* Descripción del estudiante */}
                      {a.descripcion && (
                        <p className="text-xs mt-1 mb-2 leading-relaxed" style={{ color: '#6b7a8d' }}>
                          {a.descripcion}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Archivo */}
                        {a.archivoUrl && (
                          <a href={a.archivoUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 h-6 px-2 rounded text-[10px] font-medium"
                            style={{ background: '#e6f0fb', color: '#0B416B' }}>
                            <ExternalLink size={10} /> Ver archivo
                          </a>
                        )}

                        {/* Comentario del docente */}
                        {a.comentarioDocente && (
                          <div className="w-full mt-2 p-2 rounded-lg flex gap-2"
                            style={{ background: '#f0faf5', border: '0.5px solid #b6e8cf' }}>
                            <MessageSquare size={12} style={{ color: '#1a7a4a', flexShrink: 0, marginTop: 1 }} />
                            <div>
                              <p className="text-[9px] font-bold mb-0.5" style={{ color: '#1a7a4a' }}>
                                Comentario del docente
                              </p>
                              <p className="text-[10px]" style={{ color: '#1a5c38' }}>
                                {a.comentarioDocente}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal nuevo avance */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,56,89,0.4)' }}>
          <div className="bg-white rounded-xl w-full max-w-md p-6"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold" style={{ color: '#023859' }}>Nuevo avance</p>
              <button onClick={() => { setModal(false); reset(); setArchivo(null) }}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(d => mutation.mutate(d))}
              className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: '#023859' }}>
                  Título del avance
                </label>
                <input {...register('titulo')} className={ic} style={is}
                  placeholder="Ej: Avance semana 6" />
                {errors.titulo && (
                  <p className="text-xs" style={{ color: '#D91438' }}>{errors.titulo.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: '#023859' }}>
                  Corte al que pertenece
                </label>
                <select {...register('corteNumero')} className={ic} style={is}>
                  {(practica?.cortes ?? []).map(c => (
                    <option key={c.numero} value={c.numero}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: '#023859' }}>
                  Descripción del avance
                </label>
                <textarea {...register('descripcion')} rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={is}
                  placeholder="Describe qué actividades realizaste en este período..." />
                {errors.descripcion && (
                  <p className="text-xs" style={{ color: '#D91438' }}>{errors.descripcion.message}</p>
                )}
              </div>

              {/* Subir archivo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: '#023859' }}>
                  Archivo (opcional)
                </label>
                <input ref={fileRef} type="file" className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setArchivo(e.target.files?.[0]?.name ?? null)} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 h-10 px-3 rounded-lg text-xs font-medium"
                  style={{ background: '#f7f9fb', border: '1.5px dashed #dce4ec', color: archivoNombre ? '#1a7a4a' : '#8a9bb0' }}>
                  <Upload size={14} />
                  {archivoNombre ? archivoNombre : 'Seleccionar archivo PDF o Word'}
                </button>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button type="button"
                  onClick={() => { setModal(false); reset(); setArchivo(null) }}
                  className="h-9 px-4 rounded-lg text-xs font-semibold"
                  style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={mutation.isPending}
                  className="h-9 px-4 rounded-lg text-xs font-bold text-white"
                  style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
                  {mutation.isPending ? 'Guardando...' : 'Registrar avance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}