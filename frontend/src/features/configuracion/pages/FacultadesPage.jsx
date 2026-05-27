import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'
import ProteccionBanner from '../components/ProteccionBanner'
import BadgeEstado from '../components/BadgeEstado'
import ModalConfirm from '../components/ModalConfirm'
import ModalFacultad from '../components/ModalFacultad'

export default function FacultadesPage() {
  const qc = useQueryClient()
  const [modalCrear, setModalCrear]   = useState(false)
  const [editando, setEditando]       = useState(null)
  const [confirmando, setConfirmando] = useState(null) // { id, nombre, activa }

  const { data: facultades = [], isLoading } = useQuery({
    queryKey: ['facultades'],
    queryFn: configuracionApi.getFacultades,
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => configuracionApi.toggleFacultad(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['facultades'] })
      toast.success('Estado actualizado correctamente')
      setConfirmando(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.mensaje ?? 'No se pudo cambiar el estado')
      setConfirmando(null)
    },
  })

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">
      <ProteccionBanner />

      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #e2e8f0' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Facultades registradas
            </p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {facultades.length} facultad(es) · {facultades.filter(f => f.activa).length} activas
            </p>
          </div>
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#D91438' }}
          >
            <Plus size={13} /> Nueva facultad
          </button>
        </div>

        {/* Tabla */}
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Facultad', 'Coordinador académico', 'Programas', 'Estado', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {facultades.map((f) => (
              <tr
                key={f.id}
                style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-3">
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{f.nombre}</p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-xs" style={{ color: '#023859' }}>{f.coordinador}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{f.correoCoordinador}</p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-xs" style={{ color: '#6b7a8d' }}>
                    {f.programas?.length ?? 0} programa(s)
                  </p>
                </td>
                <td className="px-5 py-3">
                  <BadgeEstado activo={f.activa} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditando(f)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => setConfirmando(f)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title={f.activa ? 'Desactivar' : 'Activar'}
                    >
                      <Power size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal crear/editar */}
      {(modalCrear || editando) && (
        <ModalFacultad
          facultad={editando}
          onClose={() => { setModalCrear(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['facultades'] })
            setModalCrear(false)
            setEditando(null)
          }}
        />
      )}

      {/* Modal confirmación toggle */}
      {confirmando && (
        <ModalConfirm
          titulo={confirmando.activa ? 'Desactivar facultad' : 'Activar facultad'}
          mensaje={
            confirmando.activa
              ? `¿Deseas desactivar "${confirmando.nombre}"? Verifica que no tenga prácticas activas.`
              : `¿Deseas activar "${confirmando.nombre}"?`
          }
          cargando={toggleMutation.isPending}
          onConfirmar={() => toggleMutation.mutate(confirmando.id)}
          onCancelar={() => setConfirmando(null)}
        />
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-4 w-48 bg-gray-100 rounded mb-3" />
      <div className="h-3 w-full bg-gray-50 rounded mb-2" />
      <div className="h-3 w-full bg-gray-50 rounded mb-2" />
      <div className="h-3 w-3/4 bg-gray-50 rounded" />
    </div>
  )
}