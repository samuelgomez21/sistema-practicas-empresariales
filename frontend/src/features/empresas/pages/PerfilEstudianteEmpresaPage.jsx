import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, FileX } from 'lucide-react'
import { usuariosApi } from '@/features/usuarios/api/usuariosApi'
import BadgeAptitud from '@/features/usuarios/components/BadgeAptitud'
import api from '@/lib/axios'

export default function PerfilEstudianteEmpresaPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante-perfil', id],
    queryFn:  async () => (await api.get(`/estudiantes/${id}`)).data,
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )
  if (!estudiante) return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Estudiante no encontrado</p>
    </div>
  )

  const iniciales = estudiante.nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit" style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver a candidatos
      </button>

      <div className="bg-white rounded-xl p-6 flex items-center gap-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: '#e6f0fb', color: '#0B416B' }}>
          {iniciales}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>{estudiante.nombre}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>{estudiante.nombrePrograma}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>{estudiante.email}</p>
        </div>
        <BadgeAptitud estado={estudiante.estadoAptitud} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Semestre',           value: `Semestre ${estudiante.semestre}` },
          { label: 'Promedio acumulado', value: `${Number(estudiante.promedioAcumulado ?? 0).toFixed(2)} / 5.0` },
          { label: 'Créditos aprobados', value: estudiante.creditosAprobados },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl p-4 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>{m.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Hoja de vida
        </p>
        <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <FileX size={20} style={{ color: '#8a9bb0' }} />
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            La carga y descarga de hoja de vida estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}