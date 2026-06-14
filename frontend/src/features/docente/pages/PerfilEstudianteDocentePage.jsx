import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowLeft, Building2, User, Calendar,
  CheckCircle, MessageSquare, ExternalLink, Award,
  FileText, ThumbsUp, ThumbsDown,
} from 'lucide-react'
import api from '@/lib/axios'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../api/docenteApi'
import BadgeEstadoAvance from '@/features/estudiante/components/BadgeEstadoAvance'

// ── Categorías de documentos que el docente puede aprobar ─────────────────────
const CATEGORIAS_DOC = [
  { key: 'ARL',              label: 'ARL',              obligatorio: true  },
  { key: 'PLANEADOR',        label: 'Planeador',        obligatorio: true  },
  { key: 'INFORME_EJECUTIVO', label: 'Informe ejecutivo', obligatorio: true },
  { key: 'PRESENTACION',     label: 'Presentación',     obligatorio: true  },
  { key: 'DOCUMENTO_FINAL',  label: 'Documento final',  obligatorio: false },
]

// ── Página principal ──────────────────────────────────────────────────────────

export default function PerfilEstudianteDocentePage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const [comentarios, setComentarios] = useState({})
  const [editando,    setEditando]    = useState(null)

  // ── Datos ──────────────────────────────────────────────────────────────────

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante-detalle-docente', id],
    queryFn:  () => docenteApi.getEstudianteDetalle(id),
  })

  const { data: avances = [] } = useQuery({
    queryKey: ['avances-practica', estudiante?.practica?.id],
    queryFn:  () => docenteApi.getAvancesPorPractica(estudiante.practica.id),
    enabled:  !!estudiante?.practica?.id,
  })

  // Documentos del estudiante para esta práctica
  const { data: documentos = [], refetch: refetchDocs } = useQuery({
    queryKey: ['documentos-practica-docente', estudiante?.practica?.id],
    queryFn:  async () => {
      const { data } = await api.get(`/practicas/${estudiante.practica.id}/documentos`)
      return data ?? []
    },
    enabled: !!estudiante?.practica?.id,
  })

  // ── Comentar avance ────────────────────────────────────────────────────────

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

  // ── Aprobar documento ──────────────────────────────────────────────────────

  const aprobarDocMutation = useMutation({
    mutationFn: (documentoId) =>
      api.patch(`/practicas/${estudiante.practica.id}/documentos/${documentoId}/aprobar`),
    onSuccess: () => {
      refetchDocs()
      toast.success('Documento aprobado correctamente')
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al aprobar el documento'
    ),
  })

  // ── Render ─────────────────────────────────────────────────────────────────

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

  const cfg        = ESTADO_PRACTICA_LABEL[estudiante.practica?.estado]
    ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO
  const pendientes = avances.filter(a => a.estado === 'PENDIENTE').length

  return (
    <div className="flex flex-col gap-4">

      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver
      </button>

      {/* ── Header ── */}
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

      {/* ── Métricas ── */}
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

      {/* ── Práctica ── */}
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

      {/* ── Documentos del estudiante — el docente los aprueba ── */}
      {estudiante.practica?.id && (
        <DocumentosDocente
          practicaId={estudiante.practica.id}
          documentos={documentos}
          onAprobar={(docId) => aprobarDocMutation.mutate(docId)}
          aprobando={aprobarDocMutation.isPending}
        />
      )}

      {/* ── Evaluación + nota final ── */}
      {estudiante.practica?.id && (
        <EvaluacionDocente practicaId={estudiante.practica.id} />
      )}

      {/* ── Avances ── */}
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

// ── Sección documentos para aprobar ──────────────────────────────────────────

function DocumentosDocente({ practicaId, documentos, onAprobar, aprobando }) {
  // Agrupar por categoría — puede haber varios del mismo tipo, tomamos el más reciente
  const docsPorCategoria = {}
  documentos.forEach(d => {
    const key = d.categoria?.toUpperCase()
    if (!docsPorCategoria[key] || new Date(d.fechaCarga) > new Date(docsPorCategoria[key].fechaCarga)) {
      docsPorCategoria[key] = d
    }
  })

  const totalObligatorios = CATEGORIAS_DOC.filter(c => c.obligatorio).length
  const aprobados         = CATEGORIAS_DOC.filter(c => c.obligatorio
    && docsPorCategoria[c.key]?.estado === 'APROBADO').length

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="flex items-center justify-between mb-3 pb-2"
        style={{ borderBottom: '0.5px solid #f0f2f5' }}>
        <p className="text-xs font-bold flex items-center gap-2" style={{ color: '#023859' }}>
          <FileText size={13} style={{ color: '#D91438' }} />
          Documentos del estudiante
        </p>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
          style={aprobados === totalObligatorios
            ? { background: '#eaf7f0', color: '#1a7a4a' }
            : { background: '#fff8e6', color: '#a07010' }}>
          {aprobados}/{totalObligatorios} aprobados
        </span>
      </div>

      {documentos.length === 0 ? (
        <div className="p-3 rounded-lg text-center"
          style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            El estudiante aún no ha cargado documentos
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {CATEGORIAS_DOC.map(cfg => {
            const doc = docsPorCategoria[cfg.key]
            const aprobado  = doc?.estado === 'APROBADO'
            const pendiente = doc && !aprobado

            return (
              <div key={cfg.key} className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: aprobado  ? '#f0faf4'
                    : pendiente ? '#f7f9fb'
                    : '#fafafa',
                  border: aprobado  ? '0.5px solid #b6e8cf'
                    : pendiente ? '0.5px solid #e2e8f0'
                    : '0.5px dashed #e2e8f0',
                }}>

                {/* Icono estado */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: aprobado ? '#eaf7f0' : pendiente ? '#e6f0fb' : '#f0f2f5' }}>
                  <FileText size={14}
                    style={{ color: aprobado ? '#1a7a4a' : pendiente ? '#0B416B' : '#8a9bb0' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                      {cfg.label}
                    </p>
                    {cfg.obligatorio && (
                      <span className="text-[8px] font-bold px-1 rounded"
                        style={{ background: '#fef0f0', color: '#c0392b' }}>
                        Req.
                      </span>
                    )}
                  </div>
                  {doc ? (
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {aprobado ? '✓ Aprobado'
                        : `Pendiente de revisión · ${doc.nombre ?? cfg.label}`}
                      {doc.fechaCarga && ` · ${new Date(doc.fechaCarga)
                        .toLocaleDateString('es-CO')}`}
                    </p>
                  ) : (
                    <p className="text-[10px]" style={{ color: '#c0c8d4' }}>
                      No cargado
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {doc?.url && (
                    <a href={doc.url} target="_blank" rel="noreferrer"
                      className="h-7 px-2 rounded text-[10px] font-semibold flex items-center gap-1"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      <ExternalLink size={10} /> Ver
                    </a>
                  )}

                  {/* Botón aprobar — solo si está pendiente */}
                  {pendiente && (
                    <button
                      onClick={() => onAprobar(doc.id)}
                      disabled={aprobando}
                      className="h-7 px-2 rounded text-[10px] font-bold text-white flex items-center gap-1"
                      style={{ background: aprobando ? '#a0aab4' : '#1a7a4a' }}>
                      <ThumbsUp size={10} />
                      {aprobando ? '...' : 'Aprobar'}
                    </button>
                  )}

                  {aprobado && (
                    <span className="h-7 px-2 rounded text-[10px] font-semibold flex items-center gap-1"
                      style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                      <CheckCircle size={10} /> Aprobado
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Sección evaluación + nota final ──────────────────────────────────────────

function EvaluacionDocente({ practicaId }) {
  const [nota,  setNota]  = useState('')
  const [obs,   setObs]   = useState('')
  const [notaFinal,  setNotaFinal]  = useState('')
  const [obsFinal,   setObsFinal]   = useState('')
  const [openDocente, setOpenDocente] = useState(false)
  const [openFinal,   setOpenFinal]   = useState(false)

  const { data: evaluacion, refetch } = useQuery({
    queryKey: ['evaluacion-practica', practicaId],
    queryFn:  async () => {
      try {
        const { data } = await api.get(`/evaluaciones/practica/${practicaId}`)
        return data
      } catch {
        return null
      }
    },
    enabled: !!practicaId,
  })

  // Registrar nota del docente
  const mutationDocente = useMutation({
    mutationFn: () => api.post(`/evaluaciones/docente/practica/${practicaId}`, {
      notaDocente:          Number(nota),
      observacionesDocente: obs || null,
    }),
    onSuccess: () => {
      refetch()
      toast.success('Nota del docente registrada correctamente')
      setOpenDocente(false)
      setNota(''); setObs('')
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al registrar la nota'
    ),
  })

  // Registrar nota final (también desde el docente)
  const mutationFinal = useMutation({
    mutationFn: () => api.post(`/evaluaciones/coordinador/practica/${practicaId}`, {
      notaFinal:            Number(notaFinal),
      observacionesFinales: obsFinal || null,
    }),
    onSuccess: () => {
      refetch()
      toast.success('Nota final registrada correctamente')
      setOpenFinal(false)
      setNotaFinal(''); setObsFinal('')
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al registrar la nota final'
    ),
  })

  const notaDocenteValida = nota !== '' && Number(nota) >= 0 && Number(nota) <= 5
  const notaFinalValida   = notaFinal !== '' && Number(notaFinal) >= 0 && Number(notaFinal) <= 5

  const tieneNotaDocente = evaluacion?.notaDocente != null
  const tieneNotaTutor   = evaluacion?.notaTutor   != null
  const tieneNotaFinal   = evaluacion?.notaFinal   != null

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-3 pb-2 flex items-center gap-2"
        style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
        <Award size={13} style={{ color: '#D91438' }} />
        Evaluación y nota final
      </p>

      {/* Grid de notas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Nota docente', value: evaluacion?.notaDocente,
            bg: '#e6f0fb', color: '#0B416B' },
          { label: 'Nota tutor',   value: evaluacion?.notaTutor,
            bg: '#fff8e6', color: '#a07010' },
          { label: 'Nota final',   value: evaluacion?.notaFinal,
            bg: tieneNotaFinal ? '#eaf7f0' : '#f0f2f5',
            color: tieneNotaFinal ? '#1a7a4a' : '#8a9bb0' },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-lg text-center"
            style={{ background: m.bg }}>
            <p className="text-base font-bold" style={{ color: m.color }}>
              {m.value != null ? Number(m.value).toFixed(2) : '—'}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: m.color }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Resultado */}
      {evaluacion?.resultado && (
        <div className="mb-4 p-3 rounded-lg text-center"
          style={{
            background: evaluacion.resultado === 'APROBADO' ? '#eaf7f0' : '#fef0f0',
            border: `0.5px solid ${evaluacion.resultado === 'APROBADO' ? '#b6e8cf' : '#f7c1c1'}`,
          }}>
          <p className="text-xs font-bold"
            style={{ color: evaluacion.resultado === 'APROBADO' ? '#1a7a4a' : '#c0392b' }}>
            Resultado: {evaluacion.resultado === 'APROBADO' ? 'Aprobado ✓' : 'Reprobado ✗'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">

        {/* ── Nota del docente ── */}
        {!tieneNotaDocente && (
          <div>
            {openDocente ? (
              <FormNota
                titulo="Registrar nota del docente"
                nota={nota}
                obs={obs}
                onNota={setNota}
                onObs={setObs}
                onGuardar={() => mutationDocente.mutate()}
                onCancelar={() => { setOpenDocente(false); setNota(''); setObs('') }}
                guardando={mutationDocente.isPending}
                valida={notaDocenteValida}
              />
            ) : (
              <button
                onClick={() => setOpenDocente(true)}
                className="w-full flex items-center justify-between h-10 px-4 rounded-lg text-xs font-semibold"
                style={{ background: '#e6f0fb', color: '#0B416B', border: '0.5px solid #c5d9f0' }}>
                <span>Registrar mi nota de docente</span>
                <Award size={13} />
              </button>
            )}
          </div>
        )}

        {tieneNotaDocente && evaluacion?.observacionesDocente && (
          <div className="p-3 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#023859' }}>
              Tus observaciones:
            </p>
            <p className="text-xs italic" style={{ color: '#6b7a8d' }}>
              "{evaluacion.observacionesDocente}"
            </p>
          </div>
        )}

        {/* ── Nota final ── */}
        {tieneNotaDocente && tieneNotaTutor && !tieneNotaFinal && (
          <div>
            <div className="p-3 rounded-lg mb-2"
              style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
              <p className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                ✓ Nota docente y tutor registradas — puedes registrar la nota final
              </p>
            </div>
            {openFinal ? (
              <FormNota
                titulo="Registrar nota final"
                nota={notaFinal}
                obs={obsFinal}
                onNota={setNotaFinal}
                onObs={setObsFinal}
                onGuardar={() => mutationFinal.mutate()}
                onCancelar={() => { setOpenFinal(false); setNotaFinal(''); setObsFinal('') }}
                guardando={mutationFinal.isPending}
                valida={notaFinalValida}
                aviso="La nota final cerrará la práctica y determinará si el estudiante aprueba o reprueba."
              />
            ) : (
              <button
                onClick={() => setOpenFinal(true)}
                className="w-full flex items-center justify-between h-10 px-4 rounded-lg text-xs font-bold text-white"
                style={{ background: '#D91438' }}>
                <span>Registrar nota final</span>
                <Award size={13} />
              </button>
            )}
          </div>
        )}

        {/* Falta nota del tutor */}
        {tieneNotaDocente && !tieneNotaTutor && !tieneNotaFinal && (
          <div className="p-3 rounded-lg"
            style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
            <p className="text-[10px] font-semibold" style={{ color: '#a07010' }}>
              Esperando nota del tutor empresarial
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#6b7a8d' }}>
              El tutor debe registrar su nota antes de poder registrar la nota final.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Formulario de nota reutilizable ──────────────────────────────────────────

function FormNota({ titulo, nota, obs, onNota, onObs, onGuardar, onCancelar, guardando, valida, aviso }) {
  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }

  return (
    <div className="p-4 rounded-lg flex flex-col gap-3"
      style={{ background: '#f7f9fb', border: '0.5px solid #dce4ec' }}>
      <p className="text-[10px] font-bold uppercase tracking-wide"
        style={{ color: '#023859' }}>
        {titulo}
      </p>

      {aviso && (
        <div className="p-2.5 rounded-lg"
          style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
          <p className="text-[10px]" style={{ color: '#6b7a8d' }}>{aviso}</p>
        </div>
      )}

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wide block mb-1"
          style={{ color: '#023859' }}>
          Nota (0.0 — 5.0) *
        </label>
        <input
          type="number" min="0" max="5" step="0.1"
          value={nota}
          onChange={e => onNota(e.target.value)}
          placeholder="Ej: 4.2"
          className="w-full h-10 px-3 rounded-lg text-sm outline-none"
          style={is} />
        {nota !== '' && !valida && (
          <p className="text-[10px] mt-1" style={{ color: '#c0392b' }}>
            La nota debe estar entre 0.0 y 5.0
          </p>
        )}
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wide block mb-1"
          style={{ color: '#023859' }}>
          Observaciones (opcional)
        </label>
        <textarea
          value={obs}
          onChange={e => onObs(e.target.value)}
          rows={3}
          placeholder="Observaciones sobre el desempeño del estudiante..."
          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
          style={is} />
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onCancelar}
          className="h-9 px-4 rounded-lg text-xs font-semibold"
          style={{ background: '#fff', color: '#023859', border: '0.5px solid #e2e8f0' }}>
          Cancelar
        </button>
        <button
          onClick={onGuardar}
          disabled={!valida || guardando}
          className="h-9 px-4 rounded-lg text-xs font-bold text-white"
          style={{ background: !valida || guardando ? '#a0aab4' : '#D91438' }}>
          {guardando ? 'Guardando...' : 'Guardar nota'}
        </button>
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────

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