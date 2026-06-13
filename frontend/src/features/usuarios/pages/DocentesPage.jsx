import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { usuariosApi } from '../api/usuariosApi'
import Avatar from '../components/Avatar'
import BadgeEstadoUsuario from '../components/BadgeEstadoUsuario'
import ModalConfirmUsuario from '../components/ModalConfirmUsuario'
import ModalDocente from '../components/ModalDocente'

export default function DocentesPage() {
  const qc = useQueryClient()
  const [modal, setModal]           = useState(false)
  const [editando, setEditando]     = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [busqueda, setBusqueda]     = useState('')

  const { data: docentes = [], isLoading } = useQuery({
    queryKey: ['docentes'],
    queryFn: usuariosApi.getDocentes,
  })

  const toggleMutation = useMutation({
    mutationFn: (d) => usuariosApi.toggleDocente(d.id, d.activo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['docentes'] })
      toast.success('Estado actualizado')
      setConfirmando(null)
    },
    onError: () => toast.error('Error al cambiar el estado'),
  })

  const filtrados = docentes.filter(d =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.correo.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Docentes asesores</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {docentes.length} docente(s) · {docentes.filter(d => d.activo).length} activos
            </p>
          </div>
          <div className="flex gap-2">
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="h-8 px-3 rounded-lg text-xs outline-none"
              style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859', width: 180 }} />
            <button onClick={() => setModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#D91438' }}>
              <Plus size={13} /> Nuevo docente
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Docente', 'Teléfono', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(d => (
              <tr key={d.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar nombre={d.nombre} size={28} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>{d.nombre}</p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{d.correo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>{d.telefono}</td>
                <td className="px-5 py-3"><BadgeEstadoUsuario activo={d.activo} /></td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditando(d)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => setConfirmando(d)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title={d.activo ? 'Desactivar' : 'Activar'}>
                      <Power size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal || editando) && (
        <ModalDocente
          docente={editando}
          onClose={() => { setModal(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['docentes'] })
            setModal(false)
            setEditando(null)
          }}
        />
      )}

      {confirmando && (
        <ModalConfirmUsuario
          titulo={confirmando.activo ? 'Desactivar docente' : 'Activar docente'}
          mensaje={`¿Confirmas ${confirmando.activo ? 'desactivar' : 'activar'} a ${confirmando.nombre}?`}
          cargando={toggleMutation.isPending}
          onConfirmar={() => toggleMutation.mutate(confirmando)}
          onCancelar={() => setConfirmando(null)}
        />
      )}
    </div>
  )
}