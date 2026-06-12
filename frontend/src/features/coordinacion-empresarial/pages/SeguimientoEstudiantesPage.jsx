import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Eye } from 'lucide-react'
import { coordEmpresarialApi, ESTADO_POSTULACION_LABEL } from '../api/coordEmpresarialApi'

const TABS = [
  { value: 'PROCESO',     label: 'Aptos para práctica'   },
  { value: 'SELECCION',   label: 'En proceso de selección' },
  { value: 'EN_PRACTICA', label: 'Paz y salvo'           },
]

export default function SeguimientoEstudiantesPage() {
  const navigate = useNavigate()
  const [tab,      setTab]      = useState('PROCESO')
  const [busqueda, setBusqueda] = useState('')

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['seguimiento-estudiantes'],
    queryFn:  coordEmpresarialApi.getEstudiantesSeguimiento,
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  const proceso    = estudiantes.filter(e => e.categoria === 'PROCESO')
  const enPractica = estudiantes.filter(e => e.categoria === 'EN_PRACTICA')

  // "En proceso de selección" = postulaciones activas (no seleccionadas ni rechazadas)
  const totalEnSeleccion = proceso.reduce((acc, e) =>
    acc + e.postulaciones.filter(p => !['SELECCIONADO', 'RECHAZADO'].includes(p.estado)).length, 0
  )

  const counts = { PROCESO: proceso.length, SELECCION: totalEnSeleccion, EN_PRACTICA: enPractica.length }

  let lista = tab === 'EN_PRACTICA' ? enPractica : proceso
  if (busqueda) {
    lista = lista.filter(e => e.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Seguimiento de estudiantes
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Proceso completo de prácticas — vista de seguimiento
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.value}
            onClick={() => setTab(t.value)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.value
              ? { background: '#023859', color: '#fff' }
              : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
            }>
            {t.label}
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: tab === t.value ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: tab === t.value ? '#fff' : '#6b7a8d',
              }}>
              {counts[t.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      {tab !== 'SELECCION' && (
        <div className="relative max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar estudiante..."
            className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
          />
        </div>
      )}

      {/* Tab: Aptos para práctica / Paz y salvo */}
      {tab !== 'SELECCION' && (
        <div className="flex flex-col gap-3">
          {lista.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                No hay estudiantes en esta categoría
              </p>
            </div>
          ) : lista.map(e => (
            <div key={e.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {e.nombre[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {e.programa} · Sem. {e.semestre}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                        Apto
                      </span>
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        Práctica #{e.numeroPractica}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/coordinacion-empresarial/estudiantes/${e.id}`)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                  title="Ver perfil e historial">
                  <Eye size={14} />
                </button>
              </div>

              {/* PROCESO: postulaciones */}
              {tab === 'PROCESO' && (
                <div className="pl-12">
                  <p className="text-[9px] font-bold uppercase tracking-wide mb-2"
                    style={{ color: '#8a9bb0' }}>
                    Empresas donde se ha postulado ({e.postulaciones.length})
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {e.postulaciones.map((p, idx) => {
                      const cfg = ESTADO_POSTULACION_LABEL[p.estado] ?? ESTADO_POSTULACION_LABEL.POSTULADO
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg"
                          style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                              {p.empresaNombre}
                            </span>
                            <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                              {p.vacanteTitulo}
                            </span>
                            {p.convenioVence && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: '#fff8e6', color: '#a07010' }}>
                                Convenio vence {new Date(p.convenioVence).toLocaleDateString('es-CO')}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* EN_PRACTICA: progreso del checklist */}
              {tab === 'EN_PRACTICA' && (
                <div className="pl-12">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px]" style={{ color: '#0B416B' }}>{e.empresaNombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                      <div className="h-1.5 rounded-full"
                        style={{
                          width: `${(e.checklist.filter(c => c.completado).length / e.checklist.length) * 100}%`,
                          background: '#0B416B',
                        }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: '#023859' }}>
                      {e.checklist.filter(c => c.completado).length}/{e.checklist.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: En proceso de selección — vista plana de postulaciones */}
      {tab === 'SELECCION' && (
        <div className="flex flex-col gap-2">
          {proceso.flatMap(e =>
            e.postulaciones
              .filter(p => !['SELECCIONADO', 'RECHAZADO'].includes(p.estado))
              .map((p, idx) => {
                const cfg = ESTADO_POSTULACION_LABEL[p.estado]
                return (
                  <div key={`${e.id}-${idx}`} className="bg-white rounded-xl p-4 flex items-center justify-between"
                    style={{ border: '0.5px solid #e2e8f0' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        {e.nombre[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                          {p.empresaNombre} — {p.vacanteTitulo}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })
          )}
        </div>
      )}
    </div>
  )
}