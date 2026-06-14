import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'
import api from '@/lib/axios'

// Etiquetas legibles para cada clave del checklist
const CHECKLIST_LABELS = {
  nota_final:          'Nota final registrada',
  encuesta_tutor:      'Encuesta del tutor',
  encuesta_estudiante: 'Encuesta del estudiante',
  documentos_completos: 'Documentos (ARL + Planeador)',
  informe_final:       'Informe final cargado',
}

export default function PazYSalvoCoordPage() {
  const [busqueda, setBusqueda] = useState('')

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['seguimiento-paz-salvo'],
    queryFn:  coordEmpresarialApi.getEstudiantesSeguimiento,
  })

  const enPractica   = estudiantes.filter(e => e.estado === 'EN_PRACTICA')
  const conPazYSalvo = enPractica.filter(e =>
    e.checklist.length > 0 && e.checklist.every(c => c.completado)
  )
  const pendientes = enPractica.filter(e =>
    e.checklist.length === 0 || !e.checklist.every(c => c.completado)
  )

  const filtrarPorBusqueda = (lista) => lista.filter(e =>
    !busqueda ||
    e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.empresaNombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Paz y salvo de práctica
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Seguimiento del cumplimiento de requisitos para cierre de práctica
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Con paz y salvo', value: conPazYSalvo.length,
            bg: '#eaf7f0', border: '#b6e8cf', color: '#1a7a4a' },
          { label: 'Pendientes',      value: pendientes.length,
            bg: '#fef0f0', border: '#f7c1c1', color: '#c0392b' },
          { label: 'Total en práctica', value: enPractica.length,
            bg: '#fff', border: '#e2e8f0', color: '#023859' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center"
            style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px]" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Búsqueda */}
      {enPractica.length > 0 && (
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
            <Search size={13} style={{ color: '#8a9bb0' }} />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o empresa..."
              className="flex-1 text-xs outline-none bg-transparent"
              style={{ color: '#023859' }} />
          </div>
        </div>
      )}

      {enPractica.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm" style={{ color: '#8a9bb0' }}>
            No hay estudiantes en práctica activa
          </p>
        </div>
      ) : (
        <>
          {/* Pendientes */}
          {filtrarPorBusqueda(pendientes).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a07010' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Pendientes por paz y salvo ({filtrarPorBusqueda(pendientes).length})
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {filtrarPorBusqueda(pendientes).map(e => {
                  const completados = e.checklist.filter(c => c.completado).length
                  const total       = e.checklist.length
                  const pct         = total > 0 ? Math.round((completados / total) * 100) : 0

                  return (
                    <div key={e.id} className="bg-white rounded-xl p-5"
                      style={{ border: '0.5px solid #e2e8f0' }}>

                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#023859' }}>
                            {e.nombre}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                            {e.programa} · {e.empresaNombre}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                            style={{ background: '#fff8e6', color: '#a07010' }}>
                            {completados}/{total} requisitos
                          </span>
                          <span className="text-[9px] font-bold" style={{ color: '#8a9bb0' }}>
                            {pct}% completado
                          </span>
                        </div>
                      </div>

                      {/* Barra progreso */}
                      <div className="w-full h-1.5 rounded-full mb-4"
                        style={{ background: '#f0f2f5' }}>
                        <div className="h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pct === 100 ? '#1a7a4a' : '#a07010' }} />
                      </div>

                      {/* Checklist — 2 columnas alineadas */}
                      {e.checklist.length === 0 ? (
                        <p className="text-xs" style={{ color: '#8a9bb0' }}>
                          Checklist no disponible para esta práctica
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {e.checklist.map(c => (
                            <div key={c.clave}
                              className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                              style={{
                                background: c.completado ? '#f0faf4' : '#f7f9fb',
                                border:     `0.5px solid ${c.completado ? '#b6e8cf' : '#e2e8f0'}`,
                              }}>
                              {c.completado
                                ? <CheckCircle size={13} style={{ color: '#1a7a4a', flexShrink: 0 }} />
                                : <XCircle    size={13} style={{ color: '#c0392b', flexShrink: 0 }} />
                              }
                              <p className="text-[10px] font-medium"
                                style={{ color: c.completado ? '#1a7a4a' : '#6b7a8d' }}>
                                {CHECKLIST_LABELS[c.clave] ?? c.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Con paz y salvo */}
          {filtrarPorBusqueda(conPazYSalvo).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1a7a4a' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Con paz y salvo completo ({filtrarPorBusqueda(conPazYSalvo).length})
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {filtrarPorBusqueda(conPazYSalvo).map(e => (
                  <div key={e.id}
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{ background: '#f7fdf9', border: '0.5px solid #b6e8cf' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#023859' }}>
                        {e.nombre}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                        {e.programa} · {e.empresaNombre}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                      <CheckCircle size={11} /> Listo para cierre
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sin resultados en búsqueda */}
          {busqueda && filtrarPorBusqueda(pendientes).length === 0
            && filtrarPorBusqueda(conPazYSalvo).length === 0 && (
            <div className="bg-white rounded-xl p-6 text-center"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                Ningún estudiante coincide con la búsqueda
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}