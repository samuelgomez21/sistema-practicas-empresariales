import StatCard from '@/components/common/StatCard'

export default function DashboardDocente() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel docente asesor</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Seguimiento de tus estudiantes asignados</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Estudiantes asignados" value="8"  sub="A tu cargo"          dotColor="#0B416B" />
        <StatCard label="Avances pendientes"    value="3"  sub="Por revisar"         dotColor="#a07010" />
        <StatCard label="Visitas realizadas"    value="5"  sub="Este semestre"       dotColor="#1a7a4a" />
        <StatCard label="Cierres próximos"      value="2"  sub="En los próximos 15d" dotColor="#D91438" />
      </div>
      <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
          Mis estudiantes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { nombre: 'Carlos Mendoza',  empresa: 'Grupo Éxito',        corte: 'Corte 2', estado: 'Al día',     bg: '#eaf7f0', tc: '#1a7a4a' },
            { nombre: 'Ana Ríos',        empresa: 'Bancolombia',         corte: 'Corte 1', estado: 'Pendiente',  bg: '#fff8e6', tc: '#a07010' },
            { nombre: 'Pedro Lozano',    empresa: 'Aviatur S.A.',        corte: 'Corte 2', estado: 'Al día',     bg: '#eaf7f0', tc: '#1a7a4a' },
            { nombre: 'Laura García',    empresa: 'TechCo S.A.',         corte: 'Corte 1', estado: 'Atrasado',   bg: '#fef0f0', tc: '#D91438' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: e.bg, color: e.tc }}>
                {e.nombre.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{e.nombre}</p>
                <p className="text-[10px] truncate" style={{ color: '#8a9bb0' }}>{e.empresa} · {e.corte}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: e.bg, color: e.tc }}>{e.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}