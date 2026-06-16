import { useQuery } from '@tanstack/react-query'
import StatCard from '@/components/common/StatCard'
import api from '@/lib/axios'

export default function DashboardAdmin() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-estadisticas'],
    queryFn: async () => {
      const res = await api.get('/dashboard/estadisticas')
      return res.data
    }
  })

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
        <StatCard label="Usuarios activos"    value={isLoading ? '...' : data?.totalUsuarios || 0} sub="En el sistema"        dotColor="#1a7a4a" />
        <StatCard label="Vacantes Totales"    value={isLoading ? '...' : data?.totalVacantes || 0}   sub="Registradas"         dotColor="#0B416B" />
        <StatCard label="Vacantes Aprob."     value={isLoading ? '...' : data?.vacantesAprobadas || 0}   sub="Activas"              dotColor="#0B416B" />
        <StatCard label="Postulaciones"       value={isLoading ? '...' : data?.totalPostulaciones || 0}  sub="Enviadas"   dotColor="#a07010" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PanelLista titulo="Información en Vivo" items={[
          { nombre: 'El sistema está conectado', sub: 'A base de datos de producción', color: '#e6f0fb' },
          { nombre: 'Los datos son reales',        sub: 'Sincronización instantánea',   color: '#eaf7f0' },
          { nombre: 'Todo está listo para usar', sub: '¡Éxitos en la sustentación!',      color: '#fff8e6' },
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