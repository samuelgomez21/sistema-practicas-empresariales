import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { configuracionApi } from '../api/configuracionApi'
import ProteccionBanner from '../components/ProteccionBanner'

const schema = z.object({
  numeroPracticas:  z.coerce.number().min(1).max(5),
  corteseguimiento: z.coerce.number().min(1).max(10),
  notaMinima:       z.coerce.number().min(0).max(5),
})

export default function ParametrosPage() {
  const qc = useQueryClient()
  const [programaActivo, setProgramaActivo] = useState(null)
  const [editando, setEditando] = useState(false)

  const { data: programas = [] } = useQuery({
    queryKey: ['programas'],
    queryFn: () => configuracionApi.getProgramas(),
  })

  const programa = programaActivo ?? programas[0]

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: programa ? {
      numeroPracticas:  programa.numeroPracticas,
      corteseguimiento: programa.corteseguimiento,
      notaMinima:       programa.notaMinima,
    } : {},
  })

  const mutation = useMutation({
    mutationFn: (data) => configuracionApi.editarParametrosPrograma(programa.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['programas'] })
      toast.success('Parámetros actualizados — solo aplica a prácticas futuras')
      setEditando(false)
    },
    onError: () => toast.error('Error al guardar los parámetros'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"

  return (
    <div className="flex flex-col gap-4">
      <ProteccionBanner />

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="px-5 py-3" style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <p className="text-sm font-bold" style={{ color: '#023859' }}>Parámetros por programa</p>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Configura los parámetros académicos de cada programa
          </p>
        </div>

        {/* Tabs de programas */}
        <div className="flex overflow-x-auto" style={{ borderBottom: '0.5px solid #e2e8f0' }}>
          {programas.map((p) => (
            <button key={p.id}
              onClick={() => { setProgramaActivo(p); setEditando(false) }}
              className="px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all"
              style={{
                color: programa?.id === p.id ? '#023859' : '#8a9bb0',
                borderBottom: programa?.id === p.id ? '2px solid #D91438' : '2px solid transparent',
                fontWeight: programa?.id === p.id ? 600 : 400,
              }}>
              {p.nombre}
            </button>
          ))}
        </div>

        {programa && (
          <div className="p-5">
            {!editando ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Número de prácticas',    value: programa.numeroPracticas,  unit: 'práctica(s)' },
                    { label: 'Cortes de seguimiento',   value: programa.corteseguimiento, unit: 'corte(s)' },
                    { label: 'Nota mínima de aprobación', value: programa.notaMinima,    unit: '/ 5.0' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                      <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
                        {item.label}
                      </p>
                      <p className="text-2xl font-bold" style={{ color: '#023859' }}>
                        {item.value}
                        <span className="text-xs font-normal ml-1" style={{ color: '#8a9bb0' }}>
                          {item.unit}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
                    style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                    <Edit size={13} /> Editar parámetros
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4 max-w-sm">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
                      N° prácticas
                    </label>
                    <input {...register('numeroPracticas')} type="number" min="1" max="5" className={ic} style={is} />
                    {errors.numeroPracticas && <p className="text-xs" style={{ color: '#D91438' }}>{errors.numeroPracticas.message}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
                      Cortes
                    </label>
                    <input {...register('corteseguimiento')} type="number" min="1" max="10" className={ic} style={is} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#023859' }}>
                      Nota mínima
                    </label>
                    <input {...register('notaMinima')} type="number" step="0.1" min="0" max="5" className={ic} style={is} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setEditando(false); reset() }}
                    className="h-9 px-4 rounded-lg text-xs font-semibold"
                    style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={mutation.isPending}
                    className="h-9 px-4 rounded-lg text-xs font-bold text-white"
                    style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
                    {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}