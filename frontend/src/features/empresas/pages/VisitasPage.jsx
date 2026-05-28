import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'
import { empresasApi } from '../api/empresasApi'
import ModalVisita from '../components/ModalVisita'

export default function VisitasPage() {
  const qc       = useQueryClient()
  const { user } = useAuthStore()
  const [modal,  setModal]  = useState(false)
  const [filtroEmpresa, setFiltroEmpresa] = useState('')

  const { data: visitas  = [], isLoading: loadV } = useQuery({
    queryKey: ['visitas'],
    queryFn:  () => empresasApi.getVisitas(),
  })
  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn:  empresasApi.getEmpresas,
  })

  const filtradas = visitas.filter(v =>
    !filtroEmpresa || String(v.empresaId) === filtroEmpresa
  )

  const empresaNombre = (id) =>
    empresas.find(e => e.id === id)?.razonSocial ?? '—'

  const TIPO_LABEL = {
    COORDINADORA: { label: 'Coordinadora', bg: '#e6f0fb', color: '#0B416B' },
    DOCENTE:      { label: 'Docente',      bg: '#eaf7f0', color: '#1a7a4a' },
  }

  if (loadV) return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded mb-2" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Visitas realizadas</p>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              {filtradas.length} visita(s) registrada(s)
            </p>
          </div>
          <div className="flex gap-2">
            <select value={filtroEmpresa} onChange={e => setFiltroEmpresa(e.target.value)}
              className="h-8 px-2 rounded-lg text-xs outline-none"
              style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}>
              <option value="">Todas las empresas</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.razonSocial}</option>)}
            </select>
            <button onClick={() => setModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#D91438' }}>
              <Plus size={13} /> Registrar visita
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ background: '#f7f9fb' }}>
              {['Empresa', 'Fecha', 'Duración', 'Realizada por', 'Tipo', 'Motivo / Comentarios'].map(h => (
                <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: '#8a9bb0', borderBottom: '0.5px solid #e2e8f0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map(v => {
              const tipo = TIPO_LABEL[v.tipo] ?? TIPO_LABEL.COORDINADORA
              return (
                <tr key={v.id} style={{ borderBottom: '0.5px solid #f7f9fb' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {empresaNombre(v.empresaId)}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                    {new Date(v.fecha).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#6b7a8d' }}>
                    {v.duracion}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: '#023859' }}>
                    {v.realizadaPor}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: tipo.bg, color: tipo.color }}>
                      {tipo.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>{v.motivo}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>{v.comentarios}</p>
                  </td>
                </tr>
              )
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs" style={{ color: '#8a9bb0' }}>
                  No hay visitas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ModalVisita
          empresas={empresas}
          realizadaPor={user?.nombre ?? ''}
          tipo={user?.rol === ROLES.DOCENTE_ASESOR ? 'DOCENTE' : 'COORDINADORA'}
          onClose={() => setModal(false)}
          onGuardado={() => {
            qc.invalidateQueries({ queryKey: ['visitas'] })
            setModal(false)
            toast.success('Visita registrada correctamente')
          }}
        />
      )}
    </div>
  )
}