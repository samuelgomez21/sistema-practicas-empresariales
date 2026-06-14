import { useQuery } from '@tanstack/react-query'
import { Mail, BookOpen, GraduationCap, Users } from 'lucide-react'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../api/docenteApi'

export default function MiPerfilDocentePage() {
  const { data: perfil, isLoading: loadingPerfil } = useQuery({
    queryKey: ['perfil-docente'],
    queryFn:  docenteApi.getPerfilDocente,
  })

  const { data: estudiantes = [], isLoading: loadingEstudiantes } = useQuery({
    queryKey: ['mis-estudiantes-docente'],
    queryFn:  docenteApi.getMisEstudiantes,
  })

  if (loadingPerfil || loadingEstudiantes) return (
    <div className="flex flex-col gap-3">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-xl p-8 animate-pulse"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
        </div>
      ))}
    </div>
  )

  if (!perfil) return (
    <div className="bg-white rounded-xl p-8 text-center"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>
        No se pudo cargar el perfil del docente
      </p>
    </div>
  )

  const total       = estudiantes.length
  const conEmpresa  = estudiantes.filter(e => e.practica?.empresaNombre).length
  const sinEmpresa  = total - conEmpresa
  const max         = perfil.maxEstudiantes ?? 0
  const pct         = max > 0 ? (total / max) * 100 : 0
  const cuposLibres = max - total

  // Iniciales sin títulos académicos
  const nombreLimpio = perfil.nombre.replace(/^Dr\.?\s*|^Dra\.?\s*/i, '')
  const iniciales    = nombreLimpio
    .split(' ')
    .filter(p => p.length > 0)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Información docente y carga académica
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* ── Columna izquierda ── */}
        <div className="flex flex-col gap-4">

          {/* Tarjeta principal */}
          <div className="rounded-xl p-6 text-center" style={{ background: '#D91438' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              {iniciales}
            </div>
            <p className="text-sm font-bold text-white">{perfil.nombre}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {perfil.facultad}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full mt-2"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              <BookOpen size={11} /> {perfil.dedicacion}
            </span>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Contacto
            </p>
            <div className="flex flex-col gap-3">
              <ContactoItem
                icon={<Mail size={14} />}
                label="Correo institucional"
                value={perfil.correo} />
              <ContactoItem
                icon={<BookOpen size={14} />}
                label="Programa"
                value={perfil.programa} />
              <ContactoItem
                icon={<GraduationCap size={14} />}
                label="Facultad"
                value={perfil.facultad} />
            </div>
          </div>

          {/* Carga académica */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Carga académica
            </p>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs" style={{ color: '#6b7a8d' }}>Estudiantes asignados</p>
              <p className="text-xs font-bold" style={{ color: '#023859' }}>
                {total} / {max}
              </p>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: '#f0f2f5' }}>
              <div className="h-2 rounded-full transition-all"
                style={{
                  width:      `${Math.min(pct, 100)}%`,
                  background: pct >= 100 ? '#c0392b' : pct > 70 ? '#a07010' : '#1a7a4a',
                }} />
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: '#8a9bb0' }}>
              {cuposLibres > 0
                ? `${cuposLibres} cupo(s) disponible(s)`
                : 'Sin cupos disponibles'}
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: 'Total',      value: total,       bg: '#fef0f0', color: '#c0392b' },
                { label: 'Con emp.',   value: conEmpresa,  bg: '#eaf7f0', color: '#1a7a4a' },
                { label: 'Sin emp.',   value: sinEmpresa,  bg: '#fff8e6', color: '#a07010' },
              ].map(s => (
                <div key={s.label} className="rounded-lg p-2 text-center"
                  style={{ background: s.bg }}>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[9px]" style={{ color: s.color }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Información académica */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2 flex items-center gap-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              <GraduationCap size={14} style={{ color: '#D91438' }} />
              Información académica
            </p>
            <div className="grid grid-cols-2 gap-3">
              <InfoBox label="Nombre completo"      value={perfil.nombre} />
              <InfoBox label="Facultad"             value={perfil.facultad} />
              <InfoBox label="Programa"             value={perfil.programa} />
              <InfoBox label="Tipo de vinculación"  value={perfil.dedicacion} />
              <InfoBox label="Correo institucional" value={perfil.correo} />
              <InfoBox label="Capacidad máxima"
                value={max > 0 ? `${max} estudiante(s)` : 'Sin límite configurado'} />
            </div>
          </div>

          {/* Estudiantes asignados */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2 flex items-center gap-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              <Users size={14} style={{ color: '#D91438' }} />
              Estudiantes asignados ({total})
            </p>

            {total === 0 ? (
              <div className="p-4 rounded-lg text-center"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <p className="text-xs" style={{ color: '#8a9bb0' }}>
                  No tienes estudiantes asignados actualmente
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {estudiantes.map(e => {
                  const cfg = ESTADO_PRACTICA_LABEL[e.practica?.estado]
                    ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO
                  const tieneEmpresa = !!e.practica?.empresaNombre

                  return (
                    <div key={e.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: '#fde6ea', color: '#D91438' }}>
                          {e.nombre?.[0] ?? '?'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                            {e.nombre}
                          </p>
                          <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                            {e.programa} · Sem. {e.semestre}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {tieneEmpresa ? e.practica.empresaNombre : cfg.label}
                        </span>
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: tieneEmpresa ? '#1a7a4a' : '#a07010' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-componentes ────────────────────────────────────────────────────────────

function ContactoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: '#fde6ea', color: '#D91438' }}>
        {icon}
      </div>
      <div>
        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{label}</p>
        <p className="text-xs font-medium" style={{ color: '#023859' }}>{value ?? '—'}</p>
      </div>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: '#f7f9fb' }}>
      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{label}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: '#023859' }}>{value ?? '—'}</p>
    </div>
  )
}