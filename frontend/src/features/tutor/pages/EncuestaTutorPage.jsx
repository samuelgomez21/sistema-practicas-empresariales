import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, Clock, Award, Star } from 'lucide-react'
import { toast } from 'sonner'
import { tutorApi } from '../api/tutorApi'

export default function EncuestaTutorPage() {
  const { id }   = useParams()   // id del estudiante
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const [respondiendo,  setRespondiendo]  = useState(false)
  const [respuestas,    setRespuestas]    = useState({})
  const [observaciones, setObservaciones] = useState('')

  // ── Datos ──────────────────────────────────────────────────────────────────

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

  // ── Enviar encuesta ────────────────────────────────────────────────────────

  const todasLasPreguntas = plantilla?.secciones?.flatMap(s => s.preguntas) ?? []

  const todasRespondidas = todasLasPreguntas.length > 0
    && todasLasPreguntas.every(p => {
      const val = respuestas[p.id]
      if (p.tipo === 'ESCALA')   return val != null && val !== ''
      if (p.tipo === 'TEXTO')    return val != null && String(val).trim() !== ''
      if (p.tipo === 'BOOLEANO') return val === true || val === false
      return false
    })

  const encuestaMutation = useMutation({
    mutationFn: () => tutorApi.enviarEncuestaTutor(estudiante.practicaId, {
      plantillaId: plantilla.id,
      observaciones: observaciones || null,
      respuestas: todasLasPreguntas.map(p => {
        const valor = respuestas[p.id]
        return {
          preguntaId:    p.id,
          valorEscala:   p.tipo === 'ESCALA'   ? Number(valor) : null,
          valorTexto:    p.tipo === 'TEXTO'    ? String(valor) : null,
          valorBooleano: p.tipo === 'BOOLEANO' ? Boolean(valor) : null,
        }
      }),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encuesta-tutor', estudiante.practicaId] })
      qc.invalidateQueries({ queryKey: ['mis-estudiantes-tutor'] })
      toast.success('Evaluación enviada correctamente')
      setRespondiendo(false)
      setRespuestas({})
      setObservaciones('')
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al enviar la evaluación'
    ),
  })

  if (loadingEst || loadingPlantilla || loadingResp) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  if (!estudiante) return (
    <div className="bg-white rounded-xl p-8 text-center"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Estudiante no encontrado</p>
    </div>
  )

  const yaRespondida = !!respuestaExistente

  return (
    <div className="flex flex-col gap-4">

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver
      </button>

      {/* ── Nota del tutor ── */}
      <NotaTutorSection
        practicaId={estudiante.practicaId}
        notaActual={estudiante.notaTutor}
        observacionesActual={estudiante.observacionesNota}
        onSuccess={() => qc.invalidateQueries({ queryKey: ['mis-estudiantes-tutor'] })}
      />

      {/* ── Encuesta ── */}
      {!respondiendo && (
        <div className="bg-white rounded-xl p-6"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: yaRespondida ? '#eaf7f0' : '#e6f0fb' }}>
              {yaRespondida
                ? <CheckCircle size={28} style={{ color: '#1a7a4a' }} />
                : <Clock       size={28} style={{ color: '#0B416B' }} />
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
                <>
                  <p className="text-xs mt-2" style={{ color: '#1a7a4a' }}>
                    Evaluación completada el{' '}
                    {respuestaExistente.fechaEnvio
                      ? new Date(respuestaExistente.fechaEnvio).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })
                      : '—'}
                  </p>
                  {/* Resumen de respuestas */}
                  <ResumenEncuesta respuesta={respuestaExistente} />
                </>
              ) : !plantilla ? (
                <div className="mt-3 p-3 rounded-lg text-xs"
                  style={{ background: '#fff8e6', border: '0.5px solid #f0d080', color: '#a07010' }}>
                  No hay plantilla de evaluación activa. Contacta al coordinador.
                </div>
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
                    Responder evaluación ({todasLasPreguntas.length} preguntas)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Formulario ── */}
      {respondiendo && !yaRespondida && plantilla && (
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

          <div className="flex flex-col gap-8">
            {plantilla.secciones?.map(seccion => (
              <div key={seccion.id}>
                <div className="mb-4 p-3 rounded-lg" style={{ background: '#e6f0fb' }}>
                  <p className="text-xs font-bold" style={{ color: '#0B416B' }}>
                    {seccion.codigo} — {seccion.titulo}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {seccion.preguntas?.map((p, idx) => (
                    <div key={p.id}>
                      <p className="text-xs font-semibold mb-3" style={{ color: '#023859' }}>
                        {idx + 1}. {p.texto}
                        <span className="ml-2 text-[10px] font-normal" style={{ color: '#8a9bb0' }}>
                          ({p.tipo === 'ESCALA' ? 'Escala 1-5'
                            : p.tipo === 'TEXTO' ? 'Texto libre'
                            : 'Sí / No'})
                        </span>
                      </p>

                      {p.tipo === 'ESCALA' && (
                        <>
                          <div className="flex gap-2">
                            {[1,2,3,4,5].map(v => (
                              <button key={v} type="button"
                                onClick={() => setRespuestas(r => ({ ...r, [p.id]: v }))}
                                className="flex-1 h-10 rounded-lg text-xs font-bold transition-all"
                                style={respuestas[p.id] === v
                                  ? { background: '#023859', color: '#fff', border: '1.5px solid #023859' }
                                  : { background: '#f7f9fb', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
                                {v}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[9px]" style={{ color: '#8a9bb0' }}>
                              Muy insatisfecho
                            </span>
                            <span className="text-[9px]" style={{ color: '#8a9bb0' }}>
                              Muy satisfecho
                            </span>
                          </div>
                        </>
                      )}

                      {p.tipo === 'TEXTO' && (
                        <textarea
                          value={respuestas[p.id] ?? ''}
                          onChange={e => setRespuestas(r => ({ ...r, [p.id]: e.target.value }))}
                          rows={3}
                          placeholder="Escribe tu observación..."
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
                        />
                      )}

                      {p.tipo === 'BOOLEANO' && (
                        <div className="flex gap-3">
                          {[{ label: 'Sí', value: true }, { label: 'No', value: false }].map(opt => (
                            <button key={String(opt.value)} type="button"
                              onClick={() => setRespuestas(r => ({ ...r, [p.id]: opt.value }))}
                              className="h-10 px-8 rounded-lg text-sm font-semibold transition-all"
                              style={respuestas[p.id] === opt.value
                                ? { background: '#023859', color: '#fff' }
                                : { background: '#f7f9fb', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Observaciones */}
          <div className="mt-6">
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

          {/* Acciones */}
          <div className="flex items-center justify-between mt-5">
            <p className="text-[10px]"
              style={{ color: todasRespondidas ? '#1a7a4a' : '#8a9bb0' }}>
              {todasRespondidas
                ? '✓ Todas las preguntas respondidas'
                : `${todasLasPreguntas.filter(p => {
                    const v = respuestas[p.id]
                    if (p.tipo === 'ESCALA')   return v != null && v !== ''
                    if (p.tipo === 'TEXTO')    return v != null && String(v).trim() !== ''
                    if (p.tipo === 'BOOLEANO') return v === true || v === false
                    return false
                  }).length} / ${todasLasPreguntas.length} respondidas`
              }
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setRespondiendo(false); setRespuestas({}); setObservaciones('') }}
                className="h-9 px-4 rounded-lg text-xs font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                Cancelar
              </button>
              <button
                onClick={() => encuestaMutation.mutate()}
                disabled={!todasRespondidas || encuestaMutation.isPending}
                className="h-9 px-5 rounded-lg text-xs font-bold text-white"
                style={{
                  background: !todasRespondidas || encuestaMutation.isPending
                    ? '#a0aab4' : '#D91438',
                }}>
                {encuestaMutation.isPending ? 'Enviando...' : 'Enviar evaluación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sección nota del tutor ────────────────────────────────────────────────────

function NotaTutorSection({ practicaId, notaActual, observacionesActual, onSuccess }) {
  const qc = useQueryClient()
  const [editando, setEditando] = useState(false)
  const [nota,     setNota]     = useState('')
  const [obs,      setObs]      = useState('')

  const { data: notaExistente, refetch } = useQuery({
    queryKey: ['nota-tutor', practicaId],
    queryFn:  () => tutorApi.getNotaTutor(practicaId),
    enabled:  !!practicaId,
    initialData: notaActual != null
      ? { nota: notaActual, observaciones: observacionesActual }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: () => tutorApi.registrarNotaTutor(practicaId, {
      nota: Number(nota), observaciones: obs || null,
    }),
    onSuccess: () => {
      refetch()
      onSuccess?.()
      toast.success('Nota registrada correctamente')
      setEditando(false)
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al registrar la nota'
    ),
  })

  const yaRegistrada = !!notaExistente
  const notaValida   = nota !== '' && Number(nota) >= 0 && Number(nota) <= 5
  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="flex items-center gap-2 mb-3 pb-2"
        style={{ borderBottom: '0.5px solid #f0f2f5' }}>
        <Award size={13} style={{ color: '#D91438' }} />
        <p className="text-xs font-bold" style={{ color: '#023859' }}>
          Nota del tutor empresarial
        </p>
      </div>

      {/* Ya registrada */}
      {yaRegistrada && !editando && (
        <div className="flex items-start justify-between p-3 rounded-lg"
          style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle size={13} style={{ color: '#1a7a4a' }} />
              <p className="text-sm font-bold" style={{ color: '#1a7a4a' }}>
                {Number(notaExistente.nota).toFixed(1)} / 5.0
              </p>
            </div>
            {notaExistente.observaciones && (
              <p className="text-xs mt-1.5 italic" style={{ color: '#6b7a8d' }}>
                "{notaExistente.observaciones}"
              </p>
            )}
            {notaExistente.fecha && (
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                Registrada el {new Date(notaExistente.fecha).toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setNota(String(notaExistente.nota))
              setObs(notaExistente.observaciones ?? '')
              setEditando(true)
            }}
            className="text-[10px] font-semibold flex-shrink-0"
            style={{ color: '#0B416B' }}>
            Editar
          </button>
        </div>
      )}

      {/* Sin registrar o editando */}
      {(!yaRegistrada || editando) && (
        <div className="flex flex-col gap-3">
          {!yaRegistrada && (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              Asigna la nota de desempeño del estudiante durante la práctica.
              Este registro es un requisito para el paz y salvo.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5"
                style={{ color: '#023859' }}>
                Nota (0.0 — 5.0) *
              </label>
              <input
                type="number" step="0.1" min="0" max="5"
                value={nota}
                onChange={e => setNota(e.target.value)}
                placeholder="Ej: 4.5"
                className="w-full h-10 px-3 rounded-lg text-sm outline-none"
                style={is} />
              {nota !== '' && !notaValida && (
                <p className="text-[10px] mt-1" style={{ color: '#c0392b' }}>
                  Debe estar entre 0.0 y 5.0
                </p>
              )}
            </div>

            {/* Preview nota */}
            {notaValida && (
              <div className="flex flex-col items-center justify-center rounded-lg"
                style={{
                  background: Number(nota) >= 3 ? '#eaf7f0' : '#fef0f0',
                  border: `0.5px solid ${Number(nota) >= 3 ? '#b6e8cf' : '#f7c1c1'}`,
                }}>
                <p className="text-2xl font-bold"
                  style={{ color: Number(nota) >= 3 ? '#1a7a4a' : '#c0392b' }}>
                  {Number(nota).toFixed(1)}
                </p>
                <p className="text-[10px]"
                  style={{ color: Number(nota) >= 3 ? '#1a7a4a' : '#c0392b' }}>
                  {Number(nota) >= 4.5 ? 'Excelente'
                    : Number(nota) >= 3.5 ? 'Bueno'
                    : Number(nota) >= 3.0 ? 'Aceptable'
                    : 'Insuficiente'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5"
              style={{ color: '#023859' }}>
              Observaciones (opcional)
            </label>
            <textarea
              value={obs}
              onChange={e => setObs(e.target.value)}
              rows={3}
              placeholder="Comentarios sobre el desempeño general del estudiante durante la práctica..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={is} />
          </div>

          <div className="flex gap-2 justify-end">
            {editando && (
              <button onClick={() => { setEditando(false); setNota(''); setObs('') }}
                className="h-9 px-4 rounded-lg text-xs font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                Cancelar
              </button>
            )}
            <button
              onClick={() => mutation.mutate()}
              disabled={!notaValida || mutation.isPending}
              className="h-9 px-5 rounded-lg text-xs font-bold text-white"
              style={{ background: !notaValida || mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending
                ? 'Guardando...'
                : yaRegistrada ? 'Actualizar nota' : 'Registrar nota'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Resumen de encuesta ya respondida ─────────────────────────────────────────

function ResumenEncuesta({ respuesta }) {
  if (!respuesta?.items?.length) return null

  const escalas = respuesta.items.filter(i => i.tipoPregunta === 'ESCALA' && i.valorEscala != null)
  const promedio = escalas.length
    ? (escalas.reduce((a, i) => a + i.valorEscala, 0) / escalas.length).toFixed(1)
    : null

  return (
    <div className="mt-4 pt-4" style={{ borderTop: '0.5px solid #f0f2f5' }}>
      {promedio && (
        <div className="flex items-center gap-2 mb-3 p-3 rounded-lg"
          style={{ background: '#e6f0fb' }}>
          <Star size={14} style={{ color: '#0B416B' }} fill="#0B416B" />
          <p className="text-xs font-bold" style={{ color: '#0B416B' }}>
            Promedio: {promedio} / 5.0
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {respuesta.items.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: '#6b7a8d' }}>
              {item.textoPregunta}
            </p>

            {item.tipoPregunta === 'ESCALA' && (
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className="w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center"
                    style={{
                      background: n <= item.valorEscala ? '#023859' : '#f0f2f5',
                      color:      n <= item.valorEscala ? '#fff'    : '#c0c8d4',
                    }}>
                    {n}
                  </div>
                ))}
              </div>
            )}

            {item.tipoPregunta === 'TEXTO' && (
              <p className="text-xs italic" style={{ color: '#6b7a8d' }}>
                "{item.valorTexto}"
              </p>
            )}

            {item.tipoPregunta === 'BOOLEANO' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={item.valorBooleano
                  ? { background: '#eaf7f0', color: '#1a7a4a' }
                  : { background: '#fef0f0', color: '#c0392b' }}>
                {item.valorBooleano ? 'Sí' : 'No'}
              </span>
            )}
          </div>
        ))}
      </div>

      {respuesta.observaciones && (
        <div className="mt-3 p-3 rounded-lg"
          style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#023859' }}>
            Tus observaciones:
          </p>
          <p className="text-xs italic" style={{ color: '#6b7a8d' }}>
            "{respuesta.observaciones}"
          </p>
        </div>
      )}
    </div>
  )
}