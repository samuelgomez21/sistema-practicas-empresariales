import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Power } from 'lucide-react'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'
import BadgeEstado from '../components/BadgeEstado'
import ProteccionBanner from '../components/ProteccionBanner'

const CATALOGOS = [
  { key: 'tiposContrato',   label: 'Tipos de contrato'   },
  { key: 'sectoresEmpresa', label: 'Sectores empresariales' },
  { key: 'tiposDocumento',  label: 'Tipos de documento'  },
  { key: 'estadosPractica', label: 'Estados de práctica' },
]

export default function CatalogosMaestrosPage() {
  const qc = useQueryClient()
  const [tipo, setTipo]       = useState(CATALOGOS[0].key)
  const [editando, setEditando] = useState(null) // { id, nombre } | null
  const [nuevo, setNuevo]     = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['catalogo-maestro', tipo],
    queryFn: () => configuracionApi.getCatalogoMaestro(tipo),
  })

  const crearMutation = useMutation({
    mutationFn: (data) => configuracionApi.crearItemCatalogo(tipo, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalogo-maestro', tipo] })
      toast.success('Elemento creado')
      setNuevo(false)
      setNuevoNombre('')
    },
  })

  const editarMutation = useMutation({
    mutationFn: ({ id, nombre }) => configuracionApi.editarItemCatalogo(tipo, id, { nombre }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalogo-maestro', tipo] })
      toast.success('Elemento actualizado')
      setEditando(null)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => configuracionApi.toggleItemCatalogo(tipo, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalogo-maestro', tipo] })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('No se pudo cambiar el estado'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }

  return (
    <div className="flex flex-col gap-4">
      <ProteccionBanner />

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Catálogos maestros</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              Valores de referencia del sistema
            </p>
          </div>
          <button
            onClick={() => setNuevo(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#D91438' }}
          >
            <Plus size={13} /> Nuevo ítem
          </button>
        </div>

        {/* Tabs de catálogos */}
        <div className="flex" style={{ borderBottom: '0.5px solid #e2e8f0' }}>
          {CATALOGOS.map((c) => (
            <button
              key={c.key}
              onClick={() => setTipo(c.key)}
              className="px-4 py-2.5 text-xs font-medium transition-all"
              style={{
                color: tipo === c.key ? '#023859' : '#8a9bb0',
                borderBottom: tipo === c.key ? '2px solid #D91438' : '2px solid transparent',
                fontWeight: tipo === c.key ? 600 : 400,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Fila nueva */}
        {nuevo && (
          <div className="flex items-center gap-3 px-5 py-3"
            style={{ background: '#f7f9fb', borderBottom: '0.5px solid #e2e8f0' }}>
            <input
              autoFocus
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nombre del nuevo ítem..."
              className="flex-1 h-8 px-3 rounded-lg text-xs outline-none"
              style={is}
            />
            <button
              onClick={() => crearMutation.mutate({ nombre: nuevoNombre })}
              disabled={!nuevoNombre.trim() || crearMutation.isPending}
              className="h-8 px-3 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#D91438' }}>
              Guardar
            </button>
            <button onClick={() => { setNuevo(false); setNuevoNombre('') }}
              className="h-8 px-3 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
          </div>
        )}

        {/* Lista */}
        {isLoading ? (
          <div className="p-5 text-xs text-gray-400">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f7f9fb' }}>
                {['Nombre', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    {editando?.id === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={editando.nombre}
                          onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                          className="h-8 px-3 rounded-lg text-xs outline-none"
                          style={{ ...is, width: 220 }}
                        />
                        <button
                          onClick={() => editarMutation.mutate(editando)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold text-white"
                          style={{ background: '#D91438' }}>
                          Guardar
                        </button>
                        <button onClick={() => setEditando(null)}
                          className="h-8 px-3 rounded-lg text-xs"
                          style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-medium" style={{ color: '#023859' }}>{item.nombre}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <BadgeEstado activo={item.activo} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setEditando({ id: item.id, nombre: item.nombre })}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                        title="Editar">
                        <Edit size={13} />
                      </button>
                      <button onClick={() => toggleMutation.mutate(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                        title={item.activo ? 'Desactivar' : 'Activar'}>
                        <Power size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}