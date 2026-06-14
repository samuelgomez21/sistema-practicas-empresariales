import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowLeft, Building2, User, Calendar,
  CheckCircle, MessageSquare, ExternalLink, Award,
} from 'lucide-react'
import api from '@/lib/axios'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../api/docenteApi'
import BadgeEstadoAvance from '@/features/estudiante/components/BadgeEstadoAvance'

export default function PerfilEstudianteDocentePage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const [comentarios, setComentarios] = useState({})
  const [editando,    setEditando]    = useState(null)

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante-detalle-docente', id],
    queryFn:  () => docenteApi.getEstudianteDetalle(id),
  })

  const { data: avances = [] } = useQuery({
    queryKey: ['avances-practica', estudiante?.practica?.id],
    queryFn:  () => docenteApi.getAvancesPorPractica(estudiante.practica.id),
    enabled:  !!estudiante?.practica?.id,
  })

  const comentarMutation = useMutation({
    mutationFn: ({ avanceId, comentario }) =>
      docenteApi.comentarAvance(avanceId, comentario),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['avances-practica', estudiante?.practica?.id] })
      qc.invalidateQueries({ queryKey: ['avances-pendientes-docente'] })
      toast.success('Comentario registrado — avance marcado como revisado')
      setEditando(null)
    },
    onError: () => toast.error('Error al registrar el comentario'),
  })

  if (isLoading) return (
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

  const cfg      = ESTADO_PRACTICA_LABEL[estudiante.practica?.estado]
    ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO
  const pendientes = avances.filter(a => a.estado === 'PENDIENTE').length

  return (
    <div className="flex flex-col gap-4">

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex items-center gap-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: '#fde6ea', color: '#D91438' }}>
          {estudiante.nombre?.[0] ?? '?'}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            {estudiante.nombre}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.programa} · Semestre {estudiante.semestre}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.email}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
          {pendientes > 0 && (
            <span className="text-[9px] font-bold px-2 py-1 rounded-full"
              style={{ background: '#fff8e6', color: '#a07010' }}>
              {pendientes} avance(s) por revisar
            </span>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Promedio acumulado', value: `${Number(estudiante.promedioAcumulado ?? 0).toFixed(2)} / 5.0` },
          { label: 'Créditos aprobados', value: estudiante.creditosAprobados ?? '—' },
          { label: 'Avances entregados', value: avances.length },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl p-4 text-center"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>{m.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Práctica */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Práctica #{estudiante.practica?.numero ?? '—'}
        </p>
        {!estudiante.practica?.empresaNombre ? (
          <div className="flex items-center gap-2 p-3 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <Building2 size={14} style={{ color: '#8a9bb0' }} />
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              El estudiante aún no ha sido vinculado a una empresa
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={<Building2 size={13} />} label="Empresa"
              value={estudiante.practica.empresaNombre} />
            <InfoItem icon={<User size={13} />} label="Tutor empresarial"
              value={estudiante.practica.tutorNombre ?? '—'} />
            <InfoItem icon={<Calendar size={13} />} label="Fecha de inicio"
              value={estudiante.practica.fechaInicio
                ? new Date(estudiante.practica.fechaInicio).toLocaleDateString('es-CO')
                : '—'} />
            <InfoItem icon={<Calendar size={13} />} label="Fecha fin estimada"
              value={estudiante.practica.fechaFinEstimada
                ? new Date(estudiante.practica.fechaFinEstimada).toLocaleDateString('es-CO')
                : '—'} />
          </div>
        )}
      </div>

      {/* Evaluación docente */}
      {estudiante.practica?.id && (
        <EvaluacionDocente practicaId={estudiante.practica.id} />
      )}

      {/* Avances */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Avances entregados ({avances.length})
        </p>

        {avances.length === 0 ? (
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no ha entregado avances
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {avances.map(a => (
              <div key={a.id} className="p-4 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {a.titulo}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                      {a.fechaEntrega
                        ? new Date(a.fechaEntrega).toLocaleDateString('es-CO', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })
                        : 'Sin fecha'}
                    </p>
                  </div>
                  <BadgeEstadoAvance estado={a.estado} />
                </div>

                {a.descripcion && (
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: '#6b7a8d' }}>
                    {a.descripcion}
                  </p>
                )}

                {a.archivoUrl && (
                  <a href={a.archivoUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-7 px-2 rounded text-[10px] font-semibold mb-2"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    <ExternalLink size={10} /> {a.archivoNombre ?? 'Ver archivo'}
                  </a>
                )}

                {/* Comentario existente */}
                {a.comentarioDocente && (
                  <div className="mt-2 p-2.5 rounded-lg"
                    style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
                    <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#1a7a4a' }}>
                      Tu retroalimentación:
                    </p>
                    <p className="text-[11px] italic leading-relaxed" style={{ color: '#2d6a4f' }}>
                      "{a.comentarioDocente}"
                    </p>
                  </div>
                )}

                {/* Comentar — solo PENDIENTE */}
                {a.estado === 'PENDIENTE' && (
                  <div className="mt-3 pt-2" style={{ borderTop: '0.5px solid #e2e8f0' }}>
                    {editando === a.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={comentarios[a.id] ?? ''}
                          onChange={e => setComentarios(p => ({ ...p, [a.id]: e.target.value }))}
                          rows={3}
                          placeholder="Escribe tu retroalimentación..."
                          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
                          style={{ border: '1.5px solid #dce4ec', background: '#fff', color: '#023859' }}
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditando(null)}
                            className="h-7 px-3 rounded text-[10px] font-semibold"
                            style={{ background: '#f4f6f9', color: '#023859',
                                     border: '0.5px solid #e2e8f0' }}>
                            Cancelar
                          </button>
                          <button
                            onClick={() => comentarMutation.mutate({
                              avanceId:   a.id,
                              comentario: comentarios[a.id],
                            })}
                            disabled={!comentarios[a.id]?.trim() || comentarMutation.isPending}
                            className="flex items-center gap-1.5 h-7 px-3 rounded text-[10px] font-bold text-white"
                            style={{
                              background: !comentarios[a.id]?.trim() || comentarMutation.isPending
                                ? '#a0aab4' : '#D91438',
                            }}>
                            <CheckCircle size={11} />
                            {comentarMutation.isPending ? 'Guardando...' : 'Marcar revisado'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setEditando(a.id)}
                        className="flex items-center gap-1.5 h-7 px-3 rounded text-[10px] font-semibold"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        <MessageSquare size={11} /> Comentar y revisar
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sección evaluación ──────────────────────────────────────────────────────────

function EvaluacionDocente({ practicaId }) {
  const [nota, setNota] = useState('')
  const [obs,  setObs]  = useState('')
  const [open, setOpen] = useState(false)

  const { data: evaluacion, refetch } = useQuery({
    queryKey: ['evaluacion-practica', practicaId],
    queryFn:  async () => {
      try {
        const { data } = await api.get(`/evaluaciones/practica/${practicaId}`)
        return data
      } catch {
        return null   // 404 = sin evaluación aún, no es error
      }
    },
    enabled: !!practicaId,
  })

  const mutation = useMutation({
    mutationFn: () => api.post(`/evaluaciones/docente/practica/${practicaId}`, {
      notaDocente:          Number(nota),
      observacionesDocente: obs || null,
    }),
    onSuccess: () => {
      refetch()
      toast.success('Nota registrada correctamente')
      setOpen(false)
      setNota('')
      setObs('')
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al registrar la nota'
    ),
  })

  const notaValida = nota !== '' && Number(nota) >= 0 && Number(nota) <= 5

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-3 pb-2 flex items-center gap-2"
        style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
        <Award size={13} style={{ color: '#D91438' }} />
        Evaluación docente
      </p>

      {/* Ya tiene nota registrada */}
      {evaluacion?.notaDocente != null ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nota docente', value: Number(evaluacion.notaDocente).toFixed(2),
                bg: '#e6f0fb', color: '#0B416B' },
              { label: 'Nota tutor',   value: evaluacion.notaTutor
                  ? Number(evaluacion.notaTutor).toFixed(2) : '—',
                bg: '#fff8e6', color: '#a07010' },
              { label: 'Nota final',   value: evaluacion.notaFinal
                  ? Number(evaluacion.notaFinal).toFixed(2) : 'Pendiente',
                bg: evaluacion.notaFinal ? '#eaf7f0' : '#f0f2f5',
                color: evaluacion.notaFinal ? '#1a7a4a' : '#8a9bb0' },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-lg text-center"
                style={{ background: m.bg }}>
                <p className="text-base font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: m.color }}>{m.label}</p>
              </div>
            ))}
          </div>

          {evaluacion.observacionesDocente && (
            <div className="p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#023859' }}>
                Tus observaciones:
              </p>
              <p className="text-xs italic leading-relaxed" style={{ color: '#6b7a8d' }}>
                "{evaluacion.observacionesDocente}"
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            {evaluacion.fechaEvaluacionDocente && (
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                Registrado el {new Date(evaluacion.fechaEvaluacionDocente)
                  .toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
              </p>
            )}
            {evaluacion.resultado && (
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{
                  background: evaluacion.resultado === 'APROBADO' ? '#eaf7f0' : '#fef0f0',
                  color:      evaluacion.resultado === 'APROBADO' ? '#1a7a4a' : '#c0392b',
                }}>
                {evaluacion.resultado === 'APROBADO' ? 'Aprobado' : 'Reprobado'}
              </span>
            )}
          </div>
        </div>

      /* Formulario para registrar nota */
      ) : open ? (
        <div className="flex flex-col gap-3">
          <div className="p-3 rounded-lg"
            style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#a07010' }}>
              Importante
            </p>
            <p className="text-[10px]" style={{ color: '#6b7a8d' }}>
              La nota quedará registrada permanentemente. Asegúrate de que sea la
              calificación final del estudiante en la práctica.
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5"
              style={{ color: '#023859' }}>
              Nota final docente (0.0 — 5.0) *
            </label>
            <input
              type="number"
              min="0" max="5" step="0.1"
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="Ej: 4.2"
              className="w-full h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
            {nota !== '' && !notaValida && (
              <p className="text-[10px] mt-1" style={{ color: '#c0392b' }}>
                La nota debe estar entre 0.0 y 5.0
              </p>
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
              placeholder="Observaciones sobre el desempeño del estudiante durante la práctica..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setOpen(false); setNota(''); setObs('') }}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859',
                       border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!notaValida || mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: !notaValida || mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Registrando...' : 'Registrar nota'}
            </button>
          </div>
        </div>

      /* Sin nota — botón para abrir formulario */
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1 p-3 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-semibold" style={{ color: '#6b7a8d' }}>
              Nota docente pendiente
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              Registra la calificación final cuando el estudiante termine la práctica
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white flex-shrink-0"
            style={{ background: '#D91438' }}>
            Registrar nota
          </button>
        </div>
      )}
    </div>
  )
}

// ── Helper ──────────────────────────────────────────────────────────────────────

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5" style={{ color: '#8a9bb0' }}>{icon}</div>
      <div>
        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{label}</p>
        <p className="text-xs font-medium" style={{ color: '#023859' }}>{value}</p>
      </div>
    </div>
  )
}