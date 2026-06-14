import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  MapPin, Plus, Calendar, Clock, Building2,
  User, FileText, Trash2, ChevronDown, ChevronUp, Search,
} from 'lucide-react'
import api from '@/lib/axios'
import { visitasApi, MOTIVOS_FRECUENTES } from '../api/visitasApi'
import { docenteApi } from '@/features/docente/api/docenteApi'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'

// ── Helpers ───────────────────────────────────────────────────────────────────

function duracion(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return null
  const [h1, m1] = horaInicio.split(':').map(Number)
  const [h2, m2] = horaFin.split(':').map(Number)
  const mins = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (mins <= 0) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}`.trim() : `${m}min`
}

function fechaCorta(fecha) {
  if (!fecha) return '—'
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function VisitasPage() {
  const { user } = useAuthStore()
  const qc       = useQueryClient()
  const esCoord  = user?.rol === ROLES.COORDINADOR_PRACTICA
                || user?.rol === ROLES.ADMINISTRADOR

  const [mostrarForm, setMostrarForm] = useState(false)
  const [busqueda,    setBusqueda]    = useState('')
  const [filtroTipo,  setFiltroTipo]  = useState('')
  const [expandida,   setExpandida]   = useState(null)

  const { data: visitas = [], isLoading } = useQuery({
    queryKey: ['visitas', esCoord ? 'todas' : 'mias'],
    queryFn:  esCoord ? visitasApi.getTodas : visitasApi.getMisVisitas,
  })

  const filtradas = visitas.filter(v => {
    const q = busqueda.toLowerCase()
    const matchBusq = !busqueda
      || v.empresaNombre?.toLowerCase().includes(q)
      || v.motivo?.toLowerCase().includes(q)
      || v.registradoPorNombre?.toLowerCase().includes(q)
    const matchTipo = !filtroTipo || v.tipoVisitante === filtroTipo
    return matchBusq && matchTipo
  })

  const totalCoord   = visitas.filter(v => v.tipoVisitante === 'COORDINADOR').length
  const totalDocente = visitas.filter(v => v.tipoVisitante === 'DOCENTE_ASESOR').length

  const eliminarMutation = useMutation({
    mutationFn: visitasApi.eliminar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visitas'] })
      toast.success('Visita eliminada')
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al eliminar la visita'
    ),
  })

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2"
            style={{ color: '#023859' }}>
            <MapPin size={16} style={{ color: '#D91438' }} />
            {esCoord ? 'Visitas a empresas' : 'Mis visitas a empresas'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {esCoord
              ? 'Historial de visitas registradas por docentes y coordinadores'
              : 'Registro de tus visitas de seguimiento a empresas'}
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(v => !v)}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white"
          style={{ background: mostrarForm ? '#6b7a8d' : '#D91438' }}>
          <Plus size={13} />
          {mostrarForm ? 'Cancelar' : 'Registrar visita'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: esCoord ? 'Total visitas' : 'Mis visitas',
            value: visitas.length, bg: '#e6f0fb', color: '#0B416B' },
          { label: 'Por coordinador', value: totalCoord,
            bg: '#f3e8ff', color: '#6d28d9' },
          { label: 'Por docente', value: totalDocente,
            bg: '#fff8e6', color: '#a07010' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center"
            style={{ background: s.bg, border: `0.5px solid ${s.color}25` }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px]"        style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <FormVisita
          esCoord={esCoord}              // ← se pasa como prop, no se recalcula adentro
          onSuccess={() => {
            setMostrarForm(false)
            qc.invalidateQueries({ queryKey: ['visitas'] })
          }}
          onCancel={() => setMostrarForm(false)}
        />
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-3"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 flex-1 h-9 px-3 rounded-lg"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
          <Search size={13} style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por empresa, motivo o visitante..."
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: '#023859' }} />
        </div>
        {esCoord && (
          <div className="flex gap-2">
            {[
              { value: '',               label: 'Todos'        },
              { value: 'COORDINADOR',    label: 'Coordinador'  },
              { value: 'DOCENTE_ASESOR', label: 'Docente'      },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setFiltroTipo(opt.value)}
                className="h-9 px-3 rounded-lg text-[10px] font-bold"
                style={filtroTipo === opt.value
                  ? { background: '#023859', color: '#fff' }
                  : { background: '#f4f6f9', color: '#6b7a8d' }}>
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <span className="text-[10px] font-semibold flex-shrink-0"
          style={{ color: '#8a9bb0' }}>
          {filtradas.length} visita(s)
        </span>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24"
              style={{ border: '0.5px solid #e2e8f0' }} />
          ))}
        </div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <MapPin size={28} className="mx-auto mb-2" style={{ color: '#c0c8d4' }} />
          <p className="text-sm font-semibold" style={{ color: '#023859' }}>
            {visitas.length === 0 ? 'Aún no hay visitas registradas' : 'Ninguna visita coincide'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>
            {visitas.length === 0
              ? 'Registra la primera visita usando el botón de arriba'
              : 'Intenta con otros términos de búsqueda'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtradas.map(v => {
            const dur     = duracion(v.horaInicio, v.horaFin)
            const esPropia = v.registradoPorId === user?.id
            const abierta  = expandida === v.id

            return (
              <div key={v.id} className="bg-white rounded-xl overflow-hidden"
                style={{ border: '0.5px solid #e2e8f0' }}>

                <div
                  className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => setExpandida(abierta ? null : v.id)}
                  style={{ borderBottom: abierta ? '0.5px solid #f0f2f5' : 'none' }}>

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: v.tipoVisitante === 'COORDINADOR' ? '#f3e8ff' : '#e6f0fb',
                      color:      v.tipoVisitante === 'COORDINADOR' ? '#6d28d9' : '#0B416B',
                    }}>
                    {v.tipoVisitante === 'COORDINADOR'
                      ? <MapPin size={16} />
                      : <User   size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#023859' }}>
                          {v.empresaNombre}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6b7a8d' }}>
                          {v.motivo}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={v.tipoVisitante === 'COORDINADOR'
                            ? { background: '#f3e8ff', color: '#6d28d9' }
                            : { background: '#e6f0fb', color: '#0B416B' }}>
                          {v.tipoVisitante === 'COORDINADOR' ? 'Coordinador' : 'Docente'}
                        </span>
                        {abierta
                          ? <ChevronUp   size={14} style={{ color: '#8a9bb0' }} />
                          : <ChevronDown size={14} style={{ color: '#8a9bb0' }} />}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px]"
                        style={{ color: '#8a9bb0' }}>
                        <Calendar size={10} />
                        {fechaCorta(v.fecha)}
                      </span>
                      {v.horaInicio && (
                        <span className="flex items-center gap-1 text-[10px]"
                          style={{ color: '#8a9bb0' }}>
                          <Clock size={10} />
                          {v.horaInicio.slice(0, 5)}
                          {v.horaFin && ` → ${v.horaFin.slice(0, 5)}`}
                          {dur && ` (${dur})`}
                        </span>
                      )}
                      {esCoord && (
                        <span className="flex items-center gap-1 text-[10px]"
                          style={{ color: '#8a9bb0' }}>
                          <User size={10} />
                          {v.registradoPorNombre}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {abierta && (
                  <div className="px-5 py-4 flex flex-col gap-3"
                    style={{ background: '#f7f9fb' }}>
                    <div className="grid grid-cols-2 gap-3">
                      <DetalleItem icon={<Building2 size={12} />} label="Empresa"
                        value={v.empresaNombre} />
                      <DetalleItem icon={<User size={12} />} label="Registrado por"
                        value={v.registradoPorNombre} />
                      <DetalleItem icon={<Calendar size={12} />} label="Fecha"
                        value={fechaCorta(v.fecha)} />
                      <DetalleItem icon={<Clock size={12} />} label="Horario"
                        value={v.horaInicio
                          ? `${v.horaInicio.slice(0,5)}${v.horaFin
                              ? ' → ' + v.horaFin.slice(0,5) : ''}${dur ? ' (' + dur + ')' : ''}`
                          : 'No especificado'} />
                      <div className="col-span-2">
                        <DetalleItem icon={<FileText size={12} />} label="Motivo"
                          value={v.motivo} />
                      </div>
                    </div>

                    {v.observaciones && (
                      <div className="p-3 rounded-lg"
                        style={{ background: '#fff', border: '0.5px solid #e2e8f0' }}>
                        <p className="text-[10px] font-semibold mb-0.5"
                          style={{ color: '#023859' }}>Observaciones:</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
                          {v.observaciones}
                        </p>
                      </div>
                    )}

                    {(esPropia || esCoord) && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar esta visita?')) {
                              eliminarMutation.mutate(v.id)
                            }
                          }}
                          disabled={eliminarMutation.isPending}
                          className="flex items-center gap-1.5 h-7 px-3 rounded text-[10px] font-semibold"
                          style={{ background: '#fef0f0', color: '#c0392b' }}>
                          <Trash2 size={11} />
                          {eliminarMutation.isPending ? 'Eliminando...' : 'Eliminar visita'}
                        </button>
                      </div>
                    )}
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

// ── Formulario ────────────────────────────────────────────────────────────────

// ERROR 1 estaba: const userId = userId()  →  llamar función inexistente
// ERROR 2 estaba: esDocente no definida dentro de FormVisita (venía de fuera)
// ERROR 3 estaba: el filtro por estado === 'EN_PRACTICA' descartaba prácticas
//                 cuyo estado real puede ser diferente (ej. 'EN_PRACTICA' vs otro valor)

function FormVisita({ esCoord, onSuccess, onCancel }) {
  // esCoord viene como prop desde VisitasPage — NO se recalcula aquí
  const esDocente = !esCoord   // ← derivado directamente de la prop

  const [form, setForm] = useState({
    empresaId:     '',
    empresaNombre: '',
    fecha:         new Date().toISOString().split('T')[0],
    horaInicio:    '',
    horaFin:       '',
    motivo:        '',
    observaciones: '',
  })
  const [motivoPersonalizado, setMotivoPersonalizado] = useState(false)

  // Coordinador: todas las empresas
  const { data: todasEmpresas = [], isLoading: cargandoEmpresas } = useQuery({
    queryKey: ['empresas-lista'],
    queryFn:  async () => {
      const { data } = await api.get('/empresas')
      return data ?? []
    },
    enabled: esCoord,   // ← solo cuando es coordinador
  })

  // Docente: sus estudiantes con práctica
  // Usa queryKey ['mis-estudiantes-docente'] — misma que MisEstudiantesPage
  const { data: misEstudiantes = [], isLoading: cargandoEstudiantes } = useQuery({
    queryKey: ['mis-estudiantes-docente'],
    queryFn:  docenteApi.getMisEstudiantes,
    enabled:  esDocente,   // ← solo cuando es docente
  })

  // Filtrar los que tienen empresa — SIN filtrar por estado para no perder registros
  const estudiantesConEmpresa = misEstudiantes.filter(
    e => e.practica?.empresaNombre && e.practica?.empresaId
  )

  const handleSeleccionarEstudiante = (estudianteId) => {
    const est = misEstudiantes.find(e => String(e.id) === String(estudianteId))
    if (est?.practica?.empresaNombre) {
      setForm(f => ({
        ...f,
        empresaId:     String(est.practica.empresaId ?? ''),
        empresaNombre: est.practica.empresaNombre,
      }))
    } else {
      setForm(f => ({ ...f, empresaId: '', empresaNombre: '' }))
    }
  }

  const set = k => v => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => visitasApi.registrar({
      empresaId:     Number(form.empresaId),
      fecha:         form.fecha,
      horaInicio:    form.horaInicio    || null,
      horaFin:       form.horaFin       || null,
      motivo:        form.motivo,
      observaciones: form.observaciones || null,
    }),
    onSuccess: () => {
      toast.success('Visita registrada correctamente')
      onSuccess?.()
    },
    onError: (err) => toast.error(
      err?.response?.data?.message ?? 'Error al registrar la visita'
    ),
  })

  const valido = form.empresaId && form.fecha && form.motivo.trim()

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide block mb-1.5"
  const ls = { color: '#023859' }

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-4 pb-2"
        style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
        Registrar nueva visita
      </p>

      <div className="grid grid-cols-2 gap-4">

        {esDocente ? (
          <>
            {/* Docente: selecciona estudiante → empresa se autocompleta */}
            <div className="col-span-2">
              <label className={lc} style={ls}>Estudiante en práctica *</label>
              {cargandoEstudiantes ? (
                <div className="h-10 rounded-lg animate-pulse"
                  style={{ background: '#f0f2f5' }} />
              ) : estudiantesConEmpresa.length === 0 ? (
                <div className="h-10 px-3 rounded-lg flex items-center"
                  style={{ background: '#fff8e6', border: '1.5px solid #f0d080' }}>
                  <p className="text-xs" style={{ color: '#a07010' }}>
                    No tienes estudiantes con empresa asignada
                  </p>
                </div>
              ) : (
                <select
                  defaultValue=""
                  onChange={e => handleSeleccionarEstudiante(e.target.value)}
                  className={ic} style={is}>
                  <option value="" disabled>— Selecciona un estudiante —</option>
                  {estudiantesConEmpresa.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} — {e.practica.empresaNombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Empresa autocompleta */}
            {form.empresaNombre && (
              <div className="col-span-2">
                <label className={lc} style={ls}>Empresa (auto-completada)</label>
                <div className="h-10 px-3 rounded-lg flex items-center gap-2"
                  style={{ background: '#eaf7f0', border: '1.5px solid #b6e8cf' }}>
                  <Building2 size={13} style={{ color: '#1a7a4a' }} />
                  <p className="text-sm font-semibold" style={{ color: '#1a7a4a' }}>
                    {form.empresaNombre}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Coordinador: selecciona empresa directamente */
          <div className="col-span-2">
            <label className={lc} style={ls}>Empresa visitada *</label>
            <select
              value={form.empresaId}
              onChange={e => set('empresaId')(e.target.value)}
              className={ic} style={is}>
              <option value="">
                {cargandoEmpresas ? 'Cargando...' : '— Selecciona una empresa —'}
              </option>
              {todasEmpresas.map(e => (
                <option key={e.id} value={e.id}>{e.razonSocial}</option>
              ))}
            </select>
          </div>
        )}

        {/* Fecha */}
        <div>
          <label className={lc} style={ls}>Fecha de visita *</label>
          <input type="date" value={form.fecha}
            onChange={e => set('fecha')(e.target.value)}
            className={ic} style={is} />
        </div>

        {/* Horas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lc} style={ls}>Hora inicio</label>
            <input type="time" value={form.horaInicio}
              onChange={e => set('horaInicio')(e.target.value)}
              className={ic} style={is} />
          </div>
          <div>
            <label className={lc} style={ls}>Hora fin</label>
            <input type="time" value={form.horaFin}
              onChange={e => set('horaFin')(e.target.value)}
              className={ic} style={is} />
          </div>
        </div>

        {/* Motivo */}
        <div className="col-span-2">
          <label className={lc} style={ls}>Motivo de la visita *</label>
          {!motivoPersonalizado ? (
            <div className="flex flex-wrap gap-1.5">
              {MOTIVOS_FRECUENTES.map(m => (
                <button key={m} type="button"
                  onClick={() => set('motivo')(m)}
                  className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg transition-all"
                  style={form.motivo === m
                    ? { background: '#023859', color: '#fff' }
                    : { background: '#f4f6f9', color: '#6b7a8d',
                        border: '0.5px solid #e2e8f0' }}>
                  {m}
                </button>
              ))}
              <button type="button"
                onClick={() => { setMotivoPersonalizado(true); set('motivo')('') }}
                className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg"
                style={{ background: '#fde6ea', color: '#D91438' }}>
                + Otro
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={form.motivo}
                onChange={e => set('motivo')(e.target.value)}
                placeholder="Describe el motivo..."
                className={ic + ' flex-1'} style={is} />
              <button type="button"
                onClick={() => { setMotivoPersonalizado(false); set('motivo')('') }}
                className="h-10 px-3 rounded-lg text-[10px] font-semibold flex-shrink-0"
                style={{ background: '#f4f6f9', color: '#6b7a8d',
                         border: '0.5px solid #e2e8f0' }}>
                Predefinidos
              </button>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="col-span-2">
          <label className={lc} style={ls}>Observaciones (opcional)</label>
          <textarea value={form.observaciones}
            onChange={e => set('observaciones')(e.target.value)}
            rows={3}
            placeholder="Anota cualquier aspecto relevante de la visita..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={is} />
        </div>
      </div>

      {/* Preview duración */}
      {form.horaInicio && form.horaFin && (
        <div className="mt-3 p-2.5 rounded-lg flex items-center gap-2"
          style={{ background: '#e6f0fb', border: '0.5px solid #c5d9f0' }}>
          <Clock size={12} style={{ color: '#0B416B' }} />
          <p className="text-[10px] font-semibold" style={{ color: '#0B416B' }}>
            Duración: {duracion(form.horaInicio, form.horaFin)
              ?? 'La hora fin debe ser mayor a la hora inicio'}
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-end mt-4">
        <button onClick={onCancel}
          className="h-9 px-4 rounded-lg text-xs font-semibold"
          style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
          Cancelar
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={!valido || mutation.isPending}
          className="h-9 px-5 rounded-lg text-xs font-bold text-white"
          style={{ background: !valido || mutation.isPending ? '#a0aab4' : '#D91438' }}>
          {mutation.isPending ? 'Registrando...' : 'Registrar visita'}
        </button>
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────

function DetalleItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex-shrink-0" style={{ color: '#8a9bb0' }}>{icon}</div>
      <div>
        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{label}</p>
        <p className="text-xs font-medium" style={{ color: '#023859' }}>{value ?? '—'}</p>
      </div>
    </div>
  )
}