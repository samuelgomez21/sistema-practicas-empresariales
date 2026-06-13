import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { usuariosApi } from '../api/usuariosApi'
import Avatar from '../components/Avatar'
import BadgeEstadoUsuario from '../components/BadgeEstadoUsuario'
import ModalConfirmUsuario from '../components/ModalConfirmUsuario'
import ModalCoordinador from '../components/ModalCoordinador'
import { coordinacionApi } from '@/features/coordinacion/api/coordinacionApi' 

const ROL_LABEL = {
  COORDINADOR_ACADEMICO: 'Coord. Académica',
  COORDINADOR_PRACTICA:   'Coord. de Práctica',
  SECRETARIA:             'Secretaria',
  DIRECCION:              'Dirección',
  ADMINISTRADOR:          'Administrador',
}

export default function CoordinadoresPage() {
  const qc = useQueryClient()
  const [modal, setModal]         = useState(false)
  const [editando, setEditando]   = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [busqueda, setBusqueda]   = useState('')

  const { data: coordinadores = [], isLoading } = useQuery({
    queryKey: ['coordinadores'],
    queryFn: usuariosApi.getCoordinadores,
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => usuariosApi.toggleCoordinador(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coordinadores'] })
      toast.success('Estado actualizado')
      setConfirmando(null)
    },
    onError: () => toast.error('Error al cambiar el estado'),
  })

  const filtrados = coordinadores.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.correo.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Coordinadores y staff</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {coordinadores.length} usuario(s) · solo el administrador puede crearlos
            </p>
          </div>
          <div className="flex gap-2">
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="h-8 px-3 rounded-lg text-xs outline-none"
              style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859', width: 180 }}
            />
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#D91438' }}>
              <Plus size={13} /> Nuevo usuario
            </button>
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Usuario', 'Rol', 'Programas asignados', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(c => (
              <tr key={c.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar nombre={c.nombre} size={30} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>{c.nombre}</p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{c.correo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[10px] font-medium px-2 py-1 rounded"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {ROL_LABEL[c.rol] ?? c.rol}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.programas?.length > 0
                      ? c.programas.map(p => (
                          <span key={p} className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: '#f0f2f5', color: '#6b7a8d' }}>{p}</span>
                        ))
                      : <span className="text-[10px]" style={{ color: '#8a9bb0' }}>—</span>
                    }
                  </div>
                </td>
                <td className="px-5 py-3">
                  <BadgeEstadoUsuario activo={c.activo} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditando(c)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => setConfirmando(c)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title={c.activo ? 'Desactivar' : 'Activar'}>
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
        <ModalCoordinador
          coordinador={editando}
          onClose={() => { setModal(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['coordinadores'] })
            setModal(false)
            setEditando(null)
          }}
        />
      )}

      {confirmando && (
        <ModalConfirmUsuario
          titulo={confirmando.activo ? 'Desactivar usuario' : 'Activar usuario'}
          mensaje={`¿Confirmas ${confirmando.activo ? 'desactivar' : 'activar'} a ${confirmando.nombre}?`}
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
      {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-50 rounded mb-2" />)}
    </div>
  )
}



function SelectorProgramasCoordinador({ usuarioId, onClose }) {
  const { data: programasTodos = [] } = useQuery({
    queryKey: ['programas-todos'],
    queryFn:  coordinacionApi.getProgramas,
  })

  const { data: asignados = [] } = useQuery({
    queryKey: ['programas-coordinador', usuarioId],
    queryFn:  () => usuariosApi.getProgramasDeCoordinador(usuarioId),
  })

  const [seleccionados, setSeleccionados] = useState([])

  useEffect(() => {
    setSeleccionados(asignados.map(p => p.id))
  }, [asignados])

  const mutation = useMutation({
    mutationFn: () => usuariosApi.asignarProgramas(usuarioId, seleccionados),
    onSuccess: () => {
      toast.success('Programas actualizados')
      onClose()
    },
  })

  const toggle = (id) => setSeleccionados(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )

  return (
    <div className="flex flex-col gap-2">
      {programasTodos.map(p => (
        <label key={p.id} className="flex items-center gap-2 text-xs">
          <input type="checkbox"
            checked={seleccionados.includes(p.id)}
            onChange={() => toggle(p.id)} />
          {p.nombre}
        </label>
      ))}
      <button onClick={() => mutation.mutate()}
        className="h-8 px-3 rounded-lg text-xs font-bold text-white mt-2"
        style={{ background: '#D91438' }}>
        Guardar programas
      </button>
    </div>
  )
}