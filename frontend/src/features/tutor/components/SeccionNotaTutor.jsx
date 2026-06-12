import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Award, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { tutorApi } from '../api/tutorApi'

export default function SeccionNotaTutor({ practicaId }) {
  const qc = useQueryClient()
  const [editando, setEditando]   = useState(false)
  const [nota, setNota]           = useState('')
  const [observaciones, setObs]   = useState('')

  const { data: notaExistente, isLoading } = useQuery({
    queryKey: ['nota-tutor', practicaId],
    queryFn:  () => tutorApi.getNotaTutor(practicaId),
    enabled:  !!practicaId,
  })

  const mutation = useMutation({
    mutationFn: () => tutorApi.registrarNotaTutor(practicaId, {
      nota: Number(nota), observaciones,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nota-tutor', practicaId] })
      qc.invalidateQueries({ queryKey: ['mis-estudiantes-tutor'] })
      toast.success('Nota registrada correctamente')
      setEditando(false)
    },
    onError: () => toast.error('Error al registrar la nota'),
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-5 animate-pulse h-24"
      style={{ border: '0.5px solid #e2e8f0' }} />
  )

  const yaRegistrada = !!notaExistente

  return (
    <div className="bg-white rounded-xl p-5"
      style={{ border: '0.5px solid #e2e8f0' }}>

      <div className="flex items-center gap-2 mb-3">
        <Award size={15} style={{ color: '#D91438' }} />
        <p className="text-sm font-bold" style={{ color: '#023859' }}>
          Nota final del tutor
        </p>
      </div>

      {/* Ya registrada */}
      {yaRegistrada && !editando && (
        <div className="flex items-start justify-between p-3 rounded-lg"
          style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle size={13} style={{ color: '#1a7a4a' }} />
              <p className="text-sm font-bold" style={{ color: '#1a7a4a' }}>
                {notaExistente.nota.toFixed(1)} / 5.0
              </p>
            </div>
            {notaExistente.observaciones && (
              <p className="text-xs mt-1.5" style={{ color: '#6b7a8d' }}>
                "{notaExistente.observaciones}"
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setNota(String(notaExistente.nota))
              setObs(notaExistente.observaciones ?? '')
              setEditando(true)
            }}
            className="text-[10px] font-semibold flex-shrink-0"
            style={{ color: '#0B416B' }}>
            Editar
          </button>
        </div>
      )}

      {/* Sin registrar o editando */}
      {(!yaRegistrada || editando) && (
        <div className="flex flex-col gap-3">
          {!yaRegistrada && (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>
              Asigna la nota final de desempeño del estudiante durante la práctica.
              Este registro es un requisito para el paz y salvo.
            </p>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
              style={{ color: '#023859' }}>
              Nota (0.0 - 5.0)
            </label>
            <input
              type="number" step="0.1" min="0" max="5"
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="Ej: 4.5"
              className="w-32 h-10 px-3 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
              style={{ color: '#023859' }}>
              Observaciones (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={e => setObs(e.target.value)}
              rows={3}
              placeholder="Comentarios sobre el desempeño general del estudiante..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }}
            />
          </div>

          <div className="flex gap-2 justify-end">
            {editando && (
              <button onClick={() => setEditando(false)}
                className="h-9 px-4 rounded-lg text-xs font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                Cancelar
              </button>
            )}
            <button
              onClick={() => mutation.mutate()}
              disabled={!nota || Number(nota) < 0 || Number(nota) > 5 || mutation.isPending}
              className="h-9 px-5 rounded-lg text-xs font-bold text-white"
              style={{
                background: !nota || Number(nota) < 0 || Number(nota) > 5 || mutation.isPending
                  ? '#a0aab4' : '#D91438',
              }}>
              {mutation.isPending ? 'Guardando...' : yaRegistrada ? 'Actualizar nota' : 'Registrar nota'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}