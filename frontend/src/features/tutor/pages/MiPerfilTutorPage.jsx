import { useQuery } from '@tanstack/react-query'
import { Mail, Phone, Briefcase, Building2 } from 'lucide-react'
import { tutorApi } from '../api/tutorApi'

export default function MiPerfilTutorPage() {
  const { data: tutor, isLoading: loadingTutor } = useQuery({
    queryKey: ['perfil-tutor'],
    queryFn:  tutorApi.getPerfilTutor,
  })

  const { data: estudiantes = [], isLoading: loadingEst } = useQuery({
    queryKey: ['mis-estudiantes-tutor'],
    queryFn:  tutorApi.getMisEstudiantes,
  })

  if (loadingTutor || loadingEst) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>Mi perfil</h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Información del tutor empresarial
        </p>
      </div>

      {/* Tarjeta principal */}
      <div className="rounded-xl p-6 text-center" style={{ background: '#D91438' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
          {tutor.nombre[0]}
        </div>
        <p className="text-sm font-bold text-white">{tutor.nombre}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {tutor.cargo}
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full mt-2"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
          <Building2 size={11} /> {tutor.empresaNombre}
        </span>
      </div>

      {/* Información de contacto */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3" style={{ color: '#023859' }}>
          Información de contacto
        </p>
        <div className="grid grid-cols-2 gap-4">
          <ContactoItem icon={<Mail size={14} />}      label="Correo"   value={tutor.correo} />
          <ContactoItem icon={<Phone size={14} />}     label="Teléfono" value={tutor.telefono} />
          <ContactoItem icon={<Briefcase size={14} />} label="Cargo"    value={tutor.cargo} />
          <ContactoItem icon={<Building2 size={14} />} label="Empresa"  value={tutor.empresaNombre} />
        </div>
      </div>

      {/* Resumen de estudiantes */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3" style={{ color: '#023859' }}>
          Resumen de practicantes
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ background: '#eaf7f0', border: '0.5px solid #b6e8cf' }}>
            <p className="text-2xl font-bold" style={{ color: '#1a7a4a' }}>{estudiantes.length}</p>
            <p className="text-[10px]" style={{ color: '#1a7a4a' }}>Estudiantes asignados</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
            <p className="text-2xl font-bold" style={{ color: '#a07010' }}>
              {estudiantes.filter(e => !e.encuestaCompletada).length}
            </p>
            <p className="text-[10px]" style={{ color: '#a07010' }}>Encuestas pendientes</p>
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