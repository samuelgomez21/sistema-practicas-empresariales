import StatCard from '@/components/common/StatCard'
// import { PanelSimple } from './DashboardCoordinadorPractica'

export default function DashboardSecretaria() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel secretaría</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Gestión operativa de prácticas</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Empresas activas"  value="34" sub="Habilitadas"        dotColor="#1a7a4a" />
        <StatCard label="Vacantes abiertas" value="23" sub="Disponibles"        dotColor="#0B416B" />
        <StatCard label="En seguimiento"    value="31" sub="Prácticas activas"  dotColor="#a07010" />
        <StatCard label="Documentos pendientes" value="12" sub="Por revisar"    dotColor="#D91438" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Documentos pendientes de revisión
          </p>
          {[
            { nombre: 'Cámara de comercio',  sub: 'Empresa XYZ · Vence pronto',  bg: '#fff8e6', tc: '#a07010' },
            { nombre: 'Contrato convenio',   sub: 'Empresa ABC · Nuevo',          bg: '#e6f0fb', tc: '#0B416B' },
            { nombre: 'ARL estudiante',      sub: 'Carlos M. · Pendiente',        bg: '#fef0f0', tc: '#D91438' },
          ].map((item, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: item.bg }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{item.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{item.sub}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: item.bg, color: item.tc }}>Ver</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Actividad reciente
          </p>
          {[
            { nombre: 'Vacante aprobada',         sub: 'Bancolombia · hace 20 min',  bg: '#eaf7f0', tc: '#1a7a4a' },
            { nombre: 'Empresa habilitada',        sub: 'TechCo S.A. · hace 1 h',    bg: '#eaf7f0', tc: '#1a7a4a' },
            { nombre: 'Contrato generado',         sub: 'Ana Ríos · hace 2 h',       bg: '#e6f0fb', tc: '#0B416B' },
          ].map((item, i, arr) => (
            <div key={i} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: item.bg }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{item.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}