import StatCard from '@/components/common/StatCard'

export default function DashboardCoordinacionAcademica() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel académico</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Gestión de estudiantes y docentes</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Estudiantes registrados" value="98"  sub="Este semestre"    dotColor="#0B416B" />
        <StatCard label="Aptos para práctica"     value="48"  sub="Validados"        dotColor="#1a7a4a" />
        <StatCard label="En revisión"             value="23"  sub="Pendientes"       dotColor="#a07010" />
        <StatCard label="No aptos"                value="7"   sub="Requieren acción" dotColor="#D91438" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PanelEstudiantes />
        <PanelDocentes />
      </div>
    </div>
  )
}

function PanelEstudiantes() {
  const lista = [
    { nombre: 'Carlos Mendoza',  programa: 'Ing. Software',  estado: 'Apto',       color: '#eaf7f0', tc: '#1a7a4a' },
    { nombre: 'Ana Ríos',        programa: 'Administración', estado: 'En revisión', color: '#fff8e6', tc: '#a07010' },
    { nombre: 'Pedro Lozano',    programa: 'Turismo',        estado: 'No apto',    color: '#fef0f0', tc: '#D91438' },
  ]
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
        Estudiantes recientes
      </p>
      {lista.map((e, i) => (
        <div key={i} className="flex items-center gap-3 py-2"
          style={{ borderBottom: i < lista.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: e.color, color: e.tc }}>
            {e.nombre.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{e.nombre}</p>
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.programa}</p>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full"
            style={{ background: e.color, color: e.tc }}>{e.estado}</span>
        </div>
      ))}
    </div>
  )
}

function PanelDocentes() {
  const lista = [
    { nombre: 'Dr. Ramírez',    asignados: 8,  max: 10 },
    { nombre: 'Mg. Castellanos', asignados: 6, max: 8  },
    { nombre: 'Ing. Torres',    asignados: 3,  max: 10 },
  ]
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
        Carga docente
      </p>
      {lista.map((d, i) => (
        <div key={i} className="py-2"
          style={{ borderBottom: i < lista.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
          <div className="flex justify-between mb-1">
            <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{d.nombre}</p>
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{d.asignados}/{d.max}</p>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${(d.asignados / d.max) * 100}%`, background: '#0B416B' }} />
          </div>
        </div>
      ))}
    </div>
  )
}