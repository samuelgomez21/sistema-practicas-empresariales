import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Search } from 'lucide-react'
import api from '@/lib/axios'
import BadgeEstadoPractica from '@/features/estudiante/components/BadgeEstadoPractica'

const ESTADOS = [
  { value: '',                         label: 'Todos los estados'      },
  { value: 'ASIGNADA_PENDIENTE_INICIO', label: 'Pendiente inicio'      },
  { value: 'EN_PROCESO_VINCULACION',    label: 'En vinculación'        },
  { value: 'VINCULADA',                 label: 'Convenio registrado'   },
  { value: 'EN_PRACTICA',              label: 'En práctica'            },
  { value: 'COMPLETADA',               label: 'Completada'             },
  { value: 'REPROBADA',                label: 'Reprobada'              },
  { value: 'CANCELADA',                label: 'Cancelada'              },
]

export default function PracticasActivasPage() {
  const qc = useQueryClient()
  const [busqueda,     setBusqueda]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['practicas-activas-coord'],
    queryFn:  async () => {
      const { data } = await api.get('/coordinacion-empresarial/practicas-activas')
      return data ?? []
    },
  })

  // Normalizar — el endpoint puede devolver { practica, estudiante } o el objeto plano
  const practicas = useMemo(() => raw.map(item => {
    const p   = item.practica   ?? item
    const est = item.estudiante ?? {}
    return {
      id:              p.id,
      estado:          p.estado,
      nombreEstudiante: est.nombre         ?? p.nombreEstudiante ?? '—',
      programa:        est.programa        ?? p.nombrePrograma   ?? p.programa ?? '—',
      nombrePractica:  p.nombrePractica    ?? p.nombre           ?? '—',
      empresaNombre:   p.empresaNombre     ?? '—',
      nombreDocente:   p.nombreDocente     ?? '—',
      nombreTutor:     p.nombreTutor       ?? (p.tutorId ? `Tutor #${p.tutorId}` : '—'),
      tieneEmpresa:    !!(p.empresaId      || p.empresaNombre),
      tieneDocente:    !!(p.docenteId      || p.nombreDocente),
      tieneTutor:      !!(p.tutorId        || p.tutorEmpresarialId || p.nombreTutor),
    }
  }), [raw])

  // Filtros
  const filtradas = useMemo(() => practicas.filter(p => {
    const matchBusqueda = !busqueda ||
      p.nombreEstudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.empresaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.nombreDocente.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = !filtroEstado || p.estado === filtroEstado
    return matchBusqueda && matchEstado
  }), [practicas, busqueda, filtroEstado])

    const activarMutation = useMutation({
    mutationFn: async (practicaId) => {
        // Si está en EN_PROCESO_VINCULACION, primero registrar convenio
        const { data: detalle } = await api.get(`/practicas/${practicaId}`)
        if (detalle.estado === 'EN_PROCESO_VINCULACION') {
        await api.patch(`/practicas/${practicaId}/registrar-convenio`)
        }
        // Luego activar
        return api.patch(`/practicas/${practicaId}/activar`)
    },
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['practicas-activas-coord'] })
        toast.success('Práctica activada correctamente')
    },
    onError: (err) => toast.error(
        err?.response?.data?.message ?? 'Error al activar la práctica'
    ),
    })

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>Prácticas</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Gestiona y activa las prácticas empresariales — {practicas.length} en total
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-3"
        style={{ border: '0.5px solid #e2e8f0' }}>

        {/* Búsqueda */}
        <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-lg"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
          <Search size={13} style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, empresa o docente..."
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: '#023859' }} />
        </div>

        {/* Filtro estado */}
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>

        <span className="text-[10px] font-semibold whitespace-nowrap"
          style={{ color: '#8a9bb0' }}>
          {filtradas.length} resultado(s)
        </span>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
              style={{ border: '0.5px solid #e2e8f0' }} />
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm" style={{ color: '#8a9bb0' }}>
            {practicas.length === 0
              ? 'No hay prácticas registradas'
              : 'Ninguna práctica coincide con los filtros'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map(p => {
            const puedeActivar = p.tieneEmpresa && p.tieneDocente && p.tieneTutor
                  && (p.estado === 'VINCULADA' || p.estado === 'EN_PROCESO_VINCULACION')

            return (
              <div key={p.id} className="bg-white rounded-xl p-5"
                style={{ border: '0.5px solid #e2e8f0' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-2"
                  style={{ borderBottom: '0.5px solid #f0f2f5' }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>
                      {p.nombreEstudiante}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
                      {p.programa} · {p.nombrePractica}
                    </p>
                  </div>
                  <BadgeEstadoPractica estado={p.estado} />
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { label: 'Empresa', value: p.empresaNombre },
                    { label: 'Docente', value: p.nombreDocente },
                    { label: 'Tutor',   value: p.nombreTutor   },
                  ].map(c => (
                    <div key={c.label}>
                      <p className="text-[10px] uppercase tracking-wide mb-0.5"
                        style={{ color: '#8a9bb0' }}>
                        {c.label}
                      </p>
                      <p className="text-xs font-semibold truncate"
                        style={{ color: c.value === '—' ? '#c0c8d4' : '#023859' }}>
                        {c.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Requisitos + botón */}
                <div className="flex items-center gap-3 pt-2"
                  style={{ borderTop: '0.5px solid #f0f2f5' }}>

                  {/* Semáforo de requisitos */}
                  {[
                    { label: 'Empresa', ok: p.tieneEmpresa },
                    { label: 'Docente', ok: p.tieneDocente },
                    { label: 'Tutor',   ok: p.tieneTutor   },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-1">
                      {c.ok
                        ? <CheckCircle size={12} style={{ color: '#1a7a4a' }} />
                        : <XCircle    size={12} style={{ color: '#c0392b' }} />}
                      <span className="text-[10px]"
                        style={{ color: c.ok ? '#1a7a4a' : '#8a9bb0' }}>
                        {c.label}
                      </span>
                    </div>
                  ))}

                  <div className="ml-auto flex gap-2">

                    {/* VINCULADA → mostrar botón activar */}
                    {(p.estado === 'VINCULADA' || p.estado === 'EN_PROCESO_VINCULACION') && (
                        <button
                            onClick={() => activarMutation.mutate(p.id)}
                            disabled={!puedeActivar || activarMutation.isPending}
                            title={!puedeActivar
                            ? 'Necesita empresa, docente y tutor asignados'
                            : 'Activar práctica'}
                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-bold text-white transition-all"
                            style={{ background: !puedeActivar ? '#a0aab4' : '#1a7a4a' }}>
                            <CheckCircle size={11} />
                            {activarMutation.isPending ? 'Activando...' : 'Activar práctica'}
                        </button>
                    )}

                    {/* EN_PRACTICA → ya activa */}
                    {p.estado === 'EN_PRACTICA' && (
                      <span className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-semibold"
                        style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                        <CheckCircle size={11} /> Activa
                      </span>
                    )}

                    {/* Pendiente de vinculación */}
{/*                     {(p.estado === 'ASIGNADA_PENDIENTE_INICIO'
                      || p.estado === 'EN_PROCESO_VINCULACION') && (
                      <span className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-semibold"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        Pendiente de vinculación
                      </span>
                    )} */}

                    {/* COMPLETADA / REPROBADA / CANCELADA */}
                    {['COMPLETADA','REPROBADA','CANCELADA'].includes(p.estado) && (
                      <span className="flex items-center h-8 px-3 rounded-lg text-[10px] font-semibold"
                        style={{
                          background: p.estado === 'COMPLETADA' ? '#eaf7f0' : '#fef0f0',
                          color:      p.estado === 'COMPLETADA' ? '#1a7a4a' : '#c0392b',
                        }}>
                        {p.estado === 'COMPLETADA' ? 'Completada'
                          : p.estado === 'REPROBADA' ? 'Reprobada'
                          : 'Cancelada'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}