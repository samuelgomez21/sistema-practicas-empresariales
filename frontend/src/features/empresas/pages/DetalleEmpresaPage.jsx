import MiPerfilEmpresaPage from './MiPerfilEmpresaPage'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { empresasApi } from '../api/empresasApi'

export default function DetalleEmpresaPage({ editMode = false }) {
  const { id } = useParams()

  const { data: empresa, isLoading } = useQuery({
    queryKey: ['empresa', id],
    queryFn:  () => empresasApi.getEmpresaById(id),
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  return <MiPerfilEmpresaPage soloLectura={!editMode} empresaOverride={empresa} />
}