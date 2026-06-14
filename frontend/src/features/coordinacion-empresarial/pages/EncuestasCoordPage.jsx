import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Plus, ChevronDown, ChevronRight, Trash2,
  ToggleLeft, ToggleRight, Edit2, Check, X,
  ClipboardList, Star, MessageSquare, CheckSquare,
} from 'lucide-react'
import { encuestasApi } from '../api/encuestasApi'

// ── Constantes ────────────────────────────────────────────────────────────────

const TIPOS_ENCUESTA = ['ESTUDIANTE', 'TUTOR']
const TIPOS_PREGUNTA = ['ESCALA', 'TEXTO', 'BOOLEANO']

const TIPO_LABEL = {
  ESTUDIANTE: { label: 'Encuesta estudiante', bg: '#e6f0fb', color: '#0B416B' },
  TUTOR:      { label: 'Encuesta tutor',      bg: '#eaf7f0', color: '#1a7a4a' },
}

const PREGUNTA_LABEL = {
  ESCALA:   { label: 'Escala 1-5', bg: '#f3e8ff', color: '#6d28d9' },
  TEXTO:    { label: 'Texto',      bg: '#fff8e6', color: '#a07010' },
  BOOLEANO: { label: 'Sí / No',   bg: '#e6f0fb', color: '#0B416B' },
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function EncuestasCoordPage() {
  const [tab, setTab] = useState('plantillas') // 'plantillas' | 'respuestas'

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Gestión de encuestas
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Configura plantillas y revisa las respuestas de los participantes
        </p>
      </div>

      {/* Tabs principales */}
      <div className="flex gap-2">
        {[
          { key: 'plantillas', label: 'Plantillas' },
          { key: 'respuestas', label: 'Respuestas' },
        ].map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            className="h-9 px-4 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.key ? '#023859' : '#f4f6f9',
              color:      tab === t.key ? '#fff'    : '#6b7a8d',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'plantillas' ? <TabPlantillas /> : <TabRespuestas />}
    </div>
  )
}

// ── TAB PLANTILLAS ─────────────────────────────────────────────────────────────

function TabPlantillas() {
  const qc = useQueryClient()
  const [tabTipo, setTabTipo] = useState('ESTUDIANTE')
  const [mostrarFormPlantilla, setMostrarFormPlantilla] = useState(false)
  const [formPlantilla, setFormPlantilla] = useState({
    tipo: 'ESTUDIANTE', version: '', nombre: '',
  })

  const { data: plantillas = [], isLoading } = useQuery({
    queryKey: ['encuestas-plantillas'],
    queryFn:  encuestasApi.getPlantillas,
  })

  const plantillaActual = plantillas.find(
    p => p.tipo === tabTipo && p.activa
  ) ?? plantillas.filter(p => p.tipo === tabTipo).slice(-1)[0] ?? null

  const crearPlantillaMutation = useMutation({
    mutationFn: encuestasApi.crearPlantilla,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
      toast.success('Plantilla creada correctamente')
      setMostrarFormPlantilla(false)
      setFormPlantilla({ tipo: 'ESTUDIANTE', version: '', nombre: '' })
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al crear plantilla'),
  })

  const toggleMutation = useMutation({
    mutationFn: encuestasApi.togglePlantilla,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })
      toast.success('Estado actualizado')
    },
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }

  return (
    <div className="flex flex-col gap-3">

      {/* Botón nueva plantilla */}
      <div className="flex justify-end">
        <button
          onClick={() => setMostrarFormPlantilla(v => !v)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white"
          style={{ background: '#D91438' }}>
          <Plus size={13} />
          {mostrarFormPlantilla ? 'Cancelar' : 'Nueva plantilla'}
        </button>
      </div>

      {/* Form nueva plantilla */}
      {mostrarFormPlantilla && (
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-4 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Nueva plantilla de encuesta
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lc} style={ls}>Tipo *</label>
              <select value={formPlantilla.tipo}
                onChange={e => setFormPlantilla(f => ({ ...f, tipo: e.target.value }))}
                className={ic} style={is}>
                {TIPOS_ENCUESTA.map(t => (
                  <option key={t} value={t}>{TIPO_LABEL[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lc} style={ls}>Versión *</label>
              <input value={formPlantilla.version}
                onChange={e => setFormPlantilla(f => ({ ...f, version: e.target.value }))}
                placeholder="Ej: 2026-1" className={ic} style={is} />
            </div>
            <div>
              <label className={lc} style={ls}>Nombre *</label>
              <input value={formPlantilla.nombre}
                onChange={e => setFormPlantilla(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Encuesta satisfacción estudiante"
                className={ic} style={is} />
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg"
            style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
            <p className="text-[10px]" style={{ color: '#6b7a8d' }}>
              Al crear una nueva plantilla del mismo tipo, la activa anterior
              se desactivará automáticamente.
            </p>
          </div>
          <div className="flex gap-2 justify-end mt-3">
            <button onClick={() => setMostrarFormPlantilla(false)}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={() => crearPlantillaMutation.mutate(formPlantilla)}
              disabled={!formPlantilla.version.trim() || !formPlantilla.nombre.trim()
                || crearPlantillaMutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{
                background: !formPlantilla.version || !formPlantilla.nombre
                  || crearPlantillaMutation.isPending ? '#a0aab4' : '#D91438',
              }}>
              {crearPlantillaMutation.isPending ? 'Creando...' : 'Crear plantilla'}
            </button>
          </div>
        </div>
      )}

      {/* Tabs por tipo de encuesta */}
      <div className="flex gap-2">
        {TIPOS_ENCUESTA.map(tipo => {
          const cfg   = TIPO_LABEL[tipo]
          const activa = tabTipo === tipo
          return (
            <button key={tipo} onClick={() => setTabTipo(tipo)}
              className="h-8 px-3 rounded-lg text-xs font-bold transition-all"
              style={{
                background: activa ? cfg.color : '#f4f6f9',
                color:      activa ? '#fff'    : '#6b7a8d',
              }}>
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Plantilla activa */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-5 animate-pulse h-24"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ) : !plantillaActual ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            Sin plantilla para {TIPO_LABEL[tabTipo].label}
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            Crea una nueva plantilla usando el botón de arriba
          </p>
        </div>
      ) : (
        <>
          {/* Info plantilla */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: '#023859' }}>
                  {plantillaActual.nombre}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
                  Versión {plantillaActual.version} · {plantillaActual.secciones?.length ?? 0} sección(es)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={plantillaActual.activa
                    ? { background: '#eaf7f0', color: '#1a7a4a' }
                    : { background: '#f0f2f5', color: '#6b7a8d' }}>
                  {plantillaActual.activa ? 'Activa' : 'Inactiva'}
                </span>
                <button
                  onClick={() => toggleMutation.mutate(plantillaActual.id)}
                  disabled={toggleMutation.isPending}
                  className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                  style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                  {plantillaActual.activa
                    ? <><ToggleRight size={13} style={{ color: '#1a7a4a' }} /> Desactivar</>
                    : <><ToggleLeft  size={13} style={{ color: '#8a9bb0' }} /> Activar</>}
                </button>
              </div>
            </div>
          </div>

          {/* Secciones */}
          <SeccionesEditor
            plantilla={plantillaActual}
            onRefresh={() => qc.invalidateQueries({ queryKey: ['encuestas-plantillas'] })}
          />
        </>
      )}
    </div>
  )
}

// ── TAB RESPUESTAS ─────────────────────────────────────────────────────────────

function TabRespuestas() {
  const [filtroTipo,     setFiltroTipo]     = useState('')
  const [respuestaVista, setRespuestaVista] = useState(null) // detalle abierto

  const { data: respuestas = [], isLoading } = useQuery({
    queryKey: ['encuestas-respuestas'],
    queryFn:  encuestasApi.getRespuestas,
  })

  const filtradas = respuestas.filter(r =>
    !filtroTipo || r.tipo === filtroTipo
  )

  // Estadística rápida: promedio de escalas
  const calcPromedio = (items) => {
    const escalas = (items ?? []).filter(i => i.tipoPregunta === 'ESCALA' && i.valorEscala != null)
    if (!escalas.length) return null
    const sum = escalas.reduce((acc, i) => acc + i.valorEscala, 0)
    return (sum / escalas.length).toFixed(1)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Modal detalle */}
      {respuestaVista && (
        <DetalleRespuesta
          respuesta={respuestaVista}
          onCerrar={() => setRespuestaVista(null)}
        />
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-3"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-semibold flex-shrink-0" style={{ color: '#023859' }}>
          Filtrar por tipo:
        </p>
        {[{ value: '', label: 'Todas' }, ...TIPOS_ENCUESTA.map(t => ({
          value: t, label: TIPO_LABEL[t].label,
        }))].map(opt => (
          <button key={opt.value}
            onClick={() => setFiltroTipo(opt.value)}
            className="h-8 px-3 rounded-lg text-[10px] font-bold transition-all"
            style={filtroTipo === opt.value
              ? { background: '#023859', color: '#fff' }
              : { background: '#f4f6f9', color: '#6b7a8d' }}>
            {opt.label}
          </button>
        ))}
        <span className="ml-auto text-[10px] font-semibold" style={{ color: '#8a9bb0' }}>
          {filtradas.length} respuesta(s)
        </span>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-20"
              style={{ border: '0.5px solid #e2e8f0' }} />
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <ClipboardList size={28} className="mx-auto mb-2" style={{ color: '#8a9bb0' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            Sin respuestas registradas
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            Las respuestas aparecerán cuando los participantes completen sus encuestas
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map(r => {
            const cfg      = TIPO_LABEL[r.tipo] ?? TIPO_LABEL.ESTUDIANTE
            const promedio = calcPromedio(r.items)

            return (
              <div key={r.id} className="bg-white rounded-xl p-5"
                style={{ border: '0.5px solid #e2e8f0' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">

                    {/* Tipo + práctica */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        Práctica #{r.practicaId}
                      </span>
                    </div>

                    {/* Respondido por */}
                    <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                      {r.respondidoPor}
                    </p>

                    {/* Fecha */}
                    <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                      {r.fechaEnvio
                        ? new Date(r.fechaEnvio).toLocaleDateString('es-CO', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })
                        : '—'}
                    </p>

                    {/* Resumen */}
                    <div className="flex items-center gap-3 mt-2">
                      {promedio && (
                        <div className="flex items-center gap-1">
                          <Star size={11} style={{ color: '#a07010' }} fill="#a07010" />
                          <span className="text-[10px] font-bold" style={{ color: '#a07010' }}>
                            {promedio} / 5.0 promedio
                          </span>
                        </div>
                      )}
                      <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                        {r.items?.length ?? 0} respuesta(s)
                      </span>
                      {r.postularProyecto && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                          Postula proyecto
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setRespuestaVista(r)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[10px] font-semibold flex-shrink-0"
                    style={{ background: '#e6f0fb', color: '#0B416B' }}>
                    <ClipboardList size={11} /> Ver detalle
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Modal detalle de respuesta ────────────────────────────────────────────────

function DetalleRespuesta({ respuesta: r, onCerrar }) {
  const cfg = TIPO_LABEL[r.tipo] ?? TIPO_LABEL.ESTUDIANTE

  // Agrupar items por tipo de pregunta
  const escalas   = (r.items ?? []).filter(i => i.tipoPregunta === 'ESCALA')
  const textos    = (r.items ?? []).filter(i => i.tipoPregunta === 'TEXTO')
  const booleanos = (r.items ?? []).filter(i => i.tipoPregunta === 'BOOLEANO')

  const promedioGeneral = escalas.length
    ? (escalas.reduce((a, i) => a + (i.valorEscala ?? 0), 0) / escalas.length).toFixed(1)
    : null

  const renderEscala = (valor) => {
    if (valor == null) return <span style={{ color: '#8a9bb0' }}>—</span>
    return (
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(n => (
          <div key={n} className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
            style={{
              background: n <= valor ? '#0B416B' : '#f0f2f5',
              color:      n <= valor ? '#fff'    : '#c0c8d4',
            }}>
            {n}
          </div>
        ))}
        <span className="text-[10px] font-bold ml-1" style={{ color: '#0B416B' }}>
          ({valor}/5)
        </span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.5)' }}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        style={{ border: '0.5px solid #e2e8f0' }}>

        {/* Header del modal */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '0.5px solid #e2e8f0' }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.label}
              </span>
              <span className="text-[10px]" style={{ color: '#8a9bb0' }}>
                Práctica #{r.practicaId}
              </span>
            </div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              {r.respondidoPor}
            </p>
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
              {r.fechaEnvio
                ? new Date(r.fechaEnvio).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
          <button onClick={onCerrar}
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: '#f4f6f9', color: '#023859' }}>
            <X size={14} />
          </button>
        </div>

        {/* Cuerpo scrolleable */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">

          {/* Stats rápidas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg text-center"
              style={{ background: '#e6f0fb' }}>
              <p className="text-base font-bold" style={{ color: '#0B416B' }}>
                {promedioGeneral ?? '—'}
              </p>
              <p className="text-[10px]" style={{ color: '#0B416B' }}>Promedio escala</p>
            </div>
            <div className="p-3 rounded-lg text-center"
              style={{ background: '#f7f9fb' }}>
              <p className="text-base font-bold" style={{ color: '#023859' }}>
                {r.items?.length ?? 0}
              </p>
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Total respuestas</p>
            </div>
            <div className="p-3 rounded-lg text-center"
              style={{ background: r.postularProyecto ? '#eaf7f0' : '#f0f2f5' }}>
              <p className="text-base font-bold"
                style={{ color: r.postularProyecto ? '#1a7a4a' : '#8a9bb0' }}>
                {r.postularProyecto ? 'Sí' : 'No'}
              </p>
              <p className="text-[10px]"
                style={{ color: r.postularProyecto ? '#1a7a4a' : '#8a9bb0' }}>
                Postula proyecto
              </p>
            </div>
          </div>

          {/* Proyecto */}
          {r.nombreProyecto && (
            <div className="p-3 rounded-lg"
              style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: '#1a7a4a' }}>
                Nombre del proyecto
              </p>
              <p className="text-xs" style={{ color: '#023859' }}>{r.nombreProyecto}</p>
            </div>
          )}

          {/* Preguntas de escala */}
          {escalas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={13} style={{ color: '#6d28d9' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Preguntas de escala
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {escalas.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <p className="text-[11px] font-semibold mb-2" style={{ color: '#023859' }}>
                      {item.textoPregunta}
                    </p>
                    {renderEscala(item.valorEscala)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preguntas de texto */}
          {textos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={13} style={{ color: '#a07010' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Preguntas abiertas
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {textos.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#023859' }}>
                      {item.textoPregunta}
                    </p>
                    <p className="text-xs leading-relaxed italic"
                      style={{ color: item.valorTexto ? '#6b7a8d' : '#c0c8d4' }}>
                      {item.valorTexto
                        ? `"${item.valorTexto}"`
                        : 'Sin respuesta'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preguntas booleanas */}
          {booleanos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare size={13} style={{ color: '#0B416B' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Preguntas sí / no
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {booleanos.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                      {item.textoPregunta}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={item.valorBooleano
                        ? { background: '#eaf7f0', color: '#1a7a4a' }
                        : item.valorBooleano === false
                          ? { background: '#fef0f0', color: '#c0392b' }
                          : { background: '#f0f2f5', color: '#8a9bb0' }}>
                      {item.valorBooleano === true  ? 'Sí'
                       : item.valorBooleano === false ? 'No'
                       : 'Sin respuesta'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observaciones generales */}
          {r.observaciones && (
            <div className="p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: '#023859' }}>
                Observaciones generales
              </p>
              <p className="text-xs leading-relaxed italic" style={{ color: '#6b7a8d' }}>
                "{r.observaciones}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex justify-end flex-shrink-0"
          style={{ borderTop: '0.5px solid #e2e8f0' }}>
          <button onClick={onCerrar}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Editor de secciones ───────────────────────────────────────────────────────

function SeccionesEditor({ plantilla, onRefresh }) {
  const [seccionAbierta, setSeccionAbierta] = useState(null)
  const [formSeccion,    setFormSeccion]    = useState({ codigo: '', titulo: '', orden: '' })
  const [mostrarFormSec, setMostrarFormSec] = useState(false)

  const crearSeccionMutation = useMutation({
    mutationFn: () => encuestasApi.crearSeccion({
      plantillaId: plantilla.id,
      codigo:      formSeccion.codigo,
      titulo:      formSeccion.titulo,
      orden:       Number(formSeccion.orden) || (plantilla.secciones.length + 1),
    }),
    onSuccess: () => {
      onRefresh()
      toast.success('Sección creada')
      setMostrarFormSec(false)
      setFormSeccion({ codigo: '', titulo: '', orden: '' })
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al crear sección'),
  })

  const eliminarSeccionMutation = useMutation({
    mutationFn: encuestasApi.eliminarSeccion,
    onSuccess: () => { onRefresh(); toast.success('Sección eliminada') },
    onError: () => toast.error('Error al eliminar sección'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-9 px-3 rounded-lg text-xs outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1 block"
  const ls = { color: '#023859' }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold" style={{ color: '#023859' }}>
          Secciones ({plantilla.secciones?.length ?? 0})
        </p>
        <button onClick={() => setMostrarFormSec(v => !v)}
          className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
          style={{ background: '#e6f0fb', color: '#0B416B' }}>
          <Plus size={11} /> Agregar sección
        </button>
      </div>

      {mostrarFormSec && (
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #dce4ec' }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-3"
            style={{ color: '#023859' }}>Nueva sección</p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={lc} style={ls}>Código *</label>
              <input value={formSeccion.codigo}
                onChange={e => setFormSeccion(f => ({ ...f, codigo: e.target.value }))}
                placeholder="Ej: A" className={ic} style={is} />
            </div>
            <div>
              <label className={lc} style={ls}>Título *</label>
              <input value={formSeccion.titulo}
                onChange={e => setFormSeccion(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: Satisfacción general" className={ic} style={is} />
            </div>
            <div>
              <label className={lc} style={ls}>Orden</label>
              <input type="number" value={formSeccion.orden}
                onChange={e => setFormSeccion(f => ({ ...f, orden: e.target.value }))}
                placeholder={String(plantilla.secciones.length + 1)}
                className={ic} style={is} />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button onClick={() => setMostrarFormSec(false)}
              className="h-7 px-3 rounded text-[10px] font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button onClick={() => crearSeccionMutation.mutate()}
              disabled={!formSeccion.codigo || !formSeccion.titulo || crearSeccionMutation.isPending}
              className="h-7 px-3 rounded text-[10px] font-bold text-white"
              style={{
                background: !formSeccion.codigo || !formSeccion.titulo
                  || crearSeccionMutation.isPending ? '#a0aab4' : '#D91438',
              }}>
              {crearSeccionMutation.isPending ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </div>
      )}

      {(plantilla.secciones ?? []).length === 0 ? (
        <div className="bg-white rounded-xl p-5 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs" style={{ color: '#8a9bb0' }}>
            Sin secciones. Agrega la primera para comenzar a configurar la encuesta.
          </p>
        </div>
      ) : (
        (plantilla.secciones ?? []).map(seccion => (
          <div key={seccion.id} className="bg-white rounded-xl overflow-hidden"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center gap-3 px-5 py-3 cursor-pointer"
              style={{
                background: seccionAbierta === seccion.id ? '#f7f9fb' : '#fff',
                borderBottom: seccionAbierta === seccion.id ? '0.5px solid #e2e8f0' : 'none',
              }}
              onClick={() => setSeccionAbierta(
                seccionAbierta === seccion.id ? null : seccion.id
              )}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                {seccion.codigo}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ color: '#023859' }}>{seccion.titulo}</p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  {seccion.preguntas?.length ?? 0} pregunta(s) · Orden {seccion.orden}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => {
                  e.stopPropagation()
                  if (confirm('¿Eliminar esta sección y todas sus preguntas?')) {
                    eliminarSeccionMutation.mutate(seccion.id)
                  }
                }}
                  className="h-7 w-7 rounded flex items-center justify-center"
                  style={{ background: '#fef0f0' }}>
                  <Trash2 size={12} style={{ color: '#c0392b' }} />
                </button>
                {seccionAbierta === seccion.id
                  ? <ChevronDown size={14} style={{ color: '#8a9bb0' }} />
                  : <ChevronRight size={14} style={{ color: '#8a9bb0' }} />}
              </div>
            </div>
            {seccionAbierta === seccion.id && (
              <PreguntasEditor seccion={seccion} onRefresh={onRefresh} />
            )}
          </div>
        ))
      )}
    </div>
  )
}

// ── Editor de preguntas ───────────────────────────────────────────────────────

function PreguntasEditor({ seccion, onRefresh }) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [formPregunta, setFormPregunta] = useState({ texto: '', tipo: 'ESCALA' })
  const [editandoId,   setEditandoId]   = useState(null)
  const [formEditar,   setFormEditar]   = useState({ texto: '', tipo: '' })

  const agregarMutation = useMutation({
    mutationFn: () => encuestasApi.agregarPregunta(seccion.id, formPregunta),
    onSuccess: () => {
      onRefresh()
      toast.success('Pregunta agregada')
      setMostrarForm(false)
      setFormPregunta({ texto: '', tipo: 'ESCALA' })
    },
    onError: () => toast.error('Error al agregar pregunta'),
  })

  const editarMutation = useMutation({
    mutationFn: (id) => encuestasApi.editarPregunta(id, formEditar),
    onSuccess: () => { onRefresh(); toast.success('Pregunta actualizada'); setEditandoId(null) },
    onError: () => toast.error('Error al editar pregunta'),
  })

  const eliminarMutation = useMutation({
    mutationFn: encuestasApi.desactivarPregunta,
    onSuccess: () => { onRefresh(); toast.success('Pregunta eliminada') },
    onError: () => toast.error('Error al eliminar pregunta'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-9 px-3 rounded-lg text-xs outline-none"

  return (
    <div className="p-4 flex flex-col gap-2">
      {(seccion.preguntas ?? []).length === 0 ? (
        <p className="text-xs py-2" style={{ color: '#8a9bb0' }}>
          Sin preguntas en esta sección
        </p>
      ) : (
        (seccion.preguntas ?? []).map((p, idx) => {
          const tipoCfg = PREGUNTA_LABEL[p.tipo] ?? PREGUNTA_LABEL.ESCALA
          return (
            <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <span className="text-[10px] font-bold mt-0.5 flex-shrink-0"
                style={{ color: '#8a9bb0' }}>{idx + 1}.</span>
              {editandoId === p.id ? (
                <div className="flex-1 flex flex-col gap-2">
                  <input value={formEditar.texto}
                    onChange={e => setFormEditar(f => ({ ...f, texto: e.target.value }))}
                    className={ic} style={is} />
                  <div className="flex items-center gap-2">
                    <select value={formEditar.tipo}
                      onChange={e => setFormEditar(f => ({ ...f, tipo: e.target.value }))}
                      className="h-8 px-2 rounded text-[10px] outline-none" style={is}>
                      {TIPOS_PREGUNTA.map(t => (
                        <option key={t} value={t}>{PREGUNTA_LABEL[t].label}</option>
                      ))}
                    </select>
                    <button onClick={() => editarMutation.mutate(p.id)}
                      disabled={!formEditar.texto.trim() || editarMutation.isPending}
                      className="h-7 w-7 rounded flex items-center justify-center"
                      style={{ background: '#eaf7f0' }}>
                      <Check size={12} style={{ color: '#1a7a4a' }} />
                    </button>
                    <button onClick={() => setEditandoId(null)}
                      className="h-7 w-7 rounded flex items-center justify-center"
                      style={{ background: '#fef0f0' }}>
                      <X size={12} style={{ color: '#c0392b' }} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: '#023859' }}>{p.texto}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: tipoCfg.bg, color: tipoCfg.color }}>
                      {tipoCfg.label}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditandoId(p.id); setFormEditar({ texto: p.texto, tipo: p.tipo }) }}
                      className="h-7 w-7 rounded flex items-center justify-center"
                      style={{ background: '#e6f0fb' }}>
                      <Edit2 size={11} style={{ color: '#0B416B' }} />
                    </button>
                    <button onClick={() => { if (confirm('¿Desactivar esta pregunta?')) eliminarMutation.mutate(p.id) }}
                      className="h-7 w-7 rounded flex items-center justify-center"
                      style={{ background: '#fef0f0' }}>
                      <Trash2 size={11} style={{ color: '#c0392b' }} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })
      )}

      {mostrarForm ? (
        <div className="mt-1 p-3 rounded-lg"
          style={{ background: '#f7f9fb', border: '1.5px dashed #dce4ec' }}>
          <textarea value={formPregunta.texto}
            onChange={e => setFormPregunta(f => ({ ...f, texto: e.target.value }))}
            rows={2}
            placeholder="Escribe el texto de la pregunta..."
            className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none mb-2"
            style={{ border: '1.5px solid #dce4ec', background: '#fff', color: '#023859' }}
          />
          <div className="flex items-center gap-2">
            <select value={formPregunta.tipo}
              onChange={e => setFormPregunta(f => ({ ...f, tipo: e.target.value }))}
              className="h-8 px-2 rounded text-[10px] outline-none flex-1" style={is}>
              {TIPOS_PREGUNTA.map(t => (
                <option key={t} value={t}>{PREGUNTA_LABEL[t].label}</option>
              ))}
            </select>
            <button onClick={() => agregarMutation.mutate()}
              disabled={!formPregunta.texto.trim() || agregarMutation.isPending}
              className="h-8 px-3 rounded text-[10px] font-bold text-white"
              style={{ background: !formPregunta.texto.trim() || agregarMutation.isPending ? '#a0aab4' : '#D91438' }}>
              {agregarMutation.isPending ? 'Agregando...' : 'Agregar'}
            </button>
            <button onClick={() => setMostrarForm(false)}
              className="h-8 px-3 rounded text-[10px] font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setMostrarForm(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded text-[10px] font-semibold w-fit mt-1"
          style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
          <Plus size={11} /> Agregar pregunta
        </button>
      )}
    </div>
  )
}