import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { tutorApi } from '../api/tutorApi'
import SeccionNotaTutor from '../components/SeccionNotaTutor'


export default function EncuestaTutorPage() {
  const { id }   = useParams() // id del estudiante
  const navigate = useNavigate()
  const qc       = useQueryClient()
  const [respondiendo, setRespondiendo] = useState(false)
  const [respuestas,   setRespuestas]   = useState({})
  const [observaciones, setObservaciones] = useState('')

  const { data: estudiante, isLoading: loadingEst } = useQuery({
    queryKey: ['estudiante-tutor', id],
    queryFn:  () => tutorApi.getEstudianteDetalle(id),
  })

  const { data: plantilla, isLoading: loadingPlantilla } = useQuery({
    queryKey: ['plantilla-encuesta-tutor'],
    queryFn:  tutorApi.getPlantillaEncuestaTutor,
  })

  const { data: respuestaExistente, isLoading: loadingResp } = useQuery({
    queryKey: ['encuesta-tutor', estudiante?.practicaId],
    queryFn:  () => tutorApi.getEncuestaTutor(estudiante.practicaId),
    enabled:  !!estudiante?.practicaId,
  })

  const mutation = useMutation({
    mutationFn: () => tutorApi.enviarEncuestaTutor(estudiante.practicaId, {
      respuestas: Object.entries(respuestas).map(([preguntaId, valor]) => {
        const pregunta = plantilla.secciones
          .flatMap(s => s.preguntas)
          .find(p => p.id === Number(preguntaId))
        return pregunta?.tipo === 'TEXTO'
          ? { preguntaId: Number(preguntaId), valorTexto: valor }
          : { preguntaId: Number(preguntaId), valorEscala: valor }
      }),
      observaciones,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encuesta-tutor', estudiante.practicaId] })
      qc.invalidateQueries({ queryKey: ['mis-estudiantes-tutor'] })
      toast.success('Encuesta enviada correctamente')
      setRespondiendo(false)
    },
    onError: () => toast.error('Error al enviar la encuesta'),
  })

  if (loadingEst || loadingPlantilla || loadingResp) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )
  if (!estudiante) return null

  const setRespuesta = (preguntaId, valor) =>
    setRespuestas(prev => ({ ...prev, [preguntaId]: valor }))

  const todasLasPreguntas = plantilla.secciones.flatMap(s => s.preguntas)
  const todasRespondidas  = todasLasPreguntas.every(p =>
    respuestas[p.id] !== undefined && respuestas[p.id] !== ''
  )

  const yaRespondida = !!respuestaExistente

  return (
    <div className="flex flex-col gap-4">

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver
      </button>
      {/* Nota final del tutor */}
      <SeccionNotaTutor practicaId={estudiante.practicaId} />

      {/* Estado de la encuesta */}
      {!respondiendo && (
        <div className="bg-white rounded-xl p-6"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: yaRespondida ? '#eaf7f0' : '#e6f0fb' }}>
              {yaRespondida
                ? <CheckCircle size={28} style={{ color: '#1a7a4a' }} />
                : <Clock size={28} style={{ color: '#0B416B' }} />
              }
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold mb-1" style={{ color: '#023859' }}>
                Evaluación de {estudiante.nombre}
              </h2>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                {estudiante.programa} · Práctica #{estudiante.numeroPractica}
              </p>

              {yaRespondida ? (
                <p className="text-xs mt-2" style={{ color: '#1a7a4a' }}>
                  Encuesta completada el{' '}
                  {new Date(respuestaExistente.fechaEnvio).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              ) : (
                <>
                  <p className="text-xs mt-2" style={{ color: '#6b7a8d' }}>
                    Esta evaluación es un requisito para el paz y salvo del estudiante.
                    Una vez enviada, no podrá modificarse.
                  </p>
                  <button
                    onClick={() => setRespondiendo(true)}
                    className="mt-3 h-9 px-5 rounded-lg text-xs font-bold text-white"
                    style={{ background: '#D91438' }}>
                    Responder evaluación
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {respondiendo && !yaRespondida && (
        <div className="bg-white rounded-xl p-5"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="mb-5 pb-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              {plantilla.nombre}
            </p>
            <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
              Evaluando a: {estudiante.nombre}
            </p>
          </div>

          {plantilla.secciones.map(seccion => (
            <div key={seccion.id} className="mb-6">
              <p className="text-xs font-bold mb-4" style={{ color: '#0B416B' }}>
                {seccion.codigo}. {seccion.titulo}
              </p>
              <div className="flex flex-col gap-5">
                {seccion.preguntas.map((p, idx) => (
                  <div key={p.id}>
                    <p className="text-xs font-semibold mb-3" style={{ color: '#023859' }}>
                      {idx + 1}. {p.texto}
                    </p>
                    {p.tipo === 'ESCALA' ? (
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
                        placeholder="Escribe tu observación..."
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                        style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Observaciones generales */}
          <div className="mb-2">
            <p className="text-xs font-semibold mb-2" style={{ color: '#023859' }}>
              Observaciones generales (opcional)
            </p>
            <textarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Comentarios adicionales sobre el desempeño del estudiante..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button onClick={() => { setRespondiendo(false); setRespuestas({}); setObservaciones('') }}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!todasRespondidas || mutation.isPending}
              className="h-9 px-5 rounded-lg text-xs font-bold text-white"
              style={{ background: !todasRespondidas || mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Enviando...' : 'Enviar evaluación'}
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