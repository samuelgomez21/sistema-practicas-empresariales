import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ScrollText } from 'lucide-react'
import { bitacoraApi, ACCION_LABEL, MODULO_LABEL } from '../api/bitacoraApi'

export default function BitacoraPage() {
  const [busqueda,     setBusqueda]     = useState('')
  const [filtroModulo, setFiltroModulo] = useState('')
  const [filtroAccion, setFiltroAccion] = useState('')

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['bitacora'],
    queryFn:  bitacoraApi.getRegistros,
  })

  const filtrados = registros.filter(r => {
    const matchBusqueda = !busqueda ||
      r.usuarioEmail.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.detalles.toLowerCase().includes(busqueda.toLowerCase())
    const matchModulo = !filtroModulo || r.modulo === filtroModulo
    const matchAccion = !filtroAccion || r.accion === filtroAccion
    return matchBusqueda && matchModulo && matchAccion
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: '#023859' }}>
          <ScrollText size={16} style={{ color: '#D91438' }} />
          Bitácora de auditoría
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Registro de acciones realizadas en el sistema — {registros.length} eventos
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por usuario o detalle..."
            className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
          />
        </div>
        <select value={filtroModulo} onChange={e => setFiltroModulo(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todos los módulos</option>
          {Object.entries(MODULO_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={filtroAccion} onChange={e => setFiltroAccion(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todas las acciones</option>
          {Object.entries(ACCION_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Lista de eventos */}
      <div className="flex flex-col gap-2">
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              No se encontraron registros
            </p>
          </div>
        ) : filtrados.map(r => {
          const cfg = ACCION_LABEL[r.accion] ?? { label: r.accion, bg: '#f0f2f5', color: '#6b7a8d' }
          const fecha = new Date(r.fechaRegistro)
          return (
            <div key={r.id} className="bg-white rounded-xl p-4"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{ background: '#f0f2f5', color: '#6b7a8d' }}>
                      {MODULO_LABEL[r.modulo] ?? r.modulo}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#023859' }}>{r.detalles}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                    {r.usuarioEmail} · IP {r.ipAddress}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-semibold" style={{ color: '#023859' }}>
                    {fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                    {fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}