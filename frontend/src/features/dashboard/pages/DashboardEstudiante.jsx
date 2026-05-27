import StatCard from '@/components/common/StatCard'

export default function DashboardEstudiante() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Mi práctica</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Resumen de tu proceso de práctica empresarial</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Estado"           value="Activa"  sub="En curso"               dotColor="#1a7a4a" />
        <StatCard label="Empresa"          value="TechCo"  sub="Asignada"               dotColor="#0B416B" />
        <StatCard label="Corte actual"     value="2 / 4"   sub="En seguimiento"         dotColor="#a07010" />
        <StatCard label="Paz y salvo"      value="No"      sub="Pendiente requisitos"   dotColor="#D91438" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Requisitos para paz y salvo
          </p>
          {[
            { label: 'Informe final',          done: false },
            { label: 'Encuesta de satisfacción', done: true },
            { label: 'Nota final registrada',  done: true  },
            { label: 'Documentos completos',   done: false },
            { label: 'Encuesta tutor',         done: false },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < 4 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: r.done ? '#eaf7f0' : '#fef0f0' }}>
                <span style={{ fontSize: 10, color: r.done ? '#1a7a4a' : '#D91438' }}>
                  {r.done ? '✓' : '✗'}
                </span>
              </div>
              <p className="text-[11px]" style={{ color: r.done ? '#1a7a4a' : '#023859' }}>
                {r.label}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Mi equipo de práctica
          </p>
          {[
            { rol: 'Empresa',          nombre: 'TechCo S.A.',     bg: '#e6f0fb', tc: '#0B416B' },
            { rol: 'Tutor empresarial', nombre: 'Ing. Vargas',    bg: '#eaf7f0', tc: '#1a7a4a' },
            { rol: 'Docente asesor',   nombre: 'Dr. Ramírez',     bg: '#fff8e6', tc: '#a07010' },
          ].map((p, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: p.bg, color: p.tc }}>
                {p.nombre[0]}
              </div>
              <div>
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{p.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{p.rol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}