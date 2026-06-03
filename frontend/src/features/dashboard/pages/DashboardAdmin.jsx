import StatCard from '@/components/common/StatCard'

export default function DashboardAdmin() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>
          Panel de administración
        </h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>
          Visión general del sistema
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Usuarios activos"    value="142" sub="En el sistema"        dotColor="#1a7a4a" />
        <StatCard label="Facultades"          value="2"   sub="Configuradas"         dotColor="#0B416B" />
        <StatCard label="Programas"           value="4"   sub="Activos"              dotColor="#0B416B" />
        <StatCard label="Accesos hoy"         value="38"  sub="Sesiones iniciadas"   dotColor="#a07010" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PanelLista titulo="Últimas acciones en bitácora" items={[
          { nombre: 'Registro masivo estudiantes', sub: 'Coord. Académica · hace 10 min', color: '#e6f0fb' },
          { nombre: 'Nuevo usuario creado',        sub: 'Administrador · hace 32 min',   color: '#eaf7f0' },
          { nombre: 'Plantilla de correo editada', sub: 'Administrador · hace 1 h',      color: '#fff8e6' },
        ]} />
        <PanelLista titulo="Usuarios registrados por rol" items={[
          { nombre: 'Estudiantes',           sub: '98 cuentas',  color: '#e6f0fb' },
          { nombre: 'Docentes asesores',     sub: '12 cuentas',  color: '#eaf7f0' },
          { nombre: 'Coordinadores',         sub: '4 cuentas',   color: '#fff8e6' },
          { nombre: 'Empresas vinculadas',   sub: '28 cuentas',  color: '#fef0f0' },
        ]} />
      </div>
    </div>
  )
}

function PanelLista({ titulo, items }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>{titulo}</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 py-2"
          style={{ borderBottom: i < items.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
          <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: item.color }} />
          <div>
            <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{item.nombre}</p>
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}