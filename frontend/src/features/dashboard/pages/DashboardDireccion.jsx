import StatCard from '@/components/common/StatCard'

export default function DashboardDireccion() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel de dirección</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Indicadores estratégicos del programa de prácticas</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Estudiantes en práctica" value="31"  sub="Este semestre"     dotColor="#0B416B" />
        <StatCard label="Empresas vinculadas"      value="28"  sub="Activas"           dotColor="#1a7a4a" />
        <StatCard label="Tasa de colocación"       value="87%" sub="Aptos asignados"   dotColor="#1a7a4a" />
        <StatCard label="Satisfacción empresas"    value="4.6" sub="Sobre 5.0"         dotColor="#a07010" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Distribución por programa
          </p>
          {[
            { programa: 'Ing. de Software',    cantidad: 14, color: '#0B416B', pct: 45 },
            { programa: 'Ing. Industrial',     cantidad: 8,  color: '#1a7a4a', pct: 26 },
            { programa: 'Administración',      cantidad: 6,  color: '#a07010', pct: 19 },
            { programa: 'Turismo',             cantidad: 3,  color: '#D91438', pct: 10 },
          ].map((p, i) => (
            <div key={i} className="py-2"
              style={{ borderBottom: i < 3 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="flex justify-between mb-1">
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{p.programa}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{p.cantidad} estudiantes</p>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                <div className="h-1.5 rounded-full"
                  style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Empresas con mayor vinculación
          </p>
          {[
            { nombre: 'Bancolombia',     practicantes: 4 },
            { nombre: 'Grupo Éxito',     practicantes: 3 },
            { nombre: 'Aviatur S.A.',    practicantes: 3 },
            { nombre: 'TechCo S.A.',     practicantes: 2 },
          ].map((e, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: '#e6f0fb' }} />
              <div className="flex-1">
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.practicantes} practicantes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}