import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { docenteApi } from '../api/docenteApi'

export default function SeguimientosPage() {
  const qc = useQueryClient()
  const [comentarios, setComentarios] = useState({})
  const [editando,    setEditando]    = useState(null)

  const { data: avances = [], isLoading } = useQuery({
    queryKey: ['avances-pendientes-docente'],
    queryFn:  docenteApi.getAvancesPendientes,
  })

  const mutation = useMutation({
    mutationFn: ({ id, comentario }) => docenteApi.comentarAvance(id, comentario),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['avances-pendientes-docente'] })
      toast.success('Comentario registrado y avance marcado como revisado')
      setEditando(null)
    },
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Seguimientos pendientes
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          {avances.length} avance(s) por revisar
        </p>
      </div>

      {avances.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <CheckCircle size={28} className="mx-auto mb-2" style={{ color: '#1a7a4a' }} />
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            No tienes avances pendientes por revisar
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {avances.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              {/* Cabecera */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: '#fde6ea', color: '#D91438' }}>
                      {a.estudianteNombre[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#023859' }}>
                        {a.estudianteNombre}
                      </p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{a.titulo}</p>
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
                  style={{ background: '#fff8e6', color: '#a07010' }}>
                  <Clock size={10} />
                  {new Date(a.fechaEntrega).toLocaleDateString('es-CO')}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-xs leading-relaxed mb-3 pl-9" style={{ color: '#6b7a8d' }}>
                {a.descripcion}
              </p>

              {/* Archivo adjunto */}
              {a.archivoUrl && (
                <a href={a.archivoUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg mb-3 pl-9 ml-9 transition-all hover:bg-gray-50"
                  style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0', maxWidth: 'fit-content' }}>
                  <Download size={13} style={{ color: '#0B416B' }} />
                  <span className="text-[11px] font-medium" style={{ color: '#0B416B' }}>
                    {a.archivoNombre}
                  </span>
                </a>
              )}

              {/* Comentario */}
              <div className="pl-9 pt-3" style={{ borderTop: '0.5px solid #f0f2f5' }}>
                {editando === a.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={comentarios[a.id] ?? ''}
                      onChange={e => setComentarios(prev => ({ ...prev, [a.id]: e.target.value }))}
                      rows={3}
                      placeholder="Escribe tu retroalimentación para el estudiante..."
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                      style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditando(null)}
                        className="h-8 px-3 rounded-lg text-xs font-semibold"
                        style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                        Cancelar
                      </button>
                      <button
                        onClick={() => mutation.mutate({ id: a.id, comentario: comentarios[a.id] })}
                        disabled={!comentarios[a.id]?.trim() || mutation.isPending}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold text-white"
                        style={{ background: !comentarios[a.id]?.trim() || mutation.isPending ? '#a0aab4' : '#D91438' }}>
                        <CheckCircle size={12} />
                        {mutation.isPending ? 'Guardando...' : 'Marcar como revisado'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setEditando(a.id)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    <MessageSquare size={13} /> Agregar comentario y revisar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}