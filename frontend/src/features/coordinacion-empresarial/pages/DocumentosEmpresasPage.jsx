import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Download, Search, Building2, FileText } from 'lucide-react'
import { empresasApi } from '@/features/empresas/api/empresasApi'

const TIPO_CONFIG = {
  CAMARA_COMERCIO: { label: 'Cámara de Comercio',         color: '#0B416B', bg: '#e6f0fb' },
  NIT:             { label: 'RUT / NIT',                   color: '#6d28d9', bg: '#f3e8ff' },
  CEDULA_RL:       { label: 'Cédula Representante Legal',  color: '#a07010', bg: '#fff8e6' },
  CONVENIO:        { label: 'Convenio Universidad',        color: '#1a7a4a', bg: '#eaf7f0' },
}

export default function DocumentosEmpresasPage() {
  const [busqueda,   setBusqueda]   = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEmp,  setFiltroEmp]  = useState('')

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos-empresas'],
    queryFn:  empresasApi.getTodosLosDocumentos,
  })

  // Empresas únicas para el filtro
  const empresas = [...new Map(
    documentos.map(d => [d.empresaId, { id: d.empresaId, nombre: d.empresaNombre }])
  ).values()]

  const filtrados = documentos.filter(d => {
    const matchBusqueda = !busqueda ||
      d.empresaNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.nombreArchivo?.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo = !filtroTipo || d.tipo === filtroTipo
    const matchEmp  = !filtroEmp  || String(d.empresaId) === filtroEmp
    return matchBusqueda && matchTipo && matchEmp
  })

  // Agrupar por empresa
  const porEmpresa = filtrados.reduce((acc, doc) => {
    const key = doc.empresaId
    if (!acc[key]) acc[key] = { nombre: doc.empresaNombre, docs: [] }
    acc[key].docs.push(doc)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Documentos de empresas
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Revisa la documentación legal cargada por las empresas vinculadas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-3"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-lg"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
          <Search size={13} style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar empresa o archivo..."
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: '#023859' }} />
        </div>

        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select
          value={filtroEmp}
          onChange={e => setFiltroEmp(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859',
                   maxWidth: '200px' }}>
          <option value="">Todas las empresas</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>

        <span className="text-[10px] font-semibold whitespace-nowrap"
          style={{ color: '#8a9bb0' }}>
          {filtrados.length} documento(s)
        </span>
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
              style={{ border: '0.5px solid #e2e8f0' }} />
          ))}
        </div>
      ) : Object.keys(porEmpresa).length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <FileText size={32} className="mx-auto mb-3" style={{ color: '#8a9bb0' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            No hay documentos disponibles
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            Las empresas aún no han cargado su documentación legal
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(porEmpresa).map(([empresaId, { nombre, docs }]) => (
            <div key={empresaId} className="bg-white rounded-xl overflow-hidden"
              style={{ border: '0.5px solid #e2e8f0' }}>

              {/* Header empresa */}
              <div className="flex items-center gap-2 px-5 py-3"
                style={{ background: '#f7f9fb', borderBottom: '0.5px solid #e2e8f0' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#e6f0fb' }}>
                  <Building2 size={13} style={{ color: '#0B416B' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color: '#023859' }}>{nombre}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                    {docs.length} documento(s) cargado(s)
                  </p>
                </div>

                {/* Semáforo */}
                <div className="flex gap-1.5 items-center">
                  {Object.entries(TIPO_CONFIG).map(([tipo, cfg]) => {
                    const tiene = docs.some(d => d.tipo === tipo)
                    return (
                      <span key={tipo} title={cfg.label + (tiene ? ' ✓' : ' — Pendiente')}
                        className="w-2 h-2 rounded-full"
                        style={{ background: tiene ? '#1a7a4a' : '#e2e8f0' }} />
                    )
                  })}
                </div>
              </div>

              {/* Grid de documentos */}
              <div className="p-4 grid grid-cols-2 gap-3">

                {/* Tipos faltantes */}
                {Object.entries(TIPO_CONFIG)
                  .filter(([tipo]) => !docs.some(d => d.tipo === tipo))
                  .map(([tipo, cfg]) => (
                    <div key={tipo} className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: '#f0f2f5' }}>
                        <FileText size={14} style={{ color: '#8a9bb0' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold" style={{ color: '#8a9bb0' }}>
                          {cfg.label}
                        </p>
                        <p className="text-[10px]" style={{ color: '#c0c8d4' }}>
                          Pendiente de carga
                        </p>
                      </div>
                    </div>
                  ))
                }

                {/* Documentos cargados */}
                {docs.map(doc => {
                  const cfg = TIPO_CONFIG[doc.tipo] ?? {
                    label: doc.tipo, color: '#023859', bg: '#f0f2f5',
                  }
                  return (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: cfg.bg + '55',
                        border: `0.5px solid ${cfg.bg}`,
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: cfg.bg }}>
                        <FileText size={14} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                          {cfg.label}
                        </p>
                        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                          {doc.fechaVigencia
                            ? `Vigencia: ${new Date(doc.fechaVigencia).toLocaleDateString('es-CO')}`
                            : doc.fechaCarga
                              ? `Cargado: ${new Date(doc.fechaCarga).toLocaleDateString('es-CO')}`
                              : 'Sin fecha'}
                        </p>
                      </div>

                      {/* ── Botones Ver / Descargar — abren URL de Cloudinary directamente ── */}
                      <div className="flex gap-1 flex-shrink-0">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold"
                          style={{ background: '#e6f0fb', color: '#0B416B' }}>
                          <ExternalLink size={10} /> Ver
                        </a>
                        <a
                          href={doc.url}
                          download={doc.nombreArchivo ?? cfg.label}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold"
                          style={{
                            background: '#f4f6f9',
                            color: '#023859',
                            border: '0.5px solid #e2e8f0',
                          }}>
                          <Download size={10} />
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}