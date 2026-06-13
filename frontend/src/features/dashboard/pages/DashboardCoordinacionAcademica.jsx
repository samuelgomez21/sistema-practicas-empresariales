import { useQuery } from '@tanstack/react-query'
import StatCard from '@/components/common/StatCard'
import { coordinacionApi, APTITUD_CONFIG } from '@/features/coordinacion/api/coordinacionApi'

export default function DashboardCoordinacionAcademica() {
  const { data: estudiantes = [], isLoading: cargandoEst } = useQuery({
    queryKey: ['estudiantes-clasificacion'],
    queryFn:  coordinacionApi.getEstudiantes,
  })

  const { data: docentes = [], isLoading: cargandoDoc } = useQuery({
    queryKey: ['docentes-carga'],
    queryFn:  coordinacionApi.getDocentes,
  })

  const aptos    = estudiantes.filter(e => e.estadoAptitud === 'APTO').length
  const enRevision = estudiantes.filter(e => e.estadoAptitud === 'EN_REVISION').length
  const noAptos  = estudiantes.filter(e => e.estadoAptitud === 'NO_APTO').length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel académico</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Gestión de estudiantes y docentes</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Estudiantes registrados" value={cargandoEst ? '—' : estudiantes.length} sub="Activos"          dotColor="#0B416B" />
        <StatCard label="Aptos para práctica"     value={cargandoEst ? '—' : aptos}              sub="Validados"        dotColor="#1a7a4a" />
        <StatCard label="En revisión"             value={cargandoEst ? '—' : enRevision}         sub="Pendientes"       dotColor="#a07010" />
        <StatCard label="No aptos"                value={cargandoEst ? '—' : noAptos}            sub="Requieren acción" dotColor="#D91438" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PanelEstudiantes estudiantes={estudiantes} cargando={cargandoEst} />
        <PanelDocentes docentes={docentes} cargando={cargandoDoc} />
      </div>
    </div>
  )
}

function PanelEstudiantes({ estudiantes, cargando }) {
  const recientes = estudiantes.slice(0, 5)
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
        Estudiantes
      </p>
      {cargando ? (
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Cargando...</p>
      ) : recientes.length === 0 ? (
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin estudiantes registrados</p>
      ) : recientes.map((e, i) => {
        const cfg = APTITUD_CONFIG[e.estadoAptitud] ?? APTITUD_CONFIG.SIN_EVALUAR
        return (
          <div key={e.id} className="flex items-center gap-3 py-2"
            style={{ borderBottom: i < recientes.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: cfg.bg, color: cfg.color }}>
              {e.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{e.nombre}</p>
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.programa}</p>
            </div>
            <span className="text-[9px] font-bold px-2 py-1 rounded-full"
              style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
          </div>
        )
      })}
    </div>
  )
}

function PanelDocentes({ docentes, cargando }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
        Carga docente
      </p>
      {cargando ? (
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Cargando...</p>
      ) : docentes.length === 0 ? (
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Sin docentes registrados</p>
      ) : docentes.slice(0, 5).map((d, i) => (
        <div key={d.id} className="py-2"
          style={{ borderBottom: i < docentes.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
          <div className="flex justify-between mb-1">
            <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{d.nombre}</p>
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
              {d.estudiantesActivos.length}/{d.maxEstudiantes}
            </p>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${d.maxEstudiantes > 0 ? (d.estudiantesActivos.length / d.maxEstudiantes) * 100 : 0}%`, background: '#0B416B' }} />
          </div>
        </div>
      ))}
    </div>
  )
}