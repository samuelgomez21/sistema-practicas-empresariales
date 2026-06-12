import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Building2, User, Calendar, Award } from 'lucide-react'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../api/docenteApi'

export default function PerfilEstudianteDocentePage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante-detalle-docente', id],
    queryFn:  () => docenteApi.getEstudianteDetalle(id),
  })

  const { data: avances = [] } = useQuery({
    queryKey: ['avances-practica', estudiante?.practica?.id],
    queryFn:  () => docenteApi.getAvancesPorPractica(estudiante.practica.id),
    enabled:  !!estudiante?.practica?.id,
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )
  if (!estudiante) return null

  const cfg = ESTADO_PRACTICA_LABEL[estudiante.practica?.estado] ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO

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
          {estudiante.nombre[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            {estudiante.nombre}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.programa} · Semestre {estudiante.semestre}
          </p>
        </div>
        <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>

      {/* Métricas académicas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {estudiante.promedioAcumulado?.toFixed(2)} / 5.0
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>Promedio acumulado</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {estudiante.creditosAprobados}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>Créditos aprobados</p>
        </div>
      </div>

      {/* Información de la práctica */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Práctica #{estudiante.practica?.numero}
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
            <InfoItem icon={<Building2 size={13} />} label="Empresa" value={estudiante.practica.empresaNombre} />
            <InfoItem icon={<User size={13} />}      label="Tutor empresarial" value={estudiante.practica.tutorNombre ?? '—'} />
            <InfoItem icon={<Calendar size={13} />}  label="Fecha de inicio" value={
              estudiante.practica.fechaInicio
                ? new Date(estudiante.practica.fechaInicio).toLocaleDateString('es-CO')
                : '—'
            } />
            <InfoItem icon={<Calendar size={13} />}  label="Fecha fin estimada" value={
              estudiante.practica.fechaFinEstimada
                ? new Date(estudiante.practica.fechaFinEstimada).toLocaleDateString('es-CO')
                : '—'
            } />
          </div>
        )}
      </div>

      {/* Historial de avances */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Avances entregados ({avances.length})
        </p>

        {avances.length === 0 ? (
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no ha entregado avances
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {avances.map(a => (
              <div key={a.id} className="p-3 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{a.titulo}</p>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={a.estado === 'REVISADO'
                      ? { background: '#eaf7f0', color: '#1a7a4a' }
                      : { background: '#fff8e6', color: '#a07010' }}>
                    {a.estado === 'REVISADO' ? 'Revisado' : 'Pendiente'}
                  </span>
                </div>
                <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                  {new Date(a.fechaEntrega).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                {a.comentarioDocente && (
                  <p className="text-[10px] mt-1.5 italic" style={{ color: '#6b7a8d' }}>
                    "{a.comentarioDocente}"
                  </p>
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