import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { vacantesApi, ESTADO_POSTULACION } from '../api/vacantesApi'
import { empresasApi } from '@/features/empresas/api/empresasApi'

const TRANSICIONES = {
  POSTULADO:     ['EN_SELECCION', 'RECHAZADO'],
  EN_SELECCION:  ['EN_ENTREVISTA', 'RECHAZADO'],
  EN_ENTREVISTA: ['SELECCIONADO', 'RECHAZADO'],
  SELECCIONADO:  [],
  RECHAZADO:     [],
}

const ACCION_LABEL = {
  EN_SELECCION:  { label: 'Pasar a selección',   color: '#6d28d9', bg: '#f3e8ff' },
  EN_ENTREVISTA: { label: 'Convocar entrevista', color: '#a07010', bg: '#fff8e6' },
  SELECCIONADO:  { label: 'Seleccionar',         color: '#1a7a4a', bg: '#eaf7f0' },
  RECHAZADO:     { label: 'Rechazar',            color: '#c0392b', bg: '#fef0f0' },
}

export default function CandidatosEmpresaPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [filtroVacante, setFiltroVacante] = useState('todas')

  const { data: empresa } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  const { data: vacantes = [], isLoading: loadingVacantes } = useQuery({
    queryKey: ['mis-vacantes-empresa', empresa?.id],
    queryFn:  () => vacantesApi.getVacantesPorEmpresa(empresa.id),
    enabled:  !!empresa?.id,
  })

  const vacantesConCandidatos = vacantes // se filtra abajo con postulaciones cargadas

  const { data: postulacionesPorVacante = {}, isLoading: loadingPost } = useQuery({
    queryKey: ['postulaciones-empresa', vacantes.map(v => v.id)],
    queryFn: async () => {
      const entries = await Promise.all(
        vacantes.map(async v => [v.id, await vacantesApi.getPostulacionesPorVacante(v.id)])
      )
      return Object.fromEntries(entries)
    },
    enabled: vacantes.length > 0,
  })

  const mutation = useMutation({
    mutationFn: ({ postulacionId, estado }) =>
      vacantesApi.actualizarEstadoPostulacion(postulacionId, estado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['postulaciones-empresa'] })
      toast.success('Estado actualizado correctamente')
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al actualizar'),
  })

  const todosLosCandidatos = Object.entries(postulacionesPorVacante).flatMap(
    ([vacanteId, lista]) => lista.map(p => ({ ...p, vacanteIdNum: Number(vacanteId) }))
  )

  const candidatosFiltrados = filtroVacante === 'todas'
    ? todosLosCandidatos
    : todosLosCandidatos.filter(c => String(c.vacanteIdNum) === filtroVacante)

  const vacantesConPostulaciones = vacantes.filter(
    v => (postulacionesPorVacante[v.id]?.length ?? 0) > 0
  )

  if (loadingVacantes || (vacantes.length > 0 && loadingPost)) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24" style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>Candidatos</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Estudiantes postulados a tus vacantes
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFiltroVacante('todas')}
          className="h-8 px-4 rounded-lg text-xs font-semibold transition-all"
          style={filtroVacante === 'todas'
            ? { background: '#023859', color: '#fff' }
            : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
          Todas las vacantes
        </button>
        {vacantesConPostulaciones.map(v => (
          <button key={v.id}
            onClick={() => setFiltroVacante(String(v.id))}
            className="h-8 px-4 rounded-lg text-xs font-semibold transition-all"
            style={filtroVacante === String(v.id)
              ? { background: '#023859', color: '#fff' }
              : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
            {v.titulo}
          </button>
        ))}
      </div>

      {candidatosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>No hay candidatos postulados aún</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {candidatosFiltrados.map(c => {
            const cfg = ESTADO_POSTULACION[c.estado] ?? ESTADO_POSTULACION.POSTULADO
            const transiciones = TRANSICIONES[c.estado] ?? []

            return (
              <div key={c.id} className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      {c.nombreEstudiante[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#023859' }}>{c.nombreEstudiante}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                        Postulado para: <span style={{ color: '#0B416B', fontWeight: 600 }}>{c.tituloVacante}</span>
                      </p>
                      {c.observaciones && (
                        <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>{c.observaciones}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                    <button
                      onClick={() => navigate(`/empresas/estudiante/${c.estudianteId}`)}
                      className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                      style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                      <ExternalLink size={11} /> Ver perfil
                    </button>
                  </div>
                </div>

                {c.estado === 'SELECCIONADO' && (
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
                    <CheckCircle size={13} style={{ color: '#1a7a4a' }} />
                    <p className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                      Estudiante seleccionado
                    </p>
                  </div>
                )}

                {transiciones.length > 0 && (
                  <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '0.5px solid #f0f2f5' }}>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Actualizar estado:</p>
                    {transiciones.map(estado => {
                      const accion = ACCION_LABEL[estado]
                      return (
                        <button key={estado}
                          onClick={() => mutation.mutate({ postulacionId: c.id, estado })}
                          disabled={mutation.isPending}
                          className="flex items-center gap-1 h-7 px-3 rounded-full text-[10px] font-semibold transition-all"
                          style={{ background: accion.bg, color: accion.color, border: `0.5px solid ${accion.color}30` }}>
                          {estado === 'RECHAZADO' ? <XCircle size={11} /> : <CheckCircle size={11} />}
                          {accion.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}