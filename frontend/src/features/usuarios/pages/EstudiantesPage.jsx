import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Edit, Power, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'
import { usuariosApi } from '../api/usuariosApi'
import { estudiantesApi } from '../api/estudiantesApi'
import Avatar from '../components/Avatar'
import BadgeAptitud from '../components/BadgeAptitud'
import BadgeEstadoUsuario from '../components/BadgeEstadoUsuario'
import ModalConfirmUsuario from '../components/ModalConfirmUsuario'
import ModalEstudiante from '../components/ModalEstudiante'
import ModalCargaMasiva from '../components/ModalCargaMasiva'

export default function EstudiantesPage() {
  const navigate  = useNavigate()
  const qc        = useQueryClient()
  const { user }  = useAuthStore()

  const [modal, setModal]             = useState(false)
  const [editando, setEditando]       = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [cargaMasiva, setCargaMasiva] = useState(false)
  const [busqueda, setBusqueda]       = useState('')
  const [filtroPrograma, setFiltroPrograma] = useState('')
  const [filtroAptitud, setFiltroAptitud]   = useState('')
  const [filtroSemestre, setFiltroSemestre] = useState('')

  const esCoordAcademica = user?.rol === ROLES.COORDINADOR_ACADEMICO

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['estudiantes'],
    queryFn:  estudiantesApi.getEstudiantes,
  })

  // Scope de programas para el coordinador académico
  const { data: misProgramas = [] } = useQuery({
    queryKey: ['mis-programas', user?.id],
    queryFn:  () => usuariosApi.getProgramasDeCoordinador(user.id),
    enabled:  esCoordAcademica && !!user?.id,
  })

  const programaIds = misProgramas.map(p => p.id)
  const estudiantesScope = esCoordAcademica && misProgramas.length > 0
    ? estudiantes.filter(e => programaIds.includes(e.programaId))
    : estudiantes

  // Filtros en frontend
  const filtrados = estudiantesScope.filter(e => {
    const matchBusqueda = !busqueda ||
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (e.documento ?? '').includes(busqueda)
    const matchPrograma  = !filtroPrograma  || e.nombrePrograma === filtroPrograma
    const matchAptitud   = !filtroAptitud   || e.estadoAptitud === filtroAptitud
    const matchSemestre  = !filtroSemestre  || String(e.semestre) === filtroSemestre
    return matchBusqueda && matchPrograma && matchAptitud && matchSemestre
  })

  const programasDisponibles = [...new Set(estudiantesScope.map(e => e.nombrePrograma))]

  const conteo = {
    total:      estudiantesScope.length,
    aptos:      estudiantesScope.filter(e => e.estadoAptitud === 'APTO').length,
    enRevision: estudiantesScope.filter(e => e.estadoAptitud === 'EN_REVISION').length,
    noAptos:    estudiantesScope.filter(e => e.estadoAptitud === 'NO_APTO').length,
  }

  const toggleMutation = useMutation({
    mutationFn: (est) => est.activo
      ? estudiantesApi.desactivarEstudiante(est.id)
      : estudiantesApi.activarEstudiante(est.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['estudiantes'] })
      toast.success('Estado actualizado')
      setConfirmando(null)
    },
    onError: () => toast.error('Error al cambiar el estado'),
  })

  const cargaMasivaMutation = useMutation({
    mutationFn: (file) => estudiantesApi.cargaMasivaEstudiantes(file),
    onSuccess: (creados) => {
      qc.invalidateQueries({ queryKey: ['estudiantes'] })
      toast.success(`${creados.length} estudiante(s) registrado(s) correctamente`)
      setCargaMasiva(false)
    },
    onError: () => toast.error('Error al procesar el archivo'),
  })

  if (isLoading) return <Skeleton />

  return (
    <div className="flex flex-col gap-4">

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total estudiantes', value: conteo.total,      color: '#023859' },
          { label: 'Aptos',             value: conteo.aptos,      color: '#1a7a4a' },
          { label: 'En revisión',       value: conteo.enRevision, color: '#a07010' },
          { label: 'No aptos',          value: conteo.noAptos,    color: '#D91438' },
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

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Estudiantes</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {filtrados.length} resultado(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCargaMasiva(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              <Upload size={13} /> Carga masiva
            </button>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#D91438' }}>
              <Plus size={13} /> Nuevo estudiante
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 px-5 py-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o documento..."
            className="h-8 px-3 rounded-lg text-xs outline-none flex-1"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859', maxWidth: 260 }}
          />
          <select value={filtroPrograma} onChange={e => setFiltroPrograma(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los programas</option>
            {programasDisponibles.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filtroAptitud} onChange={e => setFiltroAptitud(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los estados</option>
            <option value="SIN_EVALUAR">Sin evaluar</option>
            <option value="APTO">Apto</option>
            <option value="EN_REVISION">En revisión</option>
            <option value="NO_APTO">No apto</option>
          </select>
          <select value={filtroSemestre} onChange={e => setFiltroSemestre(e.target.value)}
            className="h-8 px-2 rounded-lg text-xs outline-none"
            style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
            <option value="">Todos los semestres</option>
            {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>Semestre {s}</option>)}
          </select>
        </div>

        {/* Tabla */}
        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Estudiante', 'Programa', 'Sem.', 'N° práctica', 'Créditos', 'Promedio', 'Aptitud', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(e => (
              <tr key={e.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar nombre={e.nombre} size={28} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.documento}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#6b7a8d', maxWidth: 120 }}>
                  <span title={e.nombrePrograma}>
                    {e.nombrePrograma?.replace('Ingeniería de ', 'Ing. ').replace('Administración de Empresas', 'Admon.')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {e.semestre}
                </td>
                <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {e.numeroPractica ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {e.creditosAprobados}
                </td>
                <td className="px-4 py-3 text-xs text-center" style={{ color: '#023859' }}>
                  {(e.promedioAcumulado ?? 0).toFixed(1)}
                </td>
                <td className="px-4 py-3">
                  <BadgeAptitud estado={e.estadoAptitud} />
                </td>
                <td className="px-4 py-3">
                  <BadgeEstadoUsuario activo={e.activo} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/usuarios/estudiantes/${e.id}`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Ver detalle">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => setEditando(e)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title="Editar">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => setConfirmando(e)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}
                      title={e.activo ? 'Desactivar' : 'Activar'}>
                      <Power size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-xs" style={{ color: '#8a9bb0' }}>
                  No se encontraron estudiantes con los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {(modal || editando) && (
        <ModalEstudiante
          estudiante={editando}
          programasDisponibles={programasDisponibles}
          onClose={() => { setModal(false); setEditando(null) }}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['estudiantes'] })
            setModal(false)
            setEditando(null)
          }}
        />
      )}

      {cargaMasiva && (
        <ModalCargaMasiva
          onClose={() => setCargaMasiva(false)}
          onSubir={(file) => cargaMasivaMutation.mutate(file)}
          cargando={cargaMasivaMutation.isPending}
        />
      )}

      {confirmando && (
        <ModalConfirmUsuario
          titulo={confirmando.activo ? 'Desactivar estudiante' : 'Activar estudiante'}
          mensaje={`¿Confirmas ${confirmando.activo ? 'desactivar' : 'activar'} a ${confirmando.nombre}?`}
          cargando={toggleMutation.isPending}
          onConfirmar={() => toggleMutation.mutate(confirmando)}
          onCancelar={() => setConfirmando(null)}
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
        {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-50 rounded mb-2" />)}
      </div>
    </div>
  )
}