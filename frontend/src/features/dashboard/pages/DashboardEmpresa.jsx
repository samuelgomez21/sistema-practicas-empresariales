import { useQuery } from '@tanstack/react-query'
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react'
import StatCard from '@/components/common/StatCard'
import { empresasApi } from '@/features/empresas/api/empresasApi'
import { vacantesApi, ESTADO_POSTULACION } from '@/features/vacantes/api/vacantesApi'

export default function DashboardEmpresa() {
  const { data: empresa } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  const { data: vacantes = [] } = useQuery({
    queryKey: ['mis-vacantes', empresa?.id],
    queryFn:  () => vacantesApi.getVacantesPorEmpresa(empresa.id),
    enabled:  !!empresa?.id,
  })

  const { data: tutores = [] } = useQuery({
    queryKey: ['tutores', empresa?.id],
    queryFn:  () => empresasApi.getTutoresByEmpresa(empresa.id),
    enabled:  !!empresa?.id,
  })

  const aprobadas  = vacantes.filter(v => v.estado === 'APROBADA').length
  const pendientes = vacantes.filter(v => v.estado === 'PENDIENTE').length

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: '#023859' }}>
          {empresa?.razonSocial ?? 'Panel de empresa'}
        </h2>
        <p className="text-xs" style={{ color: '#8a9bb0' }}>
          {empresa?.sectorEconomico} · {empresa?.municipio}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Vacantes publicadas" value={vacantes.length}  sub="Total"               dotColor="#0B416B" />
        <StatCard label="Aprobadas"           value={aprobadas}        sub="Visibles a estudiantes" dotColor="#1a7a4a" />
        <StatCard label="Pendientes"          value={pendientes}       sub="Por aprobar"         dotColor="#a07010" />
        <StatCard label="Tutores registrados" value={tutores.length}   sub="Activos"             dotColor="#D91438" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Vacantes recientes
          </p>
          {vacantes.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>Aún no has publicado vacantes</p>
          ) : vacantes.slice(0, 5).map((v, i) => (
            <div key={v.id} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < 4 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#e6f0fb' }}>
                <Briefcase size={13} style={{ color: '#0B416B' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{v.titulo}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  {v.cuposDisponibles}/{v.cuposTotales} cupos
                </p>
              </div>
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={v.estado === 'APROBADA' ? { background: '#eaf7f0', color: '#1a7a4a' }
                  : v.estado === 'PENDIENTE' ? { background: '#fff8e6', color: '#a07010' }
                  : { background: '#f0f2f5', color: '#6b7a8d' }}>
                {v.estado}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-[12px] font-semibold mb-3" style={{ color: '#023859' }}>
            Tutores empresariales
          </p>
          {tutores.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>No tienes tutores registrados</p>
          ) : tutores.slice(0, 5).map((t, i) => (
            <div key={t.id} className="flex items-center gap-3 py-2"
              style={{ borderBottom: i < 4 ? '0.5px solid #f0f2f5' : 'none' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                {t.nombre[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: '#023859' }}>{t.nombre}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{t.cargo}</p>
              </div>
              <div className="w-2 h-2 rounded-full" style={{ background: t.activo ? '#1a7a4a' : '#8a9bb0' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}