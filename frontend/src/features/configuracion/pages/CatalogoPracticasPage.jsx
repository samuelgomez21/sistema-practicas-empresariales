import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'
import ProteccionBanner from '../components/ProteccionBanner'
import BadgeEstado from '../components/BadgeEstado'
import ModalConfirm from '../components/ModalConfirm'
import ModalCatalogoPractica from '../components/ModalCatalogoPractica'

export default function CatalogoPracticasPage() {
  const qc = useQueryClient()
  const [modal, setModal]         = useState(false)
  const [editando, setEditando]   = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [filtroProg, setFiltroProg] = useState('')

  const { data: catalogo = [], isLoading } = useQuery({
    queryKey: ['catalogo-practicas', filtroProg],
    queryFn: () => configuracionApi.getCatalogoPracticas(filtroProg || undefined),
  })

  const { data: programas = [] } = useQuery({
    queryKey: ['programas'],
    queryFn: () => configuracionApi.getProgramas(),
  })

  const toggleMutation = useMutation({
    mutationFn: (item) => configuracionApi.toggleCatalogoPractica(item.id, item.activa),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalogo-practicas'] })
      toast.success('Estado actualizado')
      setConfirmando(null)
    },
    onError: (err) => {
      const msg = err.response?.data?.message ?? err.response?.data?.mensaje ?? 'No se pudo cambiar el estado'
      toast.error(msg)
      setConfirmando(null)
    },
  })

  const programaNombre = (id) => programas.find((p) => p.id === id)?.nombre ?? '—'

  if (isLoading) return <div className="text-xs text-gray-400 p-4">Cargando...</div>

  return (
    <div className="flex flex-col gap-4">
      <ProteccionBanner />

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Catálogo de prácticas</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              Plantillas base para crear instancias de práctica
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={filtroProg}
              onChange={(e) => setFiltroProg(e.target.value)}
              className="h-8 px-2 rounded-lg text-xs outline-none"
              style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
            >
              <option value="">Todos los programas</option>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#D91438' }}
            >
              <Plus size={13} /> Nueva práctica
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Nombre', 'Programa', 'Materia núcleo', 'Puede hacer', 'Documentos', 'Prácticas activas', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {catalogo.map((c) => (
              <tr key={c.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{c.nombre}</p>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                  {programaNombre(c.programaId)}
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: '#023859' }}>
                  {c.materiaNucleo}
                </td>
                <td className="px-5 py-3">
                  <p className="text-xs" style={{ color: '#6b7a8d', maxWidth: 200 }}
                    title={c.descripcion}>
                    {c.descripcion?.length > 50
                      ? c.descripcion.slice(0, 50) + '...'
                      : c.descripcion}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1" style={{ maxWidth: 160 }}>
                    {(c.documentosRequeridos ?? '')
                      .split(',')
                      .filter(Boolean)
                      .map((doc) => (
                        <span key={doc} className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                          style={{ background: '#e6f0fb', color: '#0B416B' }}>
                          {doc.trim().replace(/_/g, ' ')}
                        </span>
                      ))}
                    {!c.documentosRequeridos && (
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>—</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={c.practicasActivas > 0
                      ? { background: '#e6f0fb', color: '#0B416B' }
                      : { background: '#f0f2f5', color: '#6b7a8d' }}
                  >
                    {c.practicasActivas}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <BadgeEstado activo={c.activa} />
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
                      title={c.activa ? 'Desactivar' : 'Activar'}>
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
        <ModalCatalogoPractica
          item={editando}
          programas={programas}
          onClose={() => { setModal(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['catalogo-practicas'] })
            setModal(false)
            setEditando(null)
            toast.success(editando ? 'Práctica actualizada — solo aplica a futuras prácticas' : 'Práctica creada')
          }}
        />
      )}

      {confirmando && (
        <ModalConfirm
          titulo={confirmando.activa ? 'Desactivar práctica' : 'Activar práctica'}
          mensaje={
            confirmando.activa && confirmando.practicasActivas > 0
              ? `No se puede desactivar: hay ${confirmando.practicasActivas} práctica(s) activa(s) vinculadas.`
              : `¿Confirmas ${confirmando.activa ? 'desactivar' : 'activar'} "${confirmando.nombre}"?`
          }
          cargando={toggleMutation.isPending}
          onConfirmar={() => toggleMutation.mutate(confirmando)}
          onCancelar={() => setConfirmando(null)}
        />
      )}
    </div>
  )
}