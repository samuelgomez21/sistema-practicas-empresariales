import { useQuery } from '@tanstack/react-query'
import StatCard from '@/components/common/StatCard'
import { empresasApi } from '@/features/empresas/api/empresasApi'
import { vacantesApi } from '@/features/vacantes/api/vacantesApi'

export default function DashboardCoordinadorPractica() {
  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn:  empresasApi.getEmpresas,
  })

  const { data: vacantes = [] } = useQuery({
    queryKey: ['vacantes'],
    queryFn:  vacantesApi.getVacantes,
  })

  const pendientes = vacantes.filter(v => v.estado === 'PENDIENTE')
  const aprobadas  = vacantes.filter(v => v.estado === 'APROBADA').length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>Panel coordinación empresarial</h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>Empresas, vacantes y procesos de selección</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Empresas vinculadas" value={empresas.length}    sub="Activas"            dotColor="#0B416B" />
        <StatCard label="Vacantes totales"    value={vacantes.length}    sub="Registradas"        dotColor="#023859" />
        <StatCard label="Aprobadas"           value={aprobadas}          sub="Visibles a estudiantes" dotColor="#1a7a4a" />
        <StatCard label="Pendientes"          value={pendientes.length}  sub="Requieren acción"   dotColor="#a07010" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Vacantes pendientes de aprobación
          </p>
          {pendientes.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>No hay vacantes pendientes</p>
          ) : pendientes.slice(0, 5).map((v, i) => (
            <div key={v.id} className="flex items-center justify-between py-2"
              style={{ borderBottom: i < pendientes.length - 1 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div>
                <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>{v.titulo}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{v.empresaNombre}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: '#fff8e6', color: '#a07010' }}>
                Pendiente
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Empresas registradas
          </p>
          {empresas.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>No hay empresas registradas</p>
          ) : empresas.slice(0, 5).map((e, i) => (
            <div key={e.id} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < 4 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                {e.razonSocial[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{e.razonSocial}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.sectorEconomico}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}