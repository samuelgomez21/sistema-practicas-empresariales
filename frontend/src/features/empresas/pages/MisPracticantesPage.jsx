import { useQuery } from '@tanstack/react-query'
import { empresasApi } from '../api/empresasApi'
import api from '@/lib/axios'

export default function MisPracticantesPage() {

  const { data: empresa } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  // Obtener prácticas activas que tienen asignada esta empresa
  const { data: practicantes = [], isLoading } = useQuery({
    queryKey: ['mis-practicantes', empresa?.id],
    queryFn:  async () => {
      if (!empresa?.id) return []

      // Obtener todas las prácticas en vinculación o activas de esta empresa
      const { data } = await api.get(
        `/practicas/empresa/${empresa.id}`
      )
      return (data ?? []).map(p => ({
        id:              p.estudianteId ?? p.estudiante?.id,
        nombre:          p.nombreEstudiante ?? p.estudiante?.nombre,
        programa:        p.programa   ?? p.estudiante?.programa,
        semestre:        p.semestre         ?? p.estudiante?.semestre,
        correo:          p.emailEstudiante  ?? p.estudiante?.email,
        numeroPractica:  p.numeroPractica,
        estado:          p.estado,
      }))
    },
    enabled: !!empresa?.id,
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="px-5 py-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            Mis practicantes activos
          </p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            {practicantes.length} practicante(s) actualmente con nosotros
          </p>
        </div>

        {practicantes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              No hay practicantes activos en este momento
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f7f9fb' }}>
                {['Estudiante', 'Programa', 'Semestre', 'N° práctica', 'Estado', 'Correo'].map(h => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {practicantes.map(e => (
                <tr key={e.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                  className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        {e.nombre?.[0]}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                        {e.nombre}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>{e.programa}</td>
                  <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>
                    {e.semestre}
                  </td>
                  <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>
                    #{e.numeroPractica}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={e.estado === 'EN_PRACTICA'
                        ? { background: '#eaf7f0', color: '#1a7a4a' }
                        : { background: '#e6f0fb', color: '#0B416B' }}>
                      {e.estado === 'EN_PRACTICA' ? 'En práctica'
                        : e.estado === 'EN_PROCESO_VINCULACION' ? 'En vinculación'
                        : e.estado === 'CONVENIO_REGISTRADO' ? 'Convenio registrado'
                        : e.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>{e.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}