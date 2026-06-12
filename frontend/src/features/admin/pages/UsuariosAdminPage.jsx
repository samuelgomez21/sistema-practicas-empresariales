import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, KeyRound, Power } from 'lucide-react'
import { toast } from 'sonner'
import { usuariosApi, ROL_LABEL } from '../api/usuariosApi'
import ModalUsuario from '../components/ModalUsuario'

export default function UsuariosAdminPage() {
  const qc = useQueryClient()
  const [busqueda,   setBusqueda]   = useState('')
  const [filtroRol,  setFiltroRol]  = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modal, setModal] = useState(null) // null | 'crear' | usuario a editar

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios-admin'],
    queryFn:  usuariosApi.getUsuarios,
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => usuariosApi.toggleActivo(id),
    onSuccess: (u) => {
      qc.invalidateQueries({ queryKey: ['usuarios-admin'] })
      toast.success(u.activo ? 'Usuario activado' : 'Usuario desactivado')
    },
  })

  const forzarMutation = useMutation({
    mutationFn: (id) => usuariosApi.forzarCambioPassword(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios-admin'] })
      toast.success('Se forzará el cambio de contraseña en el próximo inicio de sesión')
    },
  })

  const filtrados = usuarios.filter(u => {
    const matchBusqueda = !busqueda ||
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
    const matchRol    = !filtroRol    || u.rol === filtroRol
    const matchEstado = !filtroEstado ||
      (filtroEstado === 'ACTIVO' ? u.activo : !u.activo)
    return matchBusqueda && matchRol && matchEstado
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Gestión de usuarios
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {usuarios.length} usuario(s) registrado(s)
          </p>
        </div>
        <button onClick={() => setModal('crear')}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-white"
          style={{ background: '#D91438' }}>
          <Plus size={14} /> Nuevo usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
          />
        </div>
        <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todos los roles</option>
          {Object.entries(ROL_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="INACTIVO">Inactivos</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Usuario', 'Correo', 'Rol', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(u => (
              <tr key={u.id} className="hover:bg-gray-50"
                style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      {u.nombre[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>{u.nombre}</p>
                      {u.debeCambiarPassword && (
                        <p className="text-[9px]" style={{ color: '#a07010' }}>
                          Debe cambiar contraseña
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{ background: '#e6f0fb', color: '#6b7a8d' }}>
                    {ROL_LABEL[u.rol] ?? u.rol}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={u.activo
                      ? { background: '#eaf7f0', color: '#1a7a4a' }
                      : { background: '#fef0f0', color: '#c0392b' }}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setModal(u)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar">
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => forzarMutation.mutate(u.id)}
                      disabled={u.debeCambiarPassword}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        border: '0.5px solid #e2e8f0',
                        background: u.debeCambiarPassword ? '#f0f2f5' : '#f7f9fb',
                        color: u.debeCambiarPassword ? '#c5cdd6' : '#a07010',
                      }}
                      title="Forzar cambio de contraseña">
                      <KeyRound size={13} />
                    </button>
                    <button
                      onClick={() => toggleMutation.mutate(u.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={u.activo
                        ? { border: '0.5px solid #f7c1c1', background: '#fef0f0', color: '#c0392b' }
                        : { border: '0.5px solid #b6e8cf', background: '#eaf7f0', color: '#1a7a4a' }}
                      title={u.activo ? 'Desactivar' : 'Activar'}>
                      <Power size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-xs" style={{ color: '#8a9bb0' }}>
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ModalUsuario
          usuario={modal === 'crear' ? null : modal}
          onClose={() => setModal(null)}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['usuarios-admin'] })
            setModal(null)
          }}
        />
      )}
    </div>
  )
}