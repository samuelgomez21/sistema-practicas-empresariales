import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Eye, UserPlus, CheckCircle, XCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
import { vacantesApi } from '../api/vacantesApi'
import BadgeEstadoVacante from '../components/BadgeEstadoVacante'
import TagHabilidad from '../components/TagHabilidad'
import ModalPostular from '../components/ModalPostular'
import ModalRechazar from '../components/ModalRechazar'

export default function VacantesListadoPage() {
  const qc       = useQueryClient()
  const navigate = useNavigate()
  const [busqueda,     setBusqueda]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalPostular, setModalPostular] = useState(null)
  const [modalRechazar, setModalRechazar] = useState(null)

  const { data: vacantes = [], isLoading } = useQuery({
    queryKey: ['vacantes'],
    queryFn:  vacantesApi.getVacantes,
  })

  const aprobarMutation = useMutation({
    mutationFn: (id) => vacantesApi.aprobarVacante(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vacantes'] })
      toast.success('Vacante aprobada y publicada')
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al aprobar'),
  })

  const filtradas = vacantes.filter(v => {
    const matchBusqueda = !busqueda ||
      v.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (v.empresaNombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = !filtroEstado || v.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  const pendientes = vacantes.filter(v => v.estado === 'PENDIENTE').length
  const aprobadas  = vacantes.filter(v => v.estado === 'APROBADA').length

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">

      {pendientes > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
          <CheckCircle size={16} style={{ color: '#a07010', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#a07010' }}>
              {pendientes} vacante(s) esperando tu aprobación
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#a07010' }}>
              Las vacantes deben ser aprobadas para que los estudiantes puedan postularse.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pendientes aprobación', value: pendientes, color: '#a07010', bg: '#fff8e6' },
          { label: 'Aprobadas',             value: aprobadas,  color: '#1a7a4a', bg: '#eaf7f0' },
          { label: 'Total vacantes',        value: vacantes.length, color: '#023859', bg: '#fff' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4"
            style={{ border: '0.5px solid #e2e8f0', background: c.bg }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: c.color, opacity: 0.8 }}>
              {c.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar vacante o empresa..."
            className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
          />
        </div>
        <div className="flex gap-1">
          {[
            { label: `Todas (${vacantes.length})`, value: '' },
            { label: `Pendientes (${pendientes})`, value: 'PENDIENTE' },
            { label: `Aprobadas (${aprobadas})`,   value: 'APROBADA'  },
            { label: 'Cerradas',                   value: 'CERRADA'   },
            { label: 'Rechazadas',                 value: 'RECHAZADA' },
          ].map(t => (
            <button key={t.value}
              onClick={() => setFiltroEstado(t.value)}
              className="h-9 px-3 rounded-lg text-xs font-semibold transition-all"
              style={filtroEstado === t.value
                ? { background: '#023859', color: '#fff' }
                : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
              }>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtradas.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>No se encontraron vacantes</p>
          </div>
        ) : filtradas.map(v => (
          <div key={v.id} className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#e6f0fb' }}>
                  <span className="text-sm font-bold" style={{ color: '#0B416B' }}>
                    {v.empresaNombre?.[0]}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{v.titulo}</p>
                    <BadgeEstadoVacante estado={v.estado} />
                  </div>
                  <p className="text-xs" style={{ color: '#0B416B' }}>{v.empresaNombre}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {v.programaNombre && (
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>{v.programaNombre}</span>
                    )}
                    {v.semestreMinimo && (
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>Sem. {v.semestreMinimo}+</span>
                    )}
                    {v.salario && (
                      <span className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                        ${Number(v.salario).toLocaleString('es-CO')}/mes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => navigate(`/vacantes/${v.id}`)}
                  className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                  style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                  <Eye size={11} /> Ver detalle
                </button>
                {v.estado === 'APROBADA' && (
                  <button onClick={() => setModalPostular(v)}
                    className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold text-white"
                    style={{ background: '#0B416B' }}>
                    <UserPlus size={11} /> Postular estudiante
                  </button>
                )}
              </div>
            </div>

            {v.habilidades?.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-3">
                {v.habilidades.map(h => <TagHabilidad key={h} label={h} />)}
              </div>
            )}

            {v.estado === 'PENDIENTE' && (
              <div className="flex gap-2 pt-3" style={{ borderTop: '0.5px solid #f0f2f5' }}>
                <button
                  onClick={() => aprobarMutation.mutate(v.id)}
                  disabled={aprobarMutation.isPending}
                  className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#1a7a4a' }}>
                  <CheckCircle size={13} /> Aprobar y publicar
                </button>
                <button
                  onClick={() => setModalRechazar(v)}
                  className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold"
                  style={{ background: '#fef0f0', color: '#c0392b', border: '0.5px solid #f7c1c1' }}>
                  <XCircle size={13} /> Rechazar
                </button>
              </div>
            )}

            {v.estado === 'RECHAZADA' && v.motivoRechazo && (
              <div className="mt-2 p-2 rounded-lg" style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
                <p className="text-[10px]" style={{ color: '#c0392b' }}>
                  <strong>Motivo:</strong> {v.motivoRechazo}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalPostular && (
        <ModalPostular
          vacante={modalPostular}
          onClose={() => setModalPostular(null)}
          onPostulado={() => {
            qc.invalidateQueries({ queryKey: ['vacantes'] })
            setModalPostular(null)
            toast.success('Estudiante postulado correctamente')
          }}
        />
      )}

      {modalRechazar && (
        <ModalRechazar
          vacante={modalRechazar}
          onClose={() => setModalRechazar(null)}
          onRechazada={(motivo) => {
            vacantesApi.rechazarVacante(modalRechazar.id, motivo).then(() => {
              qc.invalidateQueries({ queryKey: ['vacantes'] })
              setModalRechazar(null)
              toast.success('Vacante rechazada')
            })
          }}
        />
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-28" style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )
}