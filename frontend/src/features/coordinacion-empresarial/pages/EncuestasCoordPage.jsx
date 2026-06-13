import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ChevronDown, ChevronUp, Trash2, Edit, Power, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'
import ModalCrearPlantilla from '../components/ModalCrearPlantilla'
import ModalAgregarPregunta from '../components/ModalAgregarPregunta'
import ModalCrearSeccion from '../components/ModalCrearSeccion'

const TIPO_LABEL = { ESTUDIANTE: 'Estudiante', TUTOR: 'Tutor empresarial' }
const TIPO_PREGUNTA_LABEL = { ESCALA: 'Escala 1-5', TEXTO: 'Texto libre', BOOLEANO: 'Sí/No' }

export default function EncuestasCoordPage() {
  const qc = useQueryClient()
  const [plantillaExpandida, setPlantillaExpandida] = useState(null)
  const [modalPlantilla,     setModalPlantilla]     = useState(false)
  const [modalSeccion,       setModalSeccion]       = useState(null) // plantillaId
  const [modalPregunta,      setModalPregunta]      = useState(null) // seccionId

  const { data: plantillas = [], isLoading } = useQuery({
    queryKey: ['encuestas-plantillas'],
    queryFn:  coordEmpresarialApi.getPlantillas,
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => coordEmpresarialApi.togglePlantilla(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] }),
    onError: () => toast.error('Error al cambiar estado'),
  })

  const eliminarPreguntaMutation = useMutation({
    mutationFn: (preguntaId) => coordEmpresarialApi.eliminarPregunta(preguntaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
      toast.success('Pregunta eliminada')
    },
    onError: () => toast.error('Error al eliminar pregunta'),
  })

  const eliminarSeccionMutation = useMutation({
    mutationFn: (seccionId) => coordEmpresarialApi.eliminarSeccion(seccionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
      toast.success('Sección eliminada')
    },
    onError: () => toast.error('Error al eliminar sección'),
  })

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            Plantillas de encuestas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            Configura las encuestas de satisfacción que responden estudiantes y tutores
          </p>
        </div>
        <button onClick={() => setModalPlantilla(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white"
          style={{ background: '#D91438' }}>
          <Plus size={13} /> Nueva plantilla
        </button>
      </div>

      {plantillas.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <ClipboardList size={32} className="mx-auto mb-3" style={{ color: '#8a9bb0' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            No hay plantillas creadas
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            Crea una plantilla para configurar las preguntas de evaluación
          </p>
        </div>
      ) : plantillas.map(plantilla => (
        <div key={plantilla.id} className="bg-white rounded-xl overflow-hidden"
          style={{ border: '0.5px solid #e2e8f0' }}>

          {/* Header plantilla */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: plantillaExpandida === plantilla.id ? '0.5px solid #f0f2f5' : 'none' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: plantilla.activa ? '#eaf7f0' : '#f0f2f5' }}>
                <ClipboardList size={16} style={{ color: plantilla.activa ? '#1a7a4a' : '#8a9bb0' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold" style={{ color: '#023859' }}>{plantilla.nombre}</p>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={plantilla.activa
                      ? { background: '#eaf7f0', color: '#1a7a4a' }
                      : { background: '#f0f2f5', color: '#6b7a8d' }}>
                    {plantilla.activa ? 'Activa' : 'Inactiva'}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    {TIPO_LABEL[plantilla.tipo]}
                  </span>
                </div>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  Versión {plantilla.version} · {plantilla.secciones?.length ?? 0} sección(es) ·{' '}
                  {plantilla.secciones?.reduce((acc, s) => acc + (s.preguntas?.length ?? 0), 0)} pregunta(s)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMutation.mutate(plantilla.id)}
                className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }}
                title={plantilla.activa ? 'Desactivar' : 'Activar'}>
                <Power size={11} />
                {plantilla.activa ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => setPlantillaExpandida(
                  plantillaExpandida === plantilla.id ? null : plantilla.id
                )}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#6b7a8d' }}>
                {plantillaExpandida === plantilla.id
                  ? <ChevronUp size={14} />
                  : <ChevronDown size={14} />
                }
              </button>
            </div>
          </div>

          {/* Secciones expandidas */}
          {plantillaExpandida === plantilla.id && (
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mt-3 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: '#8a9bb0' }}>
                  Secciones y preguntas
                </p>
                <button
                  onClick={() => setModalSeccion(plantilla.id)}
                  className="flex items-center gap-1 h-6 px-2 rounded text-[10px] font-semibold"
                  style={{ background: '#e6f0fb', color: '#0B416B' }}>
                  <Plus size={10} /> Agregar sección
                </button>
              </div>

              {(!plantilla.secciones || plantilla.secciones.length === 0) ? (
                <p className="text-xs py-4 text-center" style={{ color: '#8a9bb0' }}>
                  Esta plantilla no tiene secciones. Agrega una para comenzar.
                </p>
              ) : plantilla.secciones.map(seccion => (
                <div key={seccion.id} className="mb-4 rounded-xl overflow-hidden"
                  style={{ border: '0.5px solid #e2e8f0' }}>

                  <div className="flex items-center justify-between px-4 py-2.5"
                    style={{ background: '#f7f9fb', borderBottom: '0.5px solid #e2e8f0' }}>
                    <div>
                      <p className="text-[11px] font-bold" style={{ color: '#023859' }}>
                        {seccion.codigo} — {seccion.titulo}
                      </p>
                      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        {seccion.preguntas?.length ?? 0} pregunta(s)
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setModalPregunta(seccion.id)}
                        className="flex items-center gap-1 h-6 px-2 rounded text-[10px] font-semibold"
                        style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                        <Plus size={10} /> Pregunta
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta sección y todas sus preguntas?')) {
                            eliminarSeccionMutation.mutate(seccion.id)
                          }
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ background: '#fef0f0', color: '#c0392b' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y" style={{ '--tw-divide-color': '#f7f9fb' }}>
                    {(!seccion.preguntas || seccion.preguntas.length === 0) ? (
                      <p className="px-4 py-3 text-xs" style={{ color: '#8a9bb0' }}>
                        Sin preguntas aún
                      </p>
                    ) : seccion.preguntas.map((preg, idx) => (
                      <div key={preg.id} className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderBottom: idx < seccion.preguntas.length - 1 ? '0.5px solid #f7f9fb' : 'none' }}>
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-bold flex-shrink-0"
                            style={{ color: '#8a9bb0', minWidth: 20 }}>
                            {preg.orden}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs" style={{ color: '#023859' }}>{preg.texto}</p>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block"
                              style={{ background: '#f0f2f5', color: '#6b7a8d' }}>
                              {TIPO_PREGUNTA_LABEL[preg.tipo] ?? preg.tipo}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar esta pregunta?')) {
                              eliminarPreguntaMutation.mutate(preg.id)
                            }
                          }}
                          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ml-2"
                          style={{ background: '#fef0f0', color: '#c0392b' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {modalPlantilla && (
        <ModalCrearPlantilla
          onClose={() => setModalPlantilla(false)}
          onCreada={() => {
            qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
            setModalPlantilla(false)
            toast.success('Plantilla creada')
          }}
        />
      )}

      {modalSeccion && (
        <ModalCrearSeccion
          plantillaId={modalSeccion}
          onClose={() => setModalSeccion(null)}
          onCreada={() => {
            qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
            setModalSeccion(null)
            toast.success('Sección creada')
          }}
        />
      )}

      {modalPregunta && (
        <ModalAgregarPregunta
          seccionId={modalPregunta}
          onClose={() => setModalPregunta(null)}
          onCreada={() => {
            qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
            setModalPregunta(null)
            toast.success('Pregunta agregada')
          }}
        />
      )}
    </div>
  )
}