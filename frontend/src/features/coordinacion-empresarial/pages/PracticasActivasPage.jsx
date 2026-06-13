import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, User, BookOpen, CheckCircle, XCircle, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'

const ESTADO_PRACTICA = {
  ASIGNADA_PENDIENTE_INICIO: { label: 'Pendiente inicio',    bg: '#fff8e6', color: '#a07010' },
  EN_PROCESO_VINCULACION:    { label: 'En vinculación',       bg: '#e6f0fb', color: '#0B416B' },
  CONVENIO_REGISTRADO:       { label: 'Convenio registrado',  bg: '#f3e8ff', color: '#6d28d9' },
  EN_PRACTICA:               { label: 'En práctica',          bg: '#eaf7f0', color: '#1a7a4a' },
  CANCELADA:                 { label: 'Cancelada',            bg: '#fef0f0', color: '#c0392b' },
  FINALIZADA:                { label: 'Finalizada',           bg: '#f0f2f5', color: '#6b7a8d' },
}

export default function PracticasActivasPage() {
  const navigate     = useNavigate()
  const qc           = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['practicas-activas-coord'],
    queryFn:  coordEmpresarialApi.getPracticasActivas,
  })

  const activarMutation = useMutation({
    mutationFn: (practicaId) =>
      import('@/lib/axios').then(m => m.default.patch(`/practicas/${practicaId}/activar`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['practicas-activas-coord'] })
      toast.success('Práctica activada')
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al activar'),
  })

  const asignarEmpresaMutation = useMutation({
    mutationFn: ({ practicaId, empresaId }) =>
      import('@/lib/axios').then(m =>
        m.default.patch(`/practicas/${practicaId}/asignar-empresa`, { empresaId })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['practicas-activas-coord'] })
      toast.success('Empresa asignada')
    },
    onError: () => toast.error('Error al asignar empresa'),
  })

  if (isLoading) return <Skeleton />

  if (items.length === 0) return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>Prácticas activas</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Seguimiento de prácticas en curso
        </p>
      </div>
      <div className="bg-white rounded-xl p-10 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
        <BookOpen size={32} className="mx-auto mb-3" style={{ color: '#8a9bb0' }} />
        <p className="text-sm font-semibold" style={{ color: '#023859' }}>
          No hay prácticas activas en este momento
        </p>
        <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
          Las prácticas aparecerán aquí cuando sean creadas por coordinación académica
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Prácticas activas
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          {items.length} práctica(s) en seguimiento
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: 'En práctica',
            value: items.filter(i => i.practica?.estado === 'EN_PRACTICA').length,
            color: '#1a7a4a', bg: '#eaf7f0',
          },
          {
            label: 'En vinculación',
            value: items.filter(i => ['EN_PROCESO_VINCULACION','CONVENIO_REGISTRADO'].includes(i.practica?.estado)).length,
            color: '#0B416B', bg: '#e6f0fb',
          },
          {
            label: 'Pendiente inicio',
            value: items.filter(i => i.practica?.estado === 'ASIGNADA_PENDIENTE_INICIO').length,
            color: '#a07010', bg: '#fff8e6',
          },
          {
            label: 'Sin empresa',
            value: items.filter(i => !i.practica?.empresaNombre).length,
            color: '#c0392b', bg: '#fef0f0',
          },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: s.bg, border: '0.5px solid #e2e8f0' }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px]" style={{ color: s.color, opacity: 0.8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de prácticas */}
      <div className="flex flex-col gap-3">
        {items.map(({ estudiante, practica }) => {
          const cfg = ESTADO_PRACTICA[practica?.estado] ?? ESTADO_PRACTICA.ASIGNADA_PENDIENTE_INICIO

          return (
            <div key={practica?.id ?? estudiante.id}
              className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {estudiante.nombre[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold" style={{ color: '#023859' }}>
                        {estudiante.nombre}
                      </p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {estudiante.nombrePrograma} · Sem. {estudiante.semestre}
                    </p>
                    {practica?.nombre && (
                      <p className="text-[10px] mt-0.5" style={{ color: '#6b7a8d' }}>
                        {practica.nombre}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/coordinacion-empresarial/estudiantes/${estudiante.id}`)}
                  className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                  style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                  <Eye size={11} /> Ver historial
                </button>
              </div>

              {/* Detalles de la práctica */}
              <div className="grid grid-cols-3 gap-3 pt-3"
                style={{ borderTop: '0.5px solid #f0f2f5' }}>

                {/* Empresa */}
                <div className="flex items-start gap-2">
                  <Building2 size={13} style={{ color: '#8a9bb0', marginTop: 2 }} />
                  <div>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Empresa</p>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {practica?.empresaNombre ?? (
                        <span style={{ color: '#c0392b' }}>Sin asignar</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Docente asesor */}
                <div className="flex items-start gap-2">
                  <User size={13} style={{ color: '#8a9bb0', marginTop: 2 }} />
                  <div>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Docente asesor</p>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {practica?.nombreDocenteAsesor ?? (
                        <span style={{ color: '#8a9bb0' }}>—</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Tutor empresarial */}
                <div className="flex items-start gap-2">
                  <User size={13} style={{ color: '#8a9bb0', marginTop: 2 }} />
                  <div>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Tutor empresarial</p>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {practica?.nombreTutorEmpresarial ?? (
                        <span style={{ color: '#8a9bb0' }}>—</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist de avance */}
              {practica && (
                <div className="mt-3 pt-3 flex items-center gap-4"
                  style={{ borderTop: '0.5px solid #f0f2f5' }}>
                  {[
                    { label: 'Empresa asignada',  ok: !!practica.empresaNombre },
                    { label: 'Tutor asignado',    ok: !!practica.nombreTutorEmpresarial },
                    { label: 'Práctica activa',   ok: practica.estado === 'EN_PRACTICA' },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-1">
                      {c.ok
                        ? <CheckCircle size={12} style={{ color: '#1a7a4a' }} />
                        : <XCircle    size={12} style={{ color: '#c0392b' }} />
                      }
                      <span className="text-[10px]" style={{ color: c.ok ? '#1a7a4a' : '#8a9bb0' }}>
                        {c.label}
                      </span>
                    </div>
                  ))}

                  {/* Acción rápida: activar si está en vinculación con empresa y tutor */}
                  {practica.estado === 'CONVENIO_REGISTRADO'
                    && practica.empresaNombre
                    && practica.nombreTutorEmpresarial && (
                    <button
                      onClick={() => activarMutation.mutate(practica.id)}
                      disabled={activarMutation.isPending}
                      className="ml-auto flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold text-white"
                      style={{ background: '#1a7a4a' }}>
                      <CheckCircle size={11} /> Activar práctica
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )
}