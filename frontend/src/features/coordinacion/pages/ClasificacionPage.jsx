import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Eye, Edit, X } from 'lucide-react'
import { toast } from 'sonner'
import { coordinacionApi, APTITUD_CONFIG } from '../api/coordinacionApi'
import ModalEvaluarAptitud from '../components/ModalEvaluarAptitud'
import ModalAsignarDocente from '../components/ModalAsignarDocente'

export default function ClasificacionPage() {
  const qc = useQueryClient()
  const [busqueda,       setBusqueda]       = useState('')
  const [filtroPrograma, setFiltroPrograma] = useState('')
  const [filtroEstado,   setFiltroEstado]   = useState('')
  const [modalAptitud,   setModalAptitud]   = useState(null)
  const [modalDocente,   setModalDocente]   = useState(null)

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['estudiantes-clasificacion'],
    queryFn:  coordinacionApi.getEstudiantes,
  })

  const { data: programas = [] } = useQuery({
    queryKey: ['programas'],
    queryFn:  coordinacionApi.getProgramas,
  })

  const filtrados = estudiantes.filter(e => {
    const matchBusqueda  = !busqueda || e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const matchPrograma  = !filtroPrograma || String(e.programaId) === filtroPrograma
    const matchEstado    = !filtroEstado   || e.estadoAptitud === filtroEstado
    return matchBusqueda && matchPrograma && matchEstado
  })

  const aptos      = estudiantes.filter(e => e.estadoAptitud === 'APTO').length
  const enRiesgo   = estudiantes.filter(e => e.estadoAptitud === 'EN_REVISION').length
  const noAptos    = estudiantes.filter(e => e.estadoAptitud === 'NO_APTO').length

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Clasificación de estudiantes
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            Semáforo de elegibilidad para práctica empresarial
          </p>
        </div>
      </div>

      {/* Tabs de programa */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFiltroPrograma('')}
          className="h-7 px-3 rounded-full text-[10px] font-semibold transition-all"
          style={!filtroPrograma
            ? { background: '#023859', color: '#fff' }
            : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
          Todos
        </button>
        {programas.map(p => (
          <button key={p.id} onClick={() => setFiltroPrograma(String(p.id))}
            className="h-7 px-3 rounded-full text-[10px] font-semibold transition-all"
            style={filtroPrograma === String(p.id)
              ? { background: '#023859', color: '#fff' }
              : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
            {p.nombre}
          </button>
        ))}
      </div>

      {/* Semáforo */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Aptos para práctica', value: aptos,    estado: 'APTO',        bg: '#eaf7f0', color: '#1a7a4a', icon: <CheckCircle size={20} /> },
          { label: 'En riesgo',           value: enRiesgo, estado: 'EN_REVISION', bg: '#fff8e6', color: '#a07010', icon: <span style={{ fontSize: 18 }}>⚠</span> },
          { label: 'No aptos',            value: noAptos,  estado: 'NO_APTO',     bg: '#fef0f0', color: '#c0392b', icon: <X size={20} /> },
        ].map(c => (
          <button key={c.label}
            onClick={() => setFiltroEstado(filtroEstado === c.estado ? '' : c.estado)}
            className="rounded-xl p-4 text-left transition-all"
            style={{
              background: c.bg,
              border: filtroEstado === c.estado
                ? `2px solid ${c.color}`
                : `0.5px solid ${c.color}30`,
            }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: c.color }}>
              {c.icon}
              <span className="text-3xl font-bold">{c.value}</span>
            </div>
            <p className="text-[10px] font-medium" style={{ color: c.color }}>{c.label}</p>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #e2e8f0' }}>

        {/* Filtros */}
        <div className="flex gap-3 px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar estudiante..."
            className="h-8 px-3 rounded-lg text-xs outline-none flex-1"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859', maxWidth: 280 }}
          />
          <select value={filtroPrograma} onChange={e => setFiltroPrograma(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los programas</option>
            {programas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los estados</option>
            <option value="APTO">Apto</option>
            <option value="EN_REVISION">En riesgo</option>
            <option value="NO_APTO">No apto</option>
            <option value="SIN_EVALUAR">Sin evaluar</option>
          </select>
        </div>

        {/* Leyenda */}
        <div className="flex gap-4 px-5 py-2"
          style={{ borderBottom: '0.5px solid #f0f2f5', background: '#fafbfc' }}>
          {Object.entries(APTITUD_CONFIG).slice(0, 3).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: v.dot }} />
              <span className="text-[9px]" style={{ color: '#6b7a8d' }}>
                <strong>{v.label}:</strong>{' '}
                {k === 'APTO' ? 'Todas las materias aprobadas'
                  : k === 'EN_REVISION' ? 'Materias pendientes'
                  : 'No alcanza requisitos'}
              </span>
            </div>
          ))}
        </div>

        {/* Encabezados */}
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Estado', 'Estudiante', 'Programa', 'Semestre', 'Docente asesor', 'N° Práctica', 'Empresa', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(e => {
              const cfg = APTITUD_CONFIG[e.estadoAptitud] ?? APTITUD_CONFIG.SIN_EVALUAR
              return (
                <tr key={e.id} className="hover:bg-gray-50"
                  style={{ borderBottom: '0.5px solid #f7f9fb' }}>

                  {/* Estado */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: cfg.dot }} />
                      <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                  </td>

                  {/* Estudiante */}
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
                  </td>

                  {/* Programa */}
                  <td className="px-4 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                    {e.programa}
                  </td>

                  {/* Semestre */}
                  <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                    Semestre {e.semestre}
                  </td>

                  {/* Docente */}
                  <td className="px-4 py-3">
                    {e.docenteNombre
                      ? <span className="text-xs" style={{ color: '#023859' }}>{e.docenteNombre}</span>
                      : <span className="text-[10px]" style={{ color: '#8a9bb0' }}>Sin asignar</span>
                    }
                  </td>

                  {/* N° Práctica */}
                  <td className="px-4 py-3">
                    {e.numeroPractica
                      ? <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                          style={{ background: '#e6f0fb', color: '#0B416B' }}>
                          Práctica #{e.numeroPractica}
                        </span>
                      : <span className="text-[10px]" style={{ color: '#8a9bb0' }}>—</span>
                    }
                  </td>

                  {/* Empresa */}
                  <td className="px-4 py-3">
                    {e.empresaNombre
                      ? <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                          style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                          {e.empresaNombre}
                        </span>
                      : <span className="text-[10px]" style={{ color: '#8a9bb0' }}>—</span>
                    }
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setModalAptitud(e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                        title="Evaluar aptitud">
                        <Edit size={13} />
                      </button>
                      {e.estadoAptitud === 'APTO' && e.practicaId && !e.docenteId && (
                        <button
                          onClick={() => setModalDocente(e)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ border: '0.5px solid #b5d4f4', background: '#e6f0fb', color: '#0B416B' }}
                          title="Asignar docente">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/>
                            <line x1="22" y1="11" x2="16" y2="11"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-xs"
                  style={{ color: '#8a9bb0' }}>
                  No se encontraron estudiantes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAptitud && (
        <ModalEvaluarAptitud
          estudiante={modalAptitud}
          onClose={() => setModalAptitud(null)}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['estudiantes-clasificacion'] })
            setModalAptitud(null)
          }}
        />
      )}

      {modalDocente && (
        <ModalAsignarDocente
          estudiante={modalDocente}
          onClose={() => setModalDocente(null)}
          onAsignado={() => {
            qc.invalidateQueries({ queryKey: ['estudiantes-clasificacion'] })
            qc.invalidateQueries({ queryKey: ['docentes-carga'] })
            setModalDocente(null)
            toast.success('Docente asignado correctamente')
          }}
        />
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-xl p-4 animate-pulse h-16"
        style={{ border: '0.5px solid #e2e8f0' }} />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-xl p-4 animate-pulse h-16 bg-gray-50" />
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 animate-pulse"
        style={{ border: '0.5px solid #e2e8f0' }}>
        {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-50 rounded mb-2" />)}
      </div>
    </div>
  )
}