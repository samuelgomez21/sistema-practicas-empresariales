import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Upload, FileText, ExternalLink, MessageSquare } from 'lucide-react'
import { estudianteApi } from '../api/estudianteApi'
import api from '@/lib/axios'
import BadgeEstadoAvance from '../components/BadgeEstadoAvance'

export default function AvancesPage() {
  const qc      = useQueryClient()
  const fileRef = useRef(null)
  const [form,        setForm]        = useState({ titulo: '', descripcion: '' })
  const [archivo,     setArchivo]     = useState(null)
  const [subiendo,    setSubiendo]    = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data: practica } = useQuery({
    queryKey: ['mi-practica'],
    queryFn:  estudianteApi.getMiPractica,
  })

  const { data: avances = [], isLoading, refetch: refetchAvances } = useQuery({
    queryKey: ['mis-avances'],           // ← sin practica.id para que la invalidación sea simple
    queryFn:  estudianteApi.getAvances,
    enabled:  !!practica?.id,
  })

  const handleSubir = async () => {
    if (!form.titulo.trim()) {
      toast.error('El título es obligatorio')
      return
    }
    if (!practica?.id) {
      toast.error('No se encontró la práctica activa')
      return
    }
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append(
        'datos',
        new Blob(
          [JSON.stringify({ titulo: form.titulo, descripcion: form.descripcion })],
          { type: 'application/json' }
        )
      )
      if (archivo) {
        formData.append('archivo', archivo)
      }

      await api.post(`/practicas/${practica.id}/avances`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      await refetchAvances()                           // ← refetch directo en vez de invalidate
      toast.success('Avance registrado correctamente')
      setForm({ titulo: '', descripcion: '' })
      setArchivo(null)
      setMostrarForm(false)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Error al registrar el avance')
    } finally {
      setSubiendo(false)
    }
  }

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>Mis avances</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            Registra tus avances de práctica empresarial
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(v => !v)}
          className="h-9 px-4 rounded-lg text-xs font-bold text-white"
          style={{ background: '#D91438' }}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo avance'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-4 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Registrar nuevo avance
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className={lc} style={ls}>Título del avance *</label>
              <input
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: Informe semana 3 — Análisis de procesos"
                className={ic} style={is} />
            </div>
            <div>
              <label className={lc} style={ls}>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Describe brevemente las actividades realizadas..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={is} />
            </div>
            <div>
              <label className={lc} style={ls}>Archivo adjunto (opcional)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
                style={{ border: '1.5px dashed #dce4ec', background: '#f7f9fb' }}>
                <Upload size={16} style={{ color: '#8a9bb0' }} />
                <span className="text-xs" style={{ color: archivo ? '#023859' : '#8a9bb0' }}>
                  {archivo ? archivo.name : 'Haz clic para adjuntar un archivo'}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png"
                className="hidden"
                onChange={e => setArchivo(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <button
            onClick={handleSubir}
            disabled={subiendo || !form.titulo.trim()}
            className="mt-4 h-10 px-6 rounded-lg text-sm font-bold text-white"
            style={{ background: subiendo || !form.titulo.trim() ? '#a0aab4' : '#D91438' }}>
            {subiendo ? 'Registrando...' : 'Registrar avance'}
          </button>
        </div>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-20"
              style={{ border: '0.5px solid #e2e8f0' }} />
          ))}
        </div>
      ) : avances.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <FileText size={28} className="mx-auto mb-2" style={{ color: '#8a9bb0' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            Sin avances registrados
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            Registra tu primer avance usando el botón de arriba
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {[...avances].reverse().map(a => (
            <div key={a.id} className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #e2e8f0' }}>

              {/* Cabecera */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#023859' }}>
                    {a.titulo}
                  </p>
                  {a.descripcion && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6b7a8d' }}>
                      {a.descripcion}
                    </p>
                  )}
                  <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                    {a.fechaEntrega
                      ? new Date(a.fechaEntrega).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })
                      : 'Sin fecha de entrega'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <BadgeEstadoAvance estado={a.estado} />
                  {a.archivoUrl && (
                    <a href={a.archivoUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      <ExternalLink size={10} /> Ver
                    </a>
                  )}
                </div>
              </div>

              {/* ── Comentario del docente ── */}
              {a.comentarioDocente && (
                <div className="mt-3 pt-3 flex items-start gap-2"
                  style={{ borderTop: '0.5px solid #f0f2f5' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#eaf7f0' }}>
                    <MessageSquare size={11} style={{ color: '#1a7a4a' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold mb-0.5"
                      style={{ color: '#1a7a4a' }}>
                      Retroalimentación del docente
                    </p>
                    <p className="text-xs italic leading-relaxed"
                      style={{ color: '#2d6a4f' }}>
                      "{a.comentarioDocente}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}