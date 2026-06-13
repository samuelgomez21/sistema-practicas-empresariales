import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Building2, Briefcase, Users, ClipboardList, ArrowRight, Clock } from 'lucide-react'
import { empresasApi } from '@/features/empresas/api/empresasApi'
import { vacantesApi, ESTADO_VACANTE } from '@/features/vacantes/api/vacantesApi'
import { coordEmpresarialApi } from '@/features/coordinacion-empresarial/api/coordEmpresarialApi'

function StatCard({ label, value, sub, color = '#023859', bg = '#fff', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 flex flex-col gap-1 ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
      style={{ border: '0.5px solid #e2e8f0', background: bg }}>
      <p className="text-[10px] uppercase tracking-wide" style={{ color, opacity: 0.7 }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px]" style={{ color, opacity: 0.6 }}>{sub}</p>}
    </div>
  )
}

export default function DashboardCoordinadorPractica() {
  const navigate = useNavigate()

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn:  empresasApi.getEmpresas,
  })

  const { data: vacantes = [] } = useQuery({
    queryKey: ['vacantes'],
    queryFn:  vacantesApi.getVacantes,
  })

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['estudiantes-coordinador'],
    queryFn:  coordEmpresarialApi.getEstudiantesPorCoordinador,
  })

  const pendientes  = vacantes.filter(v => v.estado === 'PENDIENTE')
  const aprobadas   = vacantes.filter(v => v.estado === 'APROBADA').length
  const aptosTotal  = estudiantes.filter(e => e.estadoAptitud === 'APTO').length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>
          Panel coordinación empresarial
        </h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>
          Gestión de empresas, vacantes y seguimiento de estudiantes
        </p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Empresas vinculadas"
          value={empresas.length}
          sub="Activas"
          color="#0B416B"
          bg="#f0f6ff"
          onClick={() => navigate('/empresas/listado')}
        />
        <StatCard
          label="Vacantes aprobadas"
          value={aprobadas}
          sub="Visibles a estudiantes"
          color="#1a7a4a"
          bg="#eaf7f0"
          onClick={() => navigate('/vacantes/listado')}
        />
        <StatCard
          label="Pendientes aprobación"
          value={pendientes.length}
          sub="Requieren tu acción"
          color="#a07010"
          bg="#fff8e6"
          onClick={() => navigate('/vacantes/listado')}
        />
        <StatCard
          label="Estudiantes aptos"
          value={aptosTotal}
          sub="En tus programas"
          color="#023859"
          onClick={() => navigate('/coordinacion-empresarial/estudiantes')}
        />
      </div>

      {/* Alerta de vacantes pendientes */}
      {pendientes.length > 0 && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
          style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}
          onClick={() => navigate('/vacantes/listado')}>
          <div className="flex items-center gap-2">
            <Clock size={15} style={{ color: '#a07010' }} />
            <p className="text-xs font-semibold" style={{ color: '#a07010' }}>
              {pendientes.length} vacante(s) esperan tu aprobación
            </p>
          </div>
          <ArrowRight size={14} style={{ color: '#a07010' }} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Vacantes pendientes */}
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-3 pb-2"
            style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-[12px] font-semibold" style={{ color: '#023859' }}>
              Vacantes por aprobar
            </p>
            <button
              onClick={() => navigate('/vacantes/listado')}
              className="text-[10px] font-semibold flex items-center gap-1"
              style={{ color: '#0B416B' }}>
              Ver todas <ArrowRight size={11} />
            </button>
          </div>
          {pendientes.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin vacantes pendientes</p>
          ) : pendientes.slice(0, 5).map((v, i) => (
            <div key={v.id}
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-1"
              style={{ borderBottom: i < Math.min(pendientes.length, 5) - 1 ? '0.5px solid #f0f2f5' : 'none' }}
              onClick={() => navigate(`/vacantes/${v.id}`)}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#e6f0fb' }}>
                  <Briefcase size={12} style={{ color: '#0B416B' }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{v.titulo}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{v.empresaNombre}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#fff8e6', color: '#a07010' }}>
                Pendiente
              </span>
            </div>
          ))}
        </div>

        {/* Empresas recientes */}
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-3 pb-2"
            style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-[12px] font-semibold" style={{ color: '#023859' }}>
              Empresas vinculadas
            </p>
            <button
              onClick={() => navigate('/empresas/listado')}
              className="text-[10px] font-semibold flex items-center gap-1"
              style={{ color: '#0B416B' }}>
              Ver todas <ArrowRight size={11} />
            </button>
          </div>
          {empresas.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>No hay empresas registradas</p>
          ) : empresas.slice(0, 5).map((e, i) => (
            <div key={e.id}
              className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded px-1"
              style={{ borderBottom: i < Math.min(empresas.length, 5) - 1 ? '0.5px solid #f0f2f5' : 'none' }}
              onClick={() => navigate(`/empresas/${e.id}`)}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                {e.razonSocial[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>
                  {e.razonSocial}
                </p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.sectorEconomico}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Estudiantes aptos */}
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-3 pb-2"
            style={{ borderBottom: '0.5px solid #f0f2f5' }}>
            <p className="text-[12px] font-semibold" style={{ color: '#023859' }}>
              Estudiantes aptos (mis programas)
            </p>
            <button
              onClick={() => navigate('/coordinacion-empresarial/estudiantes')}
              className="text-[10px] font-semibold flex items-center gap-1"
              style={{ color: '#0B416B' }}>
              Ver todos <ArrowRight size={11} />
            </button>
          </div>
          {estudiantes.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin estudiantes aptos asignados</p>
          ) : estudiantes.slice(0, 5).map((e, i) => (
            <div key={e.id}
              className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < Math.min(estudiantes.length, 5) - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                {e.nombre[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{e.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  {e.nombrePrograma} · Sem. {e.semestre}
                </p>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                Apto
              </span>
            </div>
          ))}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Accesos rápidos
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Crear nueva empresa',     path: '/empresas/listado',                      color: '#0B416B', bg: '#e6f0fb' },
              { label: 'Revisar vacantes',         path: '/vacantes/listado',                      color: '#a07010', bg: '#fff8e6' },
              { label: 'Gestionar tutores',        path: '/empresas/tutores-admin',                color: '#023859', bg: '#f0f2f5' },
              { label: 'Seguimiento estudiantes',  path: '/coordinacion-empresarial/estudiantes',  color: '#1a7a4a', bg: '#eaf7f0' },
              { label: 'Gestionar encuestas',      path: '/coordinacion-empresarial/encuestas',    color: '#6d28d9', bg: '#f3e8ff' },
              { label: 'Contratos',                path: '/coordinacion-empresarial/contratos',    color: '#D91438', bg: '#fef0f0' },
              { label: 'Prácticas activas', path: '/coordinacion-empresarial/practicas', color: '#0B416B', bg: '#e6f0fb' },
            ].map(item => (
              <button key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-between h-9 px-3 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: item.bg, color: item.color }}>
                {item.label}
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}