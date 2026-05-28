import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'
import BadgeEstadoEmpresa from '../components/BadgeEstadoEmpresa'
import DocPill from '../components/DocPill'

export default function ValidarDocumentosPage() {
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ['empresas'],
    queryFn:  empresasApi.getEmpresas,
  })

  // Solo mostrar empresas con documentos pendientes de validación
  const pendientes = empresas.filter(e =>
    e.estado === 'PENDIENTE_HABILITACION' ||
    (e.camaraComercio?.url && !e.camaraComercio?.validado) ||
    (e.nit_doc?.url && !e.nit_doc?.validado) ||
    (e.cedulaRL?.url && !e.cedulaRL?.validado)
  )

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
            Documentos pendientes de validación
          </p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            {pendientes.length} empresa(s) con documentos por revisar
          </p>
        </div>

        {pendientes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              No hay documentos pendientes de validación
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f7f9fb' }}>
                {['Empresa', 'Estado', 'Documentos pendientes', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendientes.map(e => (
                <tr key={e.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.razonSocial}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{e.municipio}</p>
                  </td>
                  <td className="px-5 py-3">
                    <BadgeEstadoEmpresa estado={e.estado} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {e.camaraComercio?.url && !e.camaraComercio?.validado &&
                        <DocPill label="Cám. comercio" url={e.camaraComercio.url} validado={false} />}
                      {e.nit_doc?.url && !e.nit_doc?.validado &&
                        <DocPill label="NIT" url={e.nit_doc.url} validado={false} />}
                      {e.cedulaRL?.url && !e.cedulaRL?.validado &&
                        <DocPill label="Céd. RL" url={e.cedulaRL.url} validado={false} />}
                      {e.convenio?.url && !e.convenio?.validado &&
                        <DocPill label="Convenio" url={e.convenio.url} validado={false} />}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => navigate(`/empresas/${e.id}`)}
                      className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                      style={{ background: '#e6f0fb', color: '#0B416B', border: '0.5px solid #b5d4f4' }}>
                      <Eye size={12} /> Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}