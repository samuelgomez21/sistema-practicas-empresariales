import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Edit } from 'lucide-react'
import { empresasApi } from '../api/empresasApi'
import BadgeEstadoEmpresa from '../components/BadgeEstadoEmpresa'
import DocPill from '../components/DocPill'
import AlertaCamara from '../components/AlertaCamara'
import ModalNuevaEmpresa from '../components/ModalNuevaEmpresa'

export default function EmpresasListadoPage() {
  const navigate = useNavigate()
  const qc       = useQueryClient()
  const [modal,        setModal]        = useState(false)
  const [busqueda,     setBusqueda]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroSector, setFiltroSector] = useState('')

  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ['empresas'],
    queryFn:  empresasApi.getEmpresas,
  })

  const filtradas = empresas.filter(e => {
    const matchBusqueda = !busqueda ||
      e.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.nit.includes(busqueda)
    const matchEstado  = !filtroEstado || e.estado === filtroEstado
    const matchSector  = !filtroSector || e.sectorEconomico === filtroSector
    return matchBusqueda && matchEstado && matchSector
  })

  const sectores = [...new Set(empresas.map(e => e.sectorEconomico))]

  const conteo = {
    total:      empresas.length,
    habilitadas: empresas.filter(e => e.estado === 'HABILITADA').length,
    pendientes: empresas.filter(e => e.estado === 'PENDIENTE_HABILITACION').length,
    inhabilitadas: empresas.filter(e => e.estado === 'INHABILITADA').length,
  }

  // Alertas de cámara de comercio próximas a vencer
  const alertasCamara = empresas.filter(e => e.alertaCamara)

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">

      {/* Alertas globales de cámara de comercio */}
      {alertasCamara.map(e => (
        <AlertaCamara key={e.id} alerta={{ ...e.alertaCamara, empresa: e.razonSocial }} />
      ))}

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total empresas',  value: conteo.total,          color: '#023859' },
          { label: 'Habilitadas',     value: conteo.habilitadas,    color: '#1a7a4a' },
          { label: 'Pendientes',      value: conteo.pendientes,     color: '#a07010' },
          { label: 'Inhabilitadas',   value: conteo.inhabilitadas,  color: '#D91438' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
              {c.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #e2e8f0' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Empresas vinculadas
            </p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {filtradas.length} resultado(s)
            </p>
          </div>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
            style={{ background: '#D91438' }}>
            <Plus size={13} /> Nueva empresa
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o NIT..."
            className="h-8 px-3 rounded-lg text-xs outline-none flex-1"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859', maxWidth: 260 }}
          />
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los estados</option>
            <option value="SIN_COMPLETAR">Sin completar</option>
            <option value="PENDIENTE_HABILITACION">Pendiente habilitación</option>
            <option value="HABILITADA">Habilitada</option>
            <option value="INHABILITADA">Inhabilitada</option>
          </select>
          <select value={filtroSector} onChange={e => setFiltroSector(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los sectores</option>
            {sectores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Tabla */}
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Empresa', 'NIT', 'Sector', 'Contacto', 'Convenio', 'Documentos', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map(e => (
              <tr key={e.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.razonSocial}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                    {e.municipio} · {e.telefono}
                  </p>
                </td>
                <td className="px-4 py-3 text-[10px]" style={{ color: '#6b7a8d' }}>{e.nit}</td>
                <td className="px-4 py-3">
                  <span className="text-[9px] font-medium px-2 py-1 rounded"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {e.sectorEconomico}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs" style={{ color: '#023859' }}>{e.nombreContacto}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.emailContacto}</p>
                </td>
                <td className="px-4 py-3">
                  {e.convenio?.fechaFin ? (
                    <>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={new Date(e.convenio.fechaFin) > new Date()
                          ? { background: '#eaf7f0', color: '#1a7a4a' }
                          : { background: '#fef0f0', color: '#c0392b' }}>
                        {new Date(e.convenio.fechaFin) > new Date() ? 'Vigente' : 'Vencido'}
                      </span>
                      <p className="text-[9px] mt-0.5" style={{ color: '#8a9bb0' }}>
                        {new Date(e.convenio.fechaFin).getFullYear()}
                      </p>
                    </>
                  ) : (
                    <span className="text-[9px]" style={{ color: '#8a9bb0' }}>Sin convenio</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <DocPill label="Cám. comercio" url={e.camaraComercio?.url} validado={e.camaraComercio?.validado} />
                    <div className="flex gap-1">
                      <DocPill label="NIT"      url={e.nit_doc?.url}  validado={e.nit_doc?.validado} />
                      <DocPill label="Céd. RL"  url={e.cedulaRL?.url} validado={e.cedulaRL?.validado} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <BadgeEstadoEmpresa estado={e.estado} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/empresas/${e.id}`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Ver detalle">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => navigate(`/empresas/${e.id}/editar`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar">
                      <Edit size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-xs" style={{ color: '#8a9bb0' }}>
                  No se encontraron empresas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ModalNuevaEmpresa
          onClose={() => setModal(false)}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['empresas'] })
            setModal(false)
          }}
        />
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16"
            style={{ border: '0.5px solid #e2e8f0' }} />
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
        {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
      </div>
    </div>
  )
}