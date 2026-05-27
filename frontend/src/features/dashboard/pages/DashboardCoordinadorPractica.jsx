import StatCard from '@/components/common/StatCard'

export default function DashboardCoordinadorPractica() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel coordinador de práctica</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Asignaciones, vacantes y seguimiento</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Estudiantes aptos"    value="48" sub="Listos para asignar" dotColor="#1a7a4a" />
        <StatCard label="Vacantes activas"     value="23" sub="Disponibles"         dotColor="#0B416B" />
        <StatCard label="Prácticas en curso"   value="31" sub="En seguimiento"      dotColor="#a07010" />
        <StatCard label="Sin empresa"          value="7"  sub="Pendientes"          dotColor="#D91438" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PanelSimple titulo="Asignaciones recientes" items={[
          { nombre: 'María Salcedo',  sub: 'Empresa Tecnológica S.A.', badge: 'Asignado',   bg: '#eaf7f0', tc: '#1a7a4a' },
          { nombre: 'Juan Pérez',     sub: 'Pendiente empresa',         badge: 'Sin empresa', bg: '#fef0f0', tc: '#D91438' },
          { nombre: 'Laura García',   sub: 'En revisión',               badge: 'En proceso',  bg: '#fff8e6', tc: '#a07010' },
        ]} />
        <PanelSimple titulo="Vacantes pendientes de aprobación" items={[
          { nombre: 'Desarrollador Jr.',   sub: 'Ing. Software · Grupo Éxito',  badge: 'Pendiente', bg: '#fff8e6', tc: '#a07010' },
          { nombre: 'Analista Turismo',    sub: 'Turismo · Aviatur S.A.',        badge: 'Pendiente', bg: '#fff8e6', tc: '#a07010' },
          { nombre: 'Aux. Administrativo', sub: 'Admon. · Bancolombia',          badge: 'Aprobada',  bg: '#eaf7f0', tc: '#1a7a4a' },
        ]} />
      </div>
    </div>
  )
}

function PanelSimple({ titulo, items }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>{titulo}</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 py-2"
          style={{ borderBottom: i < items.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: item.bg, color: item.tc }}>
            {item.nombre.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{item.nombre}</p>
            <p className="text-[10px] truncate" style={{ color: '#8a9bb0' }}>{item.sub}</p>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
            style={{ background: item.bg, color: item.tc }}>{item.badge}</span>
        </div>
      ))}
    </div>
  )
}