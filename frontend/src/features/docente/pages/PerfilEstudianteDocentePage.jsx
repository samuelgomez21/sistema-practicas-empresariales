import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Building2, User, Calendar, CheckCircle, MessageSquare, ExternalLink } from 'lucide-react'
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

  const { data: evaluacion } = useQuery({
    queryKey: ['evaluacion-practica', estudiante?.practica?.id],
    queryFn:  () => docenteApi.getEvaluacion(estudiante.practica.id),
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
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )
  if (!estudiante) return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Estudiante no encontrado</p>
    </div>
  )

  const cfg = ESTADO_PRACTICA_LABEL[estudiante.practica?.estado]
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

      {/* Evaluación */}
      {evaluacion && (
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Evaluación
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nota docente',  value: evaluacion.notaDocente  ?? '—' },
              { label: 'Nota tutor',    value: evaluacion.notaTutor    ?? '—' },
              { label: 'Nota final',    value: evaluacion.notaFinal    ?? '—' },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-lg text-center"
                style={{ background: '#f7f9fb' }}>
                <p className="text-sm font-bold" style={{ color: '#023859' }}>{m.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
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

                {/* Cabecera del avance */}
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

                {/* Descripción */}
                {a.descripcion && (
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: '#6b7a8d' }}>
                    {a.descripcion}
                  </p>
                )}

                {/* Archivo */}
                {a.archivoUrl && (
                  <a href={a.archivoUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-7 px-2 rounded text-[10px] font-semibold mb-2"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    <ExternalLink size={10} /> {a.archivoNombre ?? 'Ver archivo'}
                  </a>
                )}

                {/* Comentario existente */}
                {a.comentarioDocente && (
                  <div className="mt-2 p-2 rounded-lg"
                    style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
                    <p className="text-[10px] font-semibold mb-0.5"
                      style={{ color: '#1a7a4a' }}>
                      Tu comentario:
                    </p>
                    <p className="text-[10px] italic" style={{ color: '#2d6a4f' }}>
                      "{a.comentarioDocente}"
                    </p>
                  </div>
                )}

                {/* Botón o formulario comentar */}
                {a.estado === 'PENDIENTE' && (
                  <div className="mt-2 pt-2" style={{ borderTop: '0.5px solid #e2e8f0' }}>
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
                              avanceId: a.id,
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