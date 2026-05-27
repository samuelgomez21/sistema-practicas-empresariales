import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'
import ProteccionBanner from '../components/ProteccionBanner'
import BadgeEstado from '../components/BadgeEstado'
import ModalPrograma from '../components/ModalPrograma'

export default function ProgramasPage() {
  const qc = useQueryClient()
  const [modal, setModal]     = useState(false)
  const [editando, setEditando] = useState(null)

  const { data: programas = [], isLoading } = useQuery({
    queryKey: ['programas'],
    queryFn: () => configuracionApi.getProgramas(),
  })

  const { data: facultades = [] } = useQuery({
    queryKey: ['facultades'],
    queryFn: configuracionApi.getFacultades,
  })

  if (isLoading) return <SkeletonTabla />

  const facultadNombre = (id) =>
    facultades.find((f) => f.id === id)?.nombre ?? '—'

  return (
    <div className="flex flex-col gap-4">
      <ProteccionBanner />

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Programas académicos</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {programas.length} programa(s) registrado(s)
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#D91438' }}
          >
            <Plus size={13} /> Nuevo programa
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Programa', 'Facultad', 'Prácticas', 'Cortes', 'Nota mínima', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programas.map((p) => (
              <tr key={p.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{p.nombre}</p>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                  {facultadNombre(p.facultadId)}
                </td>
                <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {p.numeroPracticas}
                </td>
                <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {p.corteseguimiento}
                </td>
                <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {p.notaMinima}
                </td>
                <td className="px-5 py-3">
                  <BadgeEstado activo={p.activo} />
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setEditando(p)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                    title="Editar"
                  >
                    <Edit size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal || editando) && (
        <ModalPrograma
          programa={editando}
          facultades={facultades}
          onClose={() => { setModal(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['programas'] })
            setModal(false)
            setEditando(null)
          }}
        />
      )}
    </div>
  )
}

function SkeletonTabla() {
  return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 bg-gray-50 rounded mb-2" />
      ))}
    </div>
  )
}