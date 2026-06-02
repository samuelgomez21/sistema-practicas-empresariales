import { useQuery } from '@tanstack/react-query'
import { empresasApi } from '../api/empresasApi'
import { usuariosApi } from '@/features/usuarios/api/usuariosApi'
import Avatar from '@/features/usuarios/components/Avatar'

export default function MisPracticantesPage() {
  const { data: empresa } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  const { data: todosEstudiantes = [] } = useQuery({
    queryKey: ['estudiantes', []],
    queryFn:  () => usuariosApi.getEstudiantes(),
  })

  const practicantes = todosEstudiantes.filter(e =>
    empresa?.practicantesActivos?.includes(e.id)
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
                {['Estudiante', 'Programa', 'Semestre', 'N° práctica', 'Correo'].map(h => (
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
                      <Avatar nombre={e.nombre} size={28} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
                        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.documento}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>{e.programa}</td>
                  <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>{e.semestre}</td>
                  <td className="px-5 py-3 text-xs text-center" style={{ color: '#023859' }}>{e.numeroPractica}</td>
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