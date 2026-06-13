import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { X, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { vacantesApi } from '@/features/vacantes/api/vacantesApi'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'

export default function ModalPostularEstudiante({ estudiante, onClose, onPostulado }) {
  const [vacanteId, setVacanteId] = useState('')

  const { data: vacantes = [] } = useQuery({
    queryKey: ['vacantes-aprobadas'],
    queryFn:  async () => {
      const todas = await vacantesApi.getVacantes()
      return todas.filter(v => v.estado === 'APROBADA')
    },
  })

  const mutation = useMutation({
    mutationFn: () => coordEmpresarialApi.crearPostulacion({
      vacanteId:    Number(vacanteId),
      estudianteId: estudiante.id,
      observaciones: '',
    }),
    onSuccess: onPostulado,
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Error al postular'
      toast.error(msg)
    },
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>Postular estudiante</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              {estudiante.nombre} · {estudiante.nombrePrograma}
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
              style={{ color: '#023859' }}>
              Seleccionar vacante aprobada
            </p>
            <select
              value={vacanteId}
              onChange={e => setVacanteId(e.target.value)}
              className={ic} style={is}>
              <option value="">Seleccionar vacante...</option>
              {vacantes.map(v => (
                <option key={v.id} value={v.id}>
                  {v.titulo} — {v.empresaNombre} ({v.cuposDisponibles} cupos)
                </option>
              ))}
            </select>
            {vacantes.length === 0 && (
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                No hay vacantes aprobadas disponibles
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!vacanteId || mutation.isPending}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: !vacanteId || mutation.isPending ? '#a0aab4' : '#0B416B' }}>
              <UserPlus size={13} />
              {mutation.isPending ? 'Postulando...' : 'Postular'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}