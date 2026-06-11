import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, UserPlus, Users, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { vacantesApi, MODALIDAD_LABEL, CONTRATO_LABEL } from '../api/vacantesApi'
import BadgeEstadoVacante from '../components/BadgeEstadoVacante'
import TagHabilidad from '../components/TagHabilidad'
import ModalPostular from '../components/ModalPostular'
import ModalRechazar from '../components/ModalRechazar'

export default function DetalleVacantePage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const qc       = useQueryClient()
  const [modalPostular, setModalPostular] = useState(false)
  const [modalRechazar, setModalRechazar] = useState(false)

  const { data: vacante, isLoading } = useQuery({
    queryKey: ['vacante', id],
    queryFn:  () => vacantesApi.getVacanteById(id),
  })

  const aprobarMutation = useMutation({
    mutationFn: () => vacantesApi.aprobarVacante(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vacante', id] })
      qc.invalidateQueries({ queryKey: ['vacantes'] })
      toast.success('Vacante aprobada y publicada')
    },
  })

  const cerrarMutation = useMutation({
    mutationFn: () => vacantesApi.cerrarVacante(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vacante', id] })
      toast.success('Vacante cerrada')
    },
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )
  if (!vacante) return (
    <div className="bg-white rounded-xl p-8 text-center"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Vacante no encontrada</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#e6f0fb' }}>
              <span className="text-lg font-bold" style={{ color: '#0B416B' }}>
                {vacante.empresaNombre[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold" style={{ color: '#023859' }}>
                  {vacante.titulo}
                </h2>
                <BadgeEstadoVacante estado={vacante.estado} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#0B416B' }}>
                {vacante.empresaNombre}
              </p>
            </div>
          </div>

          {/* Acciones según estado */}
          <div className="flex gap-2">
            {vacante.estado === 'PENDIENTE' && (
              <>
                <button onClick={() => aprobarMutation.mutate()}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#1a7a4a' }}>
                  <CheckCircle size={13} /> Aprobar
                </button>
                <button onClick={() => setModalRechazar(true)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
                  style={{ background: '#fef0f0', color: '#c0392b' }}>
                  <XCircle size={13} /> Rechazar
                </button>
              </>
            )}
            {vacante.estado === 'APROBADA' && (
              <>
                <button onClick={() => setModalPostular(true)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
                  style={{ background: '#0B416B' }}>
                  <UserPlus size={13} /> Postular estudiante
                </button>
                <button onClick={() => cerrarMutation.mutate()}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
                  style={{ background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}>
                  Cerrar vacante
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Info general */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Información general
          </p>
          {[
            ['Programa',        vacante.programaNombre],
            ['Semestre mínimo', `Semestre ${vacante.semestreMinimo}+`],
            ['Modalidad',       MODALIDAD_LABEL[vacante.modalidad] ?? vacante.modalidad],
            ['Tipo de contrato', CONTRATO_LABEL[vacante.tipoContrato] ?? vacante.tipoContrato],
            ['Horario',         vacante.horario ?? '—'],
            ['Salario',         vacante.salario ? `$${vacante.salario.toLocaleString('es-CO')}/mes` : 'No especificado'],
            ['Cupos totales',   vacante.cuposTotales],
            ['Cupos disponibles', vacante.cuposDisponibles],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between py-1.5"
              style={{ borderBottom: '0.5px solid #f7f9fb' }}>
              <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{l}</p>
              <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{v}</p>
            </div>
          ))}
          {vacante.habilidades?.length > 0 && (
            <div className="mt-3 flex gap-1 flex-wrap">
              {vacante.habilidades.map(h => <TagHabilidad key={h} label={h} />)}
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#023859' }}>Descripción</p>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
              {vacante.descripcion}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#023859' }}>Perfil requerido</p>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
              {vacante.perfilRequerido}
            </p>
          </div>
          {vacante.motivoRechazo && (
            <div className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #f7c1c1', background: '#fef0f0' }}>
              <p className="text-xs font-bold mb-2" style={{ color: '#c0392b' }}>
                Motivo de rechazo
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#c0392b' }}>
                {vacante.motivoRechazo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Candidatos */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 mb-4 pb-2"
          style={{ borderBottom: '0.5px solid #f0f2f5' }}>
          <Users size={14} style={{ color: '#023859' }} />
          <p className="text-xs font-bold" style={{ color: '#023859' }}>
            Candidatos ({vacante.postulaciones.length})
          </p>
        </div>
        {vacante.postulaciones.length === 0 ? (
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no hay estudiantes postulados
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {vacante.postulaciones.map(p => (
              <div key={p.estudianteId}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {p.nombreEstudiante[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                      {p.nombreEstudiante}
                    </p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      Postulado: {new Date(p.fechaPostulacion).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={p.estado === 'SELECCIONADO'
                    ? { background: '#eaf7f0', color: '#1a7a4a' }
                    : { background: '#e6f0fb', color: '#0B416B' }}>
                  {p.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalPostular && (
        <ModalPostular
          vacante={vacante}
          onClose={() => setModalPostular(false)}
          onPostulado={() => {
            qc.invalidateQueries({ queryKey: ['vacante', id] })
            qc.invalidateQueries({ queryKey: ['vacantes'] })
            setModalPostular(false)
            toast.success('Estudiante postulado correctamente')
          }}
        />
      )}

      {modalRechazar && (
        <ModalRechazar
          vacante={vacante}
          onClose={() => setModalRechazar(false)}
          onRechazada={(motivo) => {
            vacantesApi.rechazarVacante(id, motivo).then(() => {
              qc.invalidateQueries({ queryKey: ['vacante', id] })
              qc.invalidateQueries({ queryKey: ['vacantes'] })
              setModalRechazar(false)
              toast.success('Vacante rechazada')
            })
          }}
        />
      )}
    </div>
  )
}