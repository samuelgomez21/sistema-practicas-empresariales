import { useQuery } from '@tanstack/react-query'
import { Mail, Phone, Briefcase, Building2, Users, ClipboardCheck } from 'lucide-react'
import { tutorApi } from '../api/tutorApi'

export default function MiPerfilTutorPage() {
  const { data: perfil, isLoading: loadingPerfil } = useQuery({
    queryKey: ['perfil-tutor'],
    queryFn:  tutorApi.getPerfilTutor,
  })

  const { data: estudiantes = [], isLoading: loadingEst } = useQuery({
    queryKey: ['mis-estudiantes-tutor'],
    queryFn:  tutorApi.getMisEstudiantes,
  })

  if (loadingPerfil || loadingEst) return (
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
        No se pudo cargar el perfil del tutor
      </p>
    </div>
  )

  const iniciales = perfil.nombre
    .split(' ').filter(p => p.length > 0).slice(0, 2)
    .map(p => p[0]).join('').toUpperCase()

  const encuestasPendientes = estudiantes.filter(e => !e.encuestaCompletada).length
  const notasPendientes     = estudiantes.filter(e => e.notaTutor == null).length

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>Mi perfil</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Información del tutor empresarial
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">

          {/* Tarjeta principal */}
          <div className="rounded-xl p-6 text-center" style={{ background: '#D91438' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              {iniciales}
            </div>
            <p className="text-sm font-bold text-white">{perfil.nombre}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {perfil.cargo}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full mt-2"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              <Building2 size={11} /> {perfil.empresaNombre}
            </span>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Información de contacto
            </p>
            <div className="flex flex-col gap-3">
              <ContactoItem icon={<Mail size={14} />}      label="Correo"   value={perfil.correo} />
              <ContactoItem icon={<Phone size={14} />}     label="Teléfono" value={perfil.telefono} />
              <ContactoItem icon={<Briefcase size={14} />} label="Cargo"    value={perfil.cargo} />
              <ContactoItem icon={<Building2 size={14} />} label="Empresa"  value={perfil.empresaNombre} />
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Resumen
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Practicantes asignados', value: estudiantes.length,
                  bg: '#e6f0fb', color: '#0B416B', icon: <Users size={12} /> },
                { label: 'Encuestas pendientes',   value: encuestasPendientes,
                  bg: encuestasPendientes > 0 ? '#fef0f0' : '#eaf7f0',
                  color: encuestasPendientes > 0 ? '#c0392b' : '#1a7a4a',
                  icon: <ClipboardCheck size={12} /> },
                { label: 'Notas pendientes',       value: notasPendientes,
                  bg: notasPendientes > 0 ? '#fff8e6' : '#eaf7f0',
                  color: notasPendientes > 0 ? '#a07010' : '#1a7a4a',
                  icon: null },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-2.5 rounded-lg"
                  style={{ background: s.bg }}>
                  <div className="flex items-center gap-1.5">
                    {s.icon && <span style={{ color: s.color }}>{s.icon}</span>}
                    <p className="text-[10px]" style={{ color: s.color }}>{s.label}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Info */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Información profesional
            </p>
            <div className="grid grid-cols-2 gap-3">
              <InfoBox label="Nombre completo" value={perfil.nombre} />
              <InfoBox label="Empresa"         value={perfil.empresaNombre} />
              <InfoBox label="Cargo"           value={perfil.cargo} />
              <InfoBox label="Correo"          value={perfil.correo} />
              <InfoBox label="Teléfono"        value={perfil.telefono} />
            </div>
          </div>

          {/* Estudiantes */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Practicantes asignados ({estudiantes.length})
            </p>

            {estudiantes.length === 0 ? (
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                No tienes practicantes asignados actualmente
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {estudiantes.map(e => (
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
                      {e.notaTutor != null && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                          Nota: {Number(e.notaTutor).toFixed(1)}
                        </span>
                      )}
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={e.encuestaCompletada
                          ? { background: '#eaf7f0', color: '#1a7a4a' }
                          : { background: '#fff8e6', color: '#a07010' }}>
                        {e.encuestaCompletada ? 'Encuesta ✓' : 'Encuesta pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

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