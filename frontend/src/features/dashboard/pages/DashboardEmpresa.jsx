import StatCard from '@/components/common/StatCard'

export default function DashboardEmpresa() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel empresa</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Gestión de vacantes y practicantes</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Vacantes activas"    value="3"  sub="Publicadas"        dotColor="#0B416B" />
        <StatCard label="Practicantes"        value="5"  sub="En práctica"       dotColor="#1a7a4a" />
        <StatCard label="Candidatos"          value="12" sub="En evaluación"     dotColor="#a07010" />
        <StatCard label="Convenio"            value="OK" sub="Vigente hasta 2028" dotColor="#1a7a4a" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>Mis vacantes</p>
          {[
            { titulo: 'Desarrollador Jr.',   programa: 'Ing. Software', estado: 'Activa',   bg: '#eaf7f0', tc: '#1a7a4a' },
            { titulo: 'Analista de datos',   programa: 'Ing. Industrial', estado: 'Activa', bg: '#eaf7f0', tc: '#1a7a4a' },
            { titulo: 'Aux. Administrativo', programa: 'Administración', estado: 'Pendiente', bg: '#fff8e6', tc: '#a07010' },
          ].map((v, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{v.titulo}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{v.programa}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: v.bg, color: v.tc }}>{v.estado}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>Practicantes activos</p>
          {[
            { nombre: 'Carlos Mendoza', cargo: 'Desarrollador Jr.',   bg: '#e6f0fb', tc: '#0B416B' },
            { nombre: 'Ana Ríos',       cargo: 'Analista de datos',   bg: '#e6f0fb', tc: '#0B416B' },
            { nombre: 'Pedro Lozano',   cargo: 'Aux. Administrativo', bg: '#e6f0fb', tc: '#0B416B' },
          ].map((p, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: p.bg, color: p.tc }}>
                {p.nombre.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{p.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{p.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}