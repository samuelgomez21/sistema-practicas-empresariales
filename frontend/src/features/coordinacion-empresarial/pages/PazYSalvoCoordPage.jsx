import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Search, Lock, AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'
import api from '@/lib/axios'

const CHECKLIST_LABELS = {
  nota_docente:         'Nota docente',
  nota_tutor:           'Nota tutor',
  nota_final:           'Nota final',
  encuesta_estudiante:  'Encuesta estudiante',
  encuesta_tutor:       'Encuesta tutor',
  documentos_aprobados: 'Documentos aprobados',
  informe_final:        'Informe final aprobado',
}

// ── Modal de confirmación de cierre ──────────────────────────────────────────

function ModalConfirmarCierre({ estudiante, onConfirmar, onCancelar, cargando }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.45)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">

        {/* Icono */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: '#fff8e6' }}>
          <AlertTriangle size={24} style={{ color: '#a07010' }} />
        </div>

        <h3 className="text-sm font-bold text-center mb-1" style={{ color: '#023859' }}>
          Confirmar cierre formal
        </h3>
        <p className="text-xs text-center mb-4" style={{ color: '#6b7a8d' }}>
          Estás a punto de ejecutar el cierre formal de la práctica de
        </p>

        {/* Datos del estudiante */}
        <div className="p-3 rounded-xl mb-4"
          style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm font-bold text-center" style={{ color: '#023859' }}>
            {estudiante.nombre}
          </p>
          <p className="text-[10px] text-center mt-0.5" style={{ color: '#8a9bb0' }}>
            {estudiante.programa} · {estudiante.empresaNombre}
          </p>
        </div>

        {/* Aviso */}
        <div className="p-3 rounded-lg mb-5"
          style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
          <p className="text-[10px] font-semibold text-center" style={{ color: '#c0392b' }}>
            ⚠ Esta acción es irreversible. La práctica pasará a estado
            COMPLETADA o REPROBADA según la nota final registrada.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            disabled={cargando}
            className="flex-1 h-10 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={cargando}
            className="flex-1 h-10 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5"
            style={{ background: cargando ? '#a0aab4' : '#023859' }}>
            <Lock size={12} />
            {cargando ? 'Cerrando...' : 'Confirmar cierre'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function PazYSalvoCoordPage() {
  const [busqueda,            setBusqueda]            = useState('')
  const [estudianteACerrar,   setEstudianteACerrar]   = useState(null)
  const qc = useQueryClient()

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['seguimiento-estudiantes'],
    queryFn:  coordEmpresarialApi.getEstudiantesSeguimiento,
  })

  const cierreMutation = useMutation({
    mutationFn: (practicaId) => api.post(`/cierre/practica/${practicaId}/ejecutar`),
    onSuccess: (res) => {
      const resultado = res?.data?.estadoNuevo ?? 'COMPLETADA'
      qc.invalidateQueries({ queryKey: ['seguimiento-estudiantes'] })
      setEstudianteACerrar(null)
      toast.success(
        resultado === 'COMPLETADA'
          ? 'Práctica cerrada — estudiante APROBADO'
          : 'Práctica cerrada — estudiante REPROBADO'
      )
    },
    onError: (err) => {
      setEstudianteACerrar(null)
      toast.error(err?.response?.data?.message ?? 'Error al ejecutar el cierre')
    },
  })

  const enPractica = estudiantes.filter(e =>
    e.categoria === 'EN_PRACTICA' || e.estado === 'EN_PRACTICA'
  )

  const conPazYSalvo = enPractica.filter(e =>
    e.checklist.length > 0 && e.checklist.every(c => c.completado)
  )

  const pendientes = enPractica.filter(e =>
    e.checklist.length === 0 || !e.checklist.every(c => c.completado)
  )

  const filtrar = (lista) => lista.filter(e =>
    !busqueda ||
    e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.empresaNombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Modal de confirmación */}
      {estudianteACerrar && (
        <ModalConfirmarCierre
          estudiante={estudianteACerrar}
          cargando={cierreMutation.isPending}
          onConfirmar={() => cierreMutation.mutate(estudianteACerrar.practicaId)}
          onCancelar={() => setEstudianteACerrar(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Paz y salvo de práctica
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Seguimiento del cumplimiento de requisitos para cierre de práctica
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Listos para cierre', value: conPazYSalvo.length,
            bg: '#eaf7f0', border: '#b6e8cf', color: '#1a7a4a' },
          { label: 'Pendientes',         value: pendientes.length,
            bg: '#fef0f0', border: '#f7c1c1', color: '#c0392b' },
          { label: 'Total en práctica',  value: enPractica.length,
            bg: '#fff',    border: '#e2e8f0', color: '#023859' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center"
            style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px]"        style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Búsqueda */}
      {enPractica.length > 0 && (
        <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg"
            style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
            <Search size={13} style={{ color: '#8a9bb0' }} />
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o empresa..."
              className="flex-1 text-xs outline-none bg-transparent"
              style={{ color: '#023859' }} />
          </div>
        </div>
      )}

      {enPractica.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm" style={{ color: '#8a9bb0' }}>
            No hay estudiantes en práctica activa
          </p>
        </div>
      ) : (
        <>
          {/* ── Listos para cierre ── */}
          {filtrar(conPazYSalvo).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1a7a4a' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Listos para cierre formal ({filtrar(conPazYSalvo).length})
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {filtrar(conPazYSalvo).map(e => (
                  <div key={e.id} className="bg-white rounded-xl p-4"
                    style={{ border: '0.5px solid #b6e8cf', background: '#f7fdf9' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#023859' }}>
                          {e.nombre}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                          {e.programa} · {e.empresaNombre}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <CheckCircle size={11} style={{ color: '#1a7a4a' }} />
                          <span className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                            Todos los requisitos completados
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEstudianteACerrar(e)}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white flex-shrink-0"
                        style={{ background: '#023859' }}>
                        <Lock size={12} />
                        Ejecutar cierre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Pendientes ── */}
          {filtrar(pendientes).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a07010' }} />
                <p className="text-xs font-bold" style={{ color: '#023859' }}>
                  Pendientes por paz y salvo ({filtrar(pendientes).length})
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {filtrar(pendientes).map(e => {
                  const completados = e.checklist.filter(c => c.completado).length
                  const total       = e.checklist.length
                  const pct         = total > 0 ? Math.round((completados / total) * 100) : 0

                  return (
                    <div key={e.id} className="bg-white rounded-xl p-5"
                      style={{ border: '0.5px solid #e2e8f0' }}>

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#023859' }}>
                            {e.nombre}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                            {e.programa} · {e.empresaNombre}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                            style={{ background: '#fff8e6', color: '#a07010' }}>
                            {completados}/{total} requisitos
                          </span>
                          <span className="text-[9px] font-bold" style={{ color: '#8a9bb0' }}>
                            {pct}% completado
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full mb-4" style={{ background: '#f0f2f5' }}>
                        <div className="h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pct === 100 ? '#1a7a4a' : '#a07010' }} />
                      </div>

                      {e.checklist.length === 0 ? (
                        <p className="text-xs" style={{ color: '#8a9bb0' }}>
                          Checklist no disponible
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {e.checklist.map(c => (
                            <div key={c.clave}
                              className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                              style={{
                                background: c.completado ? '#f0faf4' : '#f7f9fb',
                                border:     `0.5px solid ${c.completado ? '#b6e8cf' : '#e2e8f0'}`,
                              }}>
                              {c.completado
                                ? <CheckCircle size={13} style={{ color: '#1a7a4a', flexShrink: 0 }} />
                                : <XCircle    size={13} style={{ color: '#c0392b', flexShrink: 0 }} />
                              }
                              <p className="text-[10px] font-medium"
                                style={{ color: c.completado ? '#1a7a4a' : '#6b7a8d' }}>
                                {CHECKLIST_LABELS[c.clave] ?? c.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {busqueda && filtrar(pendientes).length === 0 && filtrar(conPazYSalvo).length === 0 && (
            <div className="bg-white rounded-xl p-6 text-center"
              style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                Ningún estudiante coincide con la búsqueda
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}