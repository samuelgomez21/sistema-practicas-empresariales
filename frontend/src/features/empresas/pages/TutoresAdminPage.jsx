import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'
import ModalTutor from '../components/ModalTutor'

export default function TutoresAdminPage({ empresaIdFijo } = {}) {
  const qc = useQueryClient()
  const [modal,    setModal]    = useState(false)
  const [editando, setEditando] = useState(null)
  const [filtroEmp, setFiltroEmp] = useState('')

  // Solo carga lista de empresas si es coordinador/admin (sin empresaIdFijo)
  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn:  empresasApi.getEmpresas,
    enabled:  !empresaIdFijo,
  })

  // Si hay empresaIdFijo (empresa vinculada), siempre usa ese ID.
  // Si no, usa el filtro del select (o todos si está vacío).
  const idEfectivo = empresaIdFijo ?? (filtroEmp || null)

  const { data: tutores = [], isLoading } = useQuery({
    queryKey: ['tutores', idEfectivo],
    queryFn:  () => idEfectivo
      ? empresasApi.getTutoresByEmpresa(idEfectivo)
      : empresasApi.getTodosLosTutores(),
    enabled:  empresaIdFijo ? !!empresaIdFijo : true,
  })

  const toggleMutation = useMutation({
    mutationFn: (t) => empresasApi.toggleTutor(t.id, t.activo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tutores'] })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('Error al cambiar el estado'),
  })

  const empresaNombre = (id) =>
    empresas.find(e => e.id === id)?.razonSocial ?? `Empresa #${id}`

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2].map(i => <div key={i} className="h-8 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '0.5px solid #f0f2f5' }}>
        <div>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Tutores empresariales</p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            {tutores.length} tutor(es) registrado(s)
          </p>
        </div>
        <div className="flex gap-2">
          {/* Selector de empresa solo para coordinador/admin */}
          {!empresaIdFijo && (
            <select value={filtroEmp} onChange={e => setFiltroEmp(e.target.value)}
              className="h-8 px-2 rounded-lg text-xs outline-none"
              style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
              <option value="">Todas las empresas</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.razonSocial}</option>)}
            </select>
          )}
          <button onClick={() => setModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#D91438' }}>
            <Plus size={13} /> Nuevo tutor
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ background: '#f7f9fb' }}>
            {/* Columna empresa solo para coordinador/admin */}
            {[...(!empresaIdFijo ? ['Empresa'] : []), 'Tutor', 'Cargo', 'Teléfono', 'Estado', 'Acciones'].map(h => (
              <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tutores.map(t => (
            <tr key={t.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
              className="hover:bg-gray-50 transition-colors">
              {!empresaIdFijo && (
                <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                  {empresaNombre(t.empresaId)}
                </td>
              )}
              <td className="px-5 py-3">
                <p className="text-xs font-semibold" style={{ color: '#023859' }}>{t.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{t.correo}</p>
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>{t.cargo}</td>
              <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>{t.telefono}</td>
              <td className="px-5 py-3">
                <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={t.activo
                    ? { background: '#eaf7f0', color: '#1a7a4a' }
                    : { background: '#f0f2f5', color: '#6b7a8d' }}>
                  {t.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-1.5">
                  <button onClick={() => setEditando(t)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}>
                    <Edit size={13} />
                  </button>
                  <button onClick={() => toggleMutation.mutate(t)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                    title={t.activo ? 'Desactivar' : 'Activar'}>
                    <Power size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {tutores.length === 0 && (
            <tr>
              <td colSpan={empresaIdFijo ? 5 : 6}
                className="px-5 py-8 text-center text-xs" style={{ color: '#8a9bb0' }}>
                No hay tutores registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {(modal || editando) && (
        <ModalTutor
          tutor={editando}
          empresas={empresas}
          empresaIdFijo={empresaIdFijo}
          onClose={() => { setModal(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['tutores'] })
            setModal(false)
            setEditando(null)
            toast.success(editando ? 'Tutor actualizado' : 'Tutor creado correctamente')
          }}
        />
      )}
    </div>
  )
}