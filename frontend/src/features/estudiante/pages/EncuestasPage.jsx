import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardCheck, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { estudianteApi, PREGUNTAS_ENCUESTA } from '../api/estudianteApi'
import { useState } from 'react'

export default function EncuestasPage() {
  const qc = useQueryClient()
  const [respondiendo, setRespondiendo] = useState(false)
  const [respuestas, setRespuestas]     = useState({})

  const { data: encuesta,  isLoading } = useQuery({
    queryKey: ['mi-encuesta'],
    queryFn:  estudianteApi.getEncuesta,
  })

  const { data: practica } = useQuery({
    queryKey: ['mi-practica'],
    queryFn:  estudianteApi.getMiPractica,
  })

  const mutation = useMutation({
    mutationFn: () => estudianteApi.enviarEncuesta(respuestas),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-encuesta']   })
      qc.invalidateQueries({ queryKey: ['mi-checklist']  })
      toast.success('Encuesta enviada correctamente')
      setRespondiendo(false)
    },
    onError: () => toast.error('Error al enviar la encuesta'),
  })

  const setRespuesta = (id, valor) =>
    setRespuestas(prev => ({ ...prev, [id]: valor }))

  const todasRespondidas = PREGUNTAS_ENCUESTA.every(
    p => respuestas[p.id] !== undefined
  )

  // Determinar si la encuesta está disponible
  // Solo disponible cuando la práctica esté EN_CURSO
  const practicaActiva = practica?.estado === 'EN_CURSO'
  const yaRespondida   = !!encuesta

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Estado de la encuesta */}
      {!respondiendo && (
        <div className="bg-white rounded-xl p-6"
          style={{ border: '0.5px solid #e2e8f0' }}>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: yaRespondida ? '#eaf7f0' : practicaActiva ? '#e6f0fb' : '#f0f2f5' }}>
              {yaRespondida
                ? <CheckCircle size={28} style={{ color: '#1a7a4a' }} />
                : <ClipboardCheck size={28} style={{ color: practicaActiva ? '#0B416B' : '#8a9bb0' }} />
              }
            </div>

            <div className="flex-1">
              <h2 className="text-base font-bold mb-1" style={{ color: '#023859' }}>
                Encuesta de satisfacción de práctica
              </h2>

              {yaRespondida && (
                <>
                  <p className="text-xs" style={{ color: '#1a7a4a' }}>
                    Encuesta completada el{' '}
                    {new Date(encuesta.fechaEnvio).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
                    Gracias por tu respuesta. Esto nos ayuda a mejorar el proceso de prácticas.
                  </p>
                </>
              )}

              {!yaRespondida && practicaActiva && (
                <>
                  <p className="text-xs" style={{ color: '#6b7a8d' }}>
                    La encuesta está disponible. Es un requisito obligatorio para tu paz y salvo.
                  </p>
                  <button
                    onClick={() => setRespondiendo(true)}
                    className="mt-3 h-9 px-5 rounded-lg text-xs font-bold text-white"
                    style={{ background: '#D91438' }}>
                    Responder encuesta
                  </button>
                </>
              )}

              {!yaRespondida && !practicaActiva && (
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={13} style={{ color: '#8a9bb0' }} />
                  <p className="text-xs" style={{ color: '#8a9bb0' }}>
                    La encuesta estará disponible cuando tu práctica esté activa.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formulario de encuesta */}
      {respondiendo && !yaRespondida && (
        <div className="bg-white rounded-xl p-5"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="mb-5 pb-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Encuesta de satisfacción de práctica
            </p>
            <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
              Responde todas las preguntas. Es requisito para tu paz y salvo.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {PREGUNTAS_ENCUESTA.map((p, idx) => (
              <div key={p.id}>
                <p className="text-xs font-semibold mb-3" style={{ color: '#023859' }}>
                  {idx + 1}. {p.texto}
                </p>
                {p.tipo === 'escala' ? (
                  <>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} type="button"
                          onClick={() => setRespuesta(p.id, v)}
                          className="flex-1 h-10 rounded-lg text-xs font-bold transition-all"
                          style={respuestas[p.id] === v
                            ? { background: '#023859', color: '#fff', border: '1.5px solid #023859' }
                            : { background: '#f7f9fb', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
                          }>
                          {v}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px]" style={{ color: '#8a9bb0' }}>Muy insatisfecho</span>
                      <span className="text-[9px]" style={{ color: '#8a9bb0' }}>Muy satisfecho</span>
                    </div>
                  </>
                ) : (
                  <textarea
                    value={respuestas[p.id] ?? ''}
                    onChange={e => setRespuesta(p.id, e.target.value)}
                    rows={3}
                    placeholder="Escribe tu respuesta..."
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                    style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button onClick={() => { setRespondiendo(false); setRespuestas({}) }}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!todasRespondidas || mutation.isPending}
              className="h-9 px-5 rounded-lg text-xs font-bold text-white"
              style={{ background: !todasRespondidas || mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Enviando...' : 'Enviar encuesta'}
            </button>
          </div>

          {!todasRespondidas && (
            <p className="text-[10px] text-right mt-2" style={{ color: '#8a9bb0' }}>
              Debes responder todas las preguntas para poder enviar
            </p>
          )}
        </div>
      )}
    </div>
  )
}