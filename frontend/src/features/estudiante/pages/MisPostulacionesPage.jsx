import { useQuery } from '@tanstack/react-query'
import { vacantesApi, ESTADO_POSTULACION, MODALIDAD_LABEL } from '@/features/vacantes/api/vacantesApi'

// Mapea el estado de postulación a un número de paso (1-4)
const PASO_MAP = {
  POSTULADO:     1,
  EN_SELECCION:  2,
  EN_ENTREVISTA: 3,
  SELECCIONADO:  4,
  RECHAZADO:     0,
}

const PASOS_POSTULACION = [
  { numero: 1, label: 'Aprobación' },
  { numero: 2, label: 'Selección'  },
  { numero: 3, label: 'Entrevista' },
  { numero: 4, label: 'Seleccionado' },
]

function StepperPostulacion({ estado }) {
  const pasoActivo = PASO_MAP[estado] ?? 1
  const rechazado  = estado === 'RECHAZADO'

  if (rechazado) return (
    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg"
      style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
      <span className="text-[10px] font-semibold" style={{ color: '#c0392b' }}>
        Postulación rechazada por la empresa
      </span>
    </div>
  )

  return (
    <div className="flex items-center mt-4">
      {PASOS_POSTULACION.map((paso, idx) => {
        const completado = pasoActivo > paso.numero
        const activo     = pasoActivo === paso.numero

        return (
          <div key={paso.numero} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: completado ? '#1a7a4a'
                    : activo    ? '#D91438'
                    : '#f0f2f5',
                  color: completado || activo ? '#fff' : '#8a9bb0',
                }}>
                {completado
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  : paso.numero
                }
              </div>
              <span className="text-[9px] font-medium whitespace-nowrap"
                style={{
                  color: completado ? '#1a7a4a'
                    : activo    ? '#D91438'
                    : '#8a9bb0',
                }}>
                {paso.label}
              </span>
            </div>
            {idx < PASOS_POSTULACION.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-4 rounded-full"
                style={{ background: completado ? '#1a7a4a' : '#f0f2f5' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MisPostulacionesPage() {
  const { data: postulaciones = [], isLoading } = useQuery({
    queryKey: ['mis-postulaciones'],
    queryFn:  vacantesApi.getMisPostulaciones,
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Mis postulaciones
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Estado actual de tus candidaturas
        </p>
      </div>

      {postulaciones.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Aún no tienes postulaciones. El coordinador te postulará a vacantes disponibles.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {postulaciones.map(p => {
            const cfg = ESTADO_POSTULACION[p.estado] ?? ESTADO_POSTULACION.POSTULADO

            return (
              <div key={p.vacanteId} className="bg-white rounded-xl p-5"
                style={{ border: '0.5px solid #e2e8f0' }}>

                {/* Cabecera */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>
                      {p.tituloVacante}
                    </p>
                    <p className="text-xs font-medium" style={{ color: '#0B416B' }}>
                      {p.empresaNombre}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                      Postulado el {new Date(p.fechaPostulacion).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Info de la vacante */}
                <div className="flex gap-4 mb-3">
                  {p.salario && (
                    <span className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                      ${p.salario.toLocaleString('es-CO')}/mes
                    </span>
                  )}
                  {p.modalidad && (
                    <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {MODALIDAD_LABEL[p.modalidad] ?? p.modalidad}
                    </span>
                  )}
                  {p.horario && (
                    <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {p.horario}
                    </span>
                  )}
                </div>

                {/* Observación del proceso */}
                {p.observacion && (
                  <div className="mb-3 p-2 rounded-lg text-[10px]"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0', color: '#6b7a8d' }}>
                    {p.observacion}
                  </div>
                )}

                {/* Stepper */}
                <StepperPostulacion estado={p.estado} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}