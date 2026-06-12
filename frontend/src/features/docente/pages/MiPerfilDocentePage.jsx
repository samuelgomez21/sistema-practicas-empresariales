import { useQuery } from '@tanstack/react-query'
import { Mail, BookOpen, GraduationCap, Users } from 'lucide-react'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../api/docenteApi'

export default function MiPerfilDocentePage() {
  const { data: docente, isLoading: loadingDocente } = useQuery({
    queryKey: ['perfil-docente'],
    queryFn:  docenteApi.getPerfilDocente,
  })

  const { data: estudiantes = [], isLoading: loadingEstudiantes } = useQuery({
    queryKey: ['mis-estudiantes-docente'],
    queryFn:  docenteApi.getMisEstudiantes,
  })

  if (loadingDocente || loadingEstudiantes) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  const total      = estudiantes.length
  const conEmpresa = estudiantes.filter(e => e.practica?.empresaNombre).length
  const sinEmpresa = total - conEmpresa
  const pct        = docente.maxEstudiantes > 0 ? (total / docente.maxEstudiantes) * 100 : 0
  const cuposLibres = docente.maxEstudiantes - total

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Información docente y carga académica
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">

          {/* Tarjeta principal — rojo */}
          <div className="rounded-xl p-6 text-center"
            style={{ background: '#D91438' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              {docente.nombre.split(' ').find(p => p[0] === p[0].toUpperCase() && p.length > 2 && !['Dr.','Dra.'].includes(p))?.[0]
                ?? docente.nombre.replace(/^Dr\.?\s*|^Dra\.?\s*/, '')[0]}
            </div>
            <p className="text-sm font-bold text-white">{docente.nombre}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {docente.facultad}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full mt-2"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              <BookOpen size={11} /> {docente.dedicacion}
            </span>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#023859' }}>Contacto</p>
            <div className="flex flex-col gap-3">
              <ContactoItem icon={<Mail size={14} />}        label="Correo institucional" value={docente.correo} />
              <ContactoItem icon={<BookOpen size={14} />}     label="Programa a cargo"     value={docente.programa} />
              <ContactoItem icon={<GraduationCap size={14} />} label="Facultad"            value={docente.facultad} />
            </div>
          </div>

          {/* Carga académica */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#023859' }}>Carga académica</p>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs" style={{ color: '#6b7a8d' }}>Estudiantes asignados</p>
              <p className="text-xs font-bold" style={{ color: '#023859' }}>
                {total} / {docente.maxEstudiantes}
              </p>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: '#f0f2f5' }}>
              <div className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: pct >= 100 ? '#c0392b' : pct > 70 ? '#a07010' : '#1a7a4a',
                }} />
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: '#8a9bb0' }}>
              {cuposLibres > 0 ? `${cuposLibres} cupos disponibles` : 'Sin cupos disponibles'}
            </p>
          </div>
        </div>

        {/* Columna derecha — 2/3 */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Información académica */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: '#023859' }}>
              <GraduationCap size={14} style={{ color: '#D91438' }} />
              Información académica
            </p>
            <div className="grid grid-cols-2 gap-3">
              <InfoBox label="Nombre completo"      value={docente.nombre} />
              <InfoBox label="Facultad"             value={docente.facultad} />
              <InfoBox label="Programa"             value={docente.programa} />
              <InfoBox label="Tipo de contrato"     value={docente.dedicacion} />
              <InfoBox label="Correo institucional" value={docente.correo} />
              <InfoBox label="Capacidad máxima"     value={`${docente.maxEstudiantes} estudiantes`} />
            </div>
          </div>

          {/* Estudiantes asignados */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: '#023859' }}>
              <Users size={14} style={{ color: '#D91438' }} />
              Estudiantes asignados ({total})
            </p>
            <div className="flex flex-col gap-2">
              {estudiantes.map(e => {
                const tieneEmpresa = !!e.practica?.empresaNombre
                return (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#fde6ea', color: '#D91438' }}>
                        {e.nombre[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#023859' }}>{e.nombre}</p>
                        <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                          {e.programa} · Sem. {e.semestre}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                        style={tieneEmpresa
                          ? { background: '#eaf7f0', color: '#1a7a4a' }
                          : { background: '#f0f2f5', color: '#6b7a8d' }}>
                        {tieneEmpresa ? e.practica.empresaNombre : 'Sin empresa'}
                      </span>
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: tieneEmpresa ? '#1a7a4a' : '#a07010' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats inferiores */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-4 text-center" style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
              <p className="text-2xl font-bold" style={{ color: '#1a7a4a' }}>{conEmpresa}</p>
              <p className="text-[10px]" style={{ color: '#1a7a4a' }}>Con empresa</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
              <p className="text-2xl font-bold" style={{ color: '#a07010' }}>{sinEmpresa}</p>
              <p className="text-[10px]" style={{ color: '#a07010' }}>Sin empresa</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
              <p className="text-2xl font-bold" style={{ color: '#c0392b' }}>{total}</p>
              <p className="text-[10px]" style={{ color: '#c0392b' }}>Total asignados</p>
            </div>
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
        <p className="text-xs font-medium" style={{ color: '#023859' }}>{value}</p>
      </div>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: '#f7f9fb' }}>
      <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{label}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: '#023859' }}>{value}</p>
    </div>
  )
}