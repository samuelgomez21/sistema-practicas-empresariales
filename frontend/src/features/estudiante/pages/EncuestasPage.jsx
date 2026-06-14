import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardCheck, CheckCircle, Clock, Star } from 'lucide-react'
import { toast } from 'sonner'
import { estudianteApi } from '../api/estudianteApi'

export default function EncuestasPage() {
  const qc = useQueryClient()
  const [respondiendo,   setRespondiendo]   = useState(false)
  const [respuestas,     setRespuestas]     = useState({})
  const [observaciones,  setObservaciones]  = useState('')
  const [nombreProyecto, setNombreProyecto] = useState('')
  const [postularProyecto, setPostularProyecto] = useState(false)

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: practica } = useQuery({
    queryKey: ['mi-practica'],
    queryFn:  estudianteApi.getMiPractica,
  })

  const { data: encuesta, isLoading: loadingEncuesta } = useQuery({
    queryKey: ['mi-encuesta'],
    queryFn:  estudianteApi.getEncuesta,
  })

  const { data: plantilla, isLoading: loadingPlantilla } = useQuery({
    queryKey: ['plantilla-encuesta-estudiante'],
    queryFn:  estudianteApi.getPlantillaEncuesta,
    enabled:  !encuesta, // solo cargar si aún no ha respondido
  })

  // ── Lógica derivada ────────────────────────────────────────────────────────

  const todasLasPreguntas = plantilla?.secciones?.flatMap(s => s.preguntas) ?? []

  const todasRespondidas = todasLasPreguntas.length > 0
    && todasLasPreguntas.every(p => {
      const val = respuestas[p.id]
      if (p.tipo === 'ESCALA')   return val != null && val !== ''
      if (p.tipo === 'TEXTO')    return val != null && String(val).trim() !== ''
      if (p.tipo === 'BOOLEANO') return val === true || val === false
      return false
    })

  // ── Envío ──────────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: () => estudianteApi.enviarEncuesta({
      plantillaId: plantilla.id,
      observaciones: observaciones || null,
      nombreProyecto: nombreProyecto || null,
      postularProyecto,
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
      qc.invalidateQueries({ queryKey: ['mi-encuesta'] })
      qc.invalidateQueries({ queryKey: ['mi-checklist'] })
      toast.success('Encuesta enviada correctamente')
      setRespondiendo(false)
      setRespuestas({})
      setObservaciones('')
      setNombreProyecto('')
      setPostularProyecto(false)
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al enviar la encuesta'
    ),
  })

  // ── Estados ────────────────────────────────────────────────────────────────

  const practicaActiva = practica?.estado === 'EN_PRACTICA'
  const yaRespondida   = !!encuesta
  const isLoading      = loadingEncuesta || loadingPlantilla

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* ── Card de estado ── */}
      {!respondiendo && (
        <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: yaRespondida   ? '#eaf7f0'
                  : practicaActiva ? '#e6f0fb'
                  : '#f0f2f5',
              }}>
              {yaRespondida
                ? <CheckCircle size={28} style={{ color: '#1a7a4a' }} />
                : <ClipboardCheck size={28}
                    style={{ color: practicaActiva ? '#0B416B' : '#8a9bb0' }} />
              }
            </div>

            <div className="flex-1">
              <h2 className="text-base font-bold mb-1" style={{ color: '#023859' }}>
                Encuesta de satisfacción de práctica
              </h2>

              {/* Ya respondida */}
              {yaRespondida && (
                <>
                  <p className="text-xs" style={{ color: '#1a7a4a' }}>
                    Completada el{' '}
                    {encuesta.fechaEnvio
                      ? new Date(encuesta.fechaEnvio).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })
                      : '—'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
                    Gracias por tu respuesta. Esto nos ayuda a mejorar el proceso de prácticas.
                  </p>
                  {/* Resumen de lo que respondió */}
                  <ResumenRespuesta encuesta={encuesta} />
                </>
              )}

              {/* Práctica activa, sin responder */}
              {!yaRespondida && practicaActiva && (
                <>
                  <p className="text-xs" style={{ color: '#6b7a8d' }}>
                    La encuesta está disponible. Es requisito obligatorio para tu paz y salvo.
                  </p>
                  {!plantilla ? (
                    <div className="mt-3 p-3 rounded-lg text-xs"
                      style={{ background: '#fff8e6', border: '0.5px solid #f0d080', color: '#a07010' }}>
                      No hay plantilla activa. Contacta al coordinador.
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondiendo(true)}
                      className="mt-3 h-9 px-5 rounded-lg text-xs font-bold text-white"
                      style={{ background: '#D91438' }}>
                      Responder encuesta ({todasLasPreguntas.length} preguntas)
                    </button>
                  )}
                </>
              )}

              {/* Práctica no activa */}
              {!yaRespondida && !practicaActiva && (
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={13} style={{ color: '#8a9bb0' }} />
                  <p className="text-xs" style={{ color: '#8a9bb0' }}>
                    La encuesta estará disponible cuando tu práctica esté en estado EN_PRACTICA.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Formulario ── */}
      {respondiendo && !yaRespondida && plantilla && (
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>

          {/* Header del formulario */}
          <div className="mb-5 pb-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              {plantilla.nombre}
            </p>
            <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
              Versión {plantilla.version} · Responde todas las preguntas antes de enviar
            </p>
          </div>

          {/* Secciones y preguntas */}
          <div className="flex flex-col gap-8">
            {plantilla.secciones?.map(seccion => (
              <div key={seccion.id}>

                {/* Header de sección */}
                <div className="mb-4 p-3 rounded-lg" style={{ background: '#e6f0fb' }}>
                  <p className="text-xs font-bold" style={{ color: '#0B416B' }}>
                    {seccion.codigo} — {seccion.titulo}
                  </p>
                </div>

                {/* Preguntas */}
                <div className="flex flex-col gap-6">
                  {seccion.preguntas?.map((p, idx) => (
                    <PreguntaInput
                      key={p.id}
                      pregunta={p}
                      indice={idx + 1}
                      valor={respuestas[p.id]}
                      onChange={val => setRespuestas(r => ({ ...r, [p.id]: val }))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Proyecto de semillero */}
          <div className="mt-6 pt-5" style={{ borderTop: '0.5px solid #f0f2f5' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#023859' }}>
              Proyecto de semillero (opcional)
            </p>
            <div className="flex items-center gap-3 mb-3">
              {[
                { label: 'Sí, quiero postular un proyecto', value: true  },
                { label: 'No',                               value: false },
              ].map(opt => (
                <button key={String(opt.value)} type="button"
                  onClick={() => setPostularProyecto(opt.value)}
                  className="h-9 px-4 rounded-lg text-xs font-semibold transition-all"
                  style={postularProyecto === opt.value
                    ? { background: '#023859', color: '#fff' }
                    : { background: '#f7f9fb', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {postularProyecto && (
              <input
                value={nombreProyecto}
                onChange={e => setNombreProyecto(e.target.value)}
                placeholder="Nombre del proyecto que deseas postular..."
                className="w-full h-10 px-3 rounded-lg text-sm outline-none"
                style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
              />
            )}
          </div>

          {/* Observaciones generales */}
          <div className="mt-5">
            <p className="text-xs font-semibold mb-2" style={{ color: '#023859' }}>
              Observaciones generales (opcional)
            </p>
            <textarea
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={3}
              placeholder="¿Algún comentario adicional sobre tu experiencia?"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between mt-5">
            <p className="text-[10px]" style={{ color: todasRespondidas ? '#1a7a4a' : '#8a9bb0' }}>
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
                onClick={() => { setRespondiendo(false); setRespuestas({}) }}
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
          </div>
        </div>
      )}
    </div>
  )
}

// ── Componente de pregunta ────────────────────────────────────────────────────

function PreguntaInput({ pregunta: p, indice, valor, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-3" style={{ color: '#023859' }}>
        {indice}. {p.texto}
        <span className="ml-2 text-[10px] font-normal" style={{ color: '#8a9bb0' }}>
          ({p.tipo === 'ESCALA' ? 'Escala 1-5' : p.tipo === 'TEXTO' ? 'Texto libre' : 'Sí / No'})
        </span>
      </p>

      {/* Escala */}
      {p.tipo === 'ESCALA' && (
        <>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(v => (
              <button key={v} type="button"
                onClick={() => onChange(v)}
                className="flex-1 h-12 rounded-lg text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5"
                style={valor === v
                  ? { background: '#023859', color: '#fff', border: '1.5px solid #023859' }
                  : { background: '#f7f9fb', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
                {v}
                {valor === v && <Star size={8} fill="currentColor" />}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[9px]" style={{ color: '#8a9bb0' }}>Muy insatisfecho</span>
            <span className="text-[9px]" style={{ color: '#8a9bb0' }}>Muy satisfecho</span>
          </div>
        </>
      )}

      {/* Texto */}
      {p.tipo === 'TEXTO' && (
        <textarea
          value={valor ?? ''}
          onChange={e => onChange(e.target.value)}
          rows={3}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
        />
      )}

      {/* Booleano */}
      {p.tipo === 'BOOLEANO' && (
        <div className="flex gap-3">
          {[{ label: 'Sí', value: true }, { label: 'No', value: false }].map(opt => (
            <button key={String(opt.value)} type="button"
              onClick={() => onChange(opt.value)}
              className="h-10 px-8 rounded-lg text-sm font-semibold transition-all"
              style={valor === opt.value
                ? { background: '#023859', color: '#fff' }
                : { background: '#f7f9fb', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Resumen de respuesta ya enviada ──────────────────────────────────────────

function ResumenRespuesta({ encuesta }) {
  if (!encuesta?.items?.length) return null

  const escalas = encuesta.items.filter(i => i.tipoPregunta === 'ESCALA' && i.valorEscala != null)
  const promedio = escalas.length
    ? (escalas.reduce((a, i) => a + i.valorEscala, 0) / escalas.length).toFixed(1)
    : null

  return (
    <div className="mt-4 pt-4" style={{ borderTop: '0.5px solid #f0f2f5' }}>
      <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
        style={{ color: '#8a9bb0' }}>
        Tu respuesta
      </p>

      {/* Promedio */}
      {promedio && (
        <div className="flex items-center gap-2 mb-3 p-3 rounded-lg"
          style={{ background: '#e6f0fb' }}>
          <Star size={14} style={{ color: '#0B416B' }} fill="#0B416B" />
          <p className="text-xs font-bold" style={{ color: '#0B416B' }}>
            Promedio general: {promedio} / 5.0
          </p>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-2">
        {encuesta.items.map((item, idx) => (
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
                <span className="text-[10px] font-bold ml-1 self-center"
                  style={{ color: '#023859' }}>
                  ({item.valorEscala}/5)
                </span>
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

      {/* Observaciones */}
      {encuesta.observaciones && (
        <div className="mt-3 p-3 rounded-lg"
          style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#023859' }}>
            Tus observaciones:
          </p>
          <p className="text-xs italic leading-relaxed" style={{ color: '#6b7a8d' }}>
            "{encuesta.observaciones}"
          </p>
        </div>
      )}
    </div>
  )
}