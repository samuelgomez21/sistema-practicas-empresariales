import StatCard from '@/components/common/StatCard'

export default function DashboardTutor() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel tutor empresarial</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Estudiantes a tu cargo</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Estudiantes asignados" value="3"  sub="A tu cargo"       dotColor="#0B416B" />
        <StatCard label="Encuestas pendientes"  value="1"  sub="Por diligenciar"  dotColor="#D91438" />
        <StatCard label="Seguimientos"          value="6"  sub="Realizados"       dotColor="#1a7a4a" />
      </div>
      <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
          Mis estudiantes asignados
        </p>
        {[
          { nombre: 'Carlos Mendoza', programa: 'Ing. Software',  encuesta: false },
          { nombre: 'Ana Ríos',       programa: 'Administración', encuesta: true  },
          { nombre: 'Pedro Lozano',   programa: 'Turismo',        encuesta: false },
        ].map((e, i, arr) => (
          <div key={i} className="flex items-center gap-3 py-2"
            style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: '#e6f0fb', color: '#0B416B' }}>
              {e.nombre.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.programa}</p>
            </div>
            {e.encuesta && (
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: '#fef0f0', color: '#D91438' }}>
                Encuesta pendiente
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}