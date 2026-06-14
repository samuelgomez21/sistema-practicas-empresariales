import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi, ESTADO_POSTULACION_LABEL } from '../api/coordEmpresarialApi'
import ModalPostularEstudiante from '../components/ModalPostularEstudiante'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'

const APTITUD_STYLE = {
  APTO:        { bg: '#eaf7f0', color: '#1a7a4a', label: 'Apto'        },
  NO_APTO:     { bg: '#fef0f0', color: '#c0392b', label: 'No apto'     },
  EN_REVISION: { bg: '#fff8e6', color: '#a07010', label: 'En revisión' },
  SIN_EVALUAR: { bg: '#f0f2f5', color: '#6b7a8d', label: 'Sin evaluar' },
}

export default function EstudiantesCoordPage() {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()

  // Secretaría NO puede postular estudiantes
  const puedePostular = user?.rol !== ROLES.SECRETARIA_COORDINACION

  const [busqueda,       setBusqueda]       = useState('')
  const [filtroPrograma, setFiltroPrograma] = useState('')
  const [modalPostular,  setModalPostular]  = useState(null)

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['estudiantes-coordinador'],
    queryFn:  coordEmpresarialApi.getEstudiantesPorCoordinador,
  })

  const { data: postulaciones = [] } = useQuery({
    queryKey: ['postulaciones-todas'],
    queryFn:  async () => {
      const res = await import('@/lib/axios').then(m => m.default.get('/postulaciones'))
      return res.data ?? []
    },
  })

  const programas = [...new Set(estudiantes.map(e => e.nombrePrograma).filter(Boolean))]

  const filtrados = estudiantes.filter(e => {
    const matchBusqueda = !busqueda ||
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.identificacion?.includes(busqueda)
    const matchPrograma = !filtroPrograma || e.nombrePrograma === filtroPrograma
    return matchBusqueda && matchPrograma
  })

  const postulacionesPorEstudiante = (estudianteId) =>
    postulaciones.filter(p => p.estudianteId === estudianteId)

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Estudiantes — mis programas
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          {filtrados.length} estudiante(s) aptos en los programas asignados
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o identificación..."
            className="w-full h-9 pl-8 pr-3 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
          />
        </div>
        <select value={filtroPrograma} onChange={e => setFiltroPrograma(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs outline-none"
          style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
          <option value="">Todos los programas</option>
          {programas.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Estudiante', 'Programa', 'Semestre', 'Promedio', 'Aptitud', 'Postulaciones', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(e => {
              const apt   = APTITUD_STYLE[e.estadoAptitud] ?? APTITUD_STYLE.SIN_EVALUAR
              const posts = postulacionesPorEstudiante(e.id)
              return (
                <tr key={e.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        {e.nombre[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
                        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.correo ?? e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#6b7a8d' }}>{e.nombrePrograma}</td>
                  <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                    {e.semestre}
                  </td>
                  <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                    {Number(e.promedioAcumulado ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: apt.bg, color: apt.color }}>
                      {apt.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {posts.length === 0 ? (
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>Sin postulaciones</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {posts.slice(0, 2).map(p => {
                          const cfg = ESTADO_POSTULACION_LABEL[p.estado] ?? ESTADO_POSTULACION_LABEL.POSTULADO
                          return (
                            <span key={p.id}
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block w-fit"
                              style={{ background: cfg.bg, color: cfg.color }}>
                              {cfg.label}
                            </span>
                          )
                        })}
                        {posts.length > 2 && (
                          <span className="text-[9px]" style={{ color: '#8a9bb0' }}>
                            +{posts.length - 2} más
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/coordinacion-empresarial/estudiantes/${e.id}`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                        title="Ver historial">
                        <Eye size={13} />
                      </button>
                      {/* Postular — solo COORDINADOR_PRACTICA y ADMINISTRADOR */}
                      {puedePostular && e.estadoAptitud === 'APTO' && (
                        <button
                          onClick={() => setModalPostular(e)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ border: '0.5px solid #e2e8f0', background: '#e6f0fb', color: '#0B416B' }}
                          title="Postular a vacante">
                          <UserPlus size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-xs"
                  style={{ color: '#8a9bb0' }}>
                  No se encontraron estudiantes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalPostular && (
        <ModalPostularEstudiante
          estudiante={modalPostular}
          onClose={() => setModalPostular(null)}
          onPostulado={() => {
            setModalPostular(null)
            toast.success('Estudiante postulado correctamente')
          }}
        />
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
    </div>
  )
}