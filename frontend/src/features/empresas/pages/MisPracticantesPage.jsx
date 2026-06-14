import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { User } from 'lucide-react'
import api from '@/lib/axios'
import { empresasApi } from '../api/empresasApi'

export default function MisPracticantesPage() {
  const qc = useQueryClient()

  const { data: empresa } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  const { data: practicantes = [], isLoading } = useQuery({
    queryKey: ['mis-practicantes', empresa?.id],
    queryFn:  async () => {
      const { data } = await api.get(`/practicas/empresa/${empresa.id}`)
      return data ?? []
    },
    enabled: !!empresa?.id,
  })

  const { data: tutores = [] } = useQuery({
    queryKey: ['tutores', empresa?.id],
    queryFn:  () => empresasApi.getTutoresByEmpresa(empresa.id),
    enabled:  !!empresa?.id,
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="px-5 py-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Mis practicantes</p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            {practicantes.length} practicante(s) vinculados
          </p>
        </div>

        {practicantes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              No hay practicantes activos en este momento
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {practicantes.map(p => (
              <PracticanteRow
                key={p.id}
                practicante={p}
                tutores={tutores}
                onAsignado={() => qc.invalidateQueries({ queryKey: ['mis-practicantes', empresa?.id] })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PracticanteRow({ practicante: p, tutores, onAsignado }) {
  const [mostrarSelect, setMostrarSelect] = useState(false)
  const [tutorId, setTutorId]             = useState('')

  const mutation = useMutation({
    mutationFn: () => api.patch(`/practicas/${p.id}/asignar-tutor`, {
      tutorId: Number(tutorId),
    }),
    onSuccess: () => {
      setMostrarSelect(false)
      setTutorId('')
      onAsignado()
      toast.success('Tutor asignado correctamente')
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al asignar tutor'),
  })

  const tieneTutor = !!p.tutorId || !!p.nombreTutor

  return (
    <div className="px-5 py-4" style={{ borderBottom: '0.5px solid #f7f9fb' }}>
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ background: '#e6f0fb', color: '#0B416B' }}>
          {p.nombreEstudiante?.[0] ?? '?'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
            {p.nombreEstudiante}
          </p>
          <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
            {p.programa} · Sem. {p.semestre} · #{p.numeroPractica}
          </p>
        </div>

        {/* Estado */}
        <span className="text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0"
          style={p.estado === 'EN_PRACTICA'
            ? { background: '#eaf7f0', color: '#1a7a4a' }
            : { background: '#e6f0fb', color: '#0B416B' }}>
          {p.estado === 'EN_PRACTICA'       ? 'En práctica'
           : p.estado === 'EN_PROCESO_VINCULACION' ? 'En vinculación'
           : p.estado === 'VINCULADA'       ? 'Convenio registrado'
           : p.estado}
        </span>

        {/* Botón asignar tutor */}
        {!tieneTutor && !mostrarSelect && (
          <button
            onClick={() => setMostrarSelect(true)}
            className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold flex-shrink-0"
            style={{ background: '#e6f0fb', color: '#0B416B', border: '0.5px solid #c5d9f0' }}>
            <User size={10} /> Asignar tutor
          </button>
        )}

        {tieneTutor && (
          <span className="text-[10px] flex-shrink-0" style={{ color: '#1a7a4a' }}>
            ✓ {p.nombreTutor ?? `Tutor #${p.tutorId}`}
          </span>
        )}
      </div>

      {/* Select inline de tutor */}
      {mostrarSelect && (
        <div className="mt-3 flex items-center gap-2 pl-11">
          <select
            value={tutorId}
            onChange={e => setTutorId(e.target.value)}
            className="flex-1 h-8 px-2 rounded text-xs outline-none"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Seleccionar tutor...</option>
            {tutores.map(t => (
              <option key={t.id} value={t.id}>
                {t.nombre} — {t.cargo}
              </option>
            ))}
          </select>
          <button
            onClick={() => mutation.mutate()}
            disabled={!tutorId || mutation.isPending}
            className="h-8 px-3 rounded text-[10px] font-bold text-white"
            style={{ background: !tutorId ? '#a0aab4' : '#D91438' }}>
            {mutation.isPending ? 'Guardando...' : 'Confirmar'}
          </button>
          <button
            onClick={() => { setMostrarSelect(false); setTutorId('') }}
            className="h-8 px-3 rounded text-[10px] font-semibold"
            style={{ background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}