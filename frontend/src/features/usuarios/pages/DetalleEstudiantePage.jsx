import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, User, Phone, BookOpen, Award } from 'lucide-react'
import { usuariosApi } from '../api/usuariosApi'
import Avatar from '../components/Avatar'
import BadgeAptitud from '../components/BadgeAptitud'
import BadgeEstadoUsuario from '../components/BadgeEstadoUsuario'

export default function DetalleEstudiantePage() {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante', id],
    queryFn: () => usuariosApi.getEstudianteById(id),
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-4" />
      <div className="h-4 w-full bg-gray-50 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-50 rounded" />
    </div>
  )

  if (!estudiante) return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Estudiante no encontrado</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Volver */}
      <button
        onClick={() => navigate('/usuarios/estudiantes')}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver a estudiantes
      </button>

      {/* Header del perfil */}
      <div className="bg-white rounded-xl p-6 flex items-start gap-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <Avatar nombre={estudiante.nombre} size={56} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#023859' }}>{estudiante.nombre}</h2>
              <p className="text-xs" style={{ color: '#8a9bb0' }}>{estudiante.correo}</p>
              <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
                {estudiante.tipoDocumento}: {estudiante.documento}
              </p>
            </div>
            <div className="flex gap-2">
              <BadgeAptitud estado={estudiante.estadoAptitud} />
              <BadgeEstadoUsuario activo={estudiante.activo} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Información personal */}
        <SeccionCard titulo="Información personal" icono={User}>
          <Fila label="Teléfono"            valor={estudiante.telefono} />
          <Fila label="Contacto emergencia" valor={estudiante.contactoEmergencia} />
        </SeccionCard>

        {/* Información académica */}
        <SeccionCard titulo="Información académica" icono={BookOpen}>
          <Fila label="Programa"       valor={estudiante.programa} />
          <Fila label="Semestre"       valor={`Semestre ${estudiante.semestre}`} />
          <Fila label="N° práctica"    valor={`Práctica ${estudiante.numeroPractica}`} />
        </SeccionCard>

        {/* Métricas académicas */}
        <SeccionCard titulo="Métricas académicas" icono={Award}>
          <div className="grid grid-cols-2 gap-3 mt-1">
            {[
              { label: 'Créditos aprobados',  value: estudiante.creditosAprobados },
              { label: 'Promedio acumulado',   value: estudiante.promedioAcumulado.toFixed(2) },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: '#8a9bb0' }}>
                  {m.label}
                </p>
                <p className="text-xl font-bold mt-1" style={{ color: '#023859' }}>{m.value}</p>
              </div>
            ))}
          </div>
        </SeccionCard>

        {/* Estado de aptitud */}
        <SeccionCard titulo="Estado de aptitud" icono={Award}>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-3">
              <BadgeAptitud estado={estudiante.estadoAptitud} />
              <p className="text-xs" style={{ color: '#6b7a8d' }}>
                {estudiante.estadoAptitud === 'APTO' && 'El estudiante cumple todos los requisitos para salir a práctica.'}
                {estudiante.estadoAptitud === 'NO_APTO' && 'El estudiante no cumple los requisitos mínimos.'}
                {estudiante.estadoAptitud === 'EN_REVISION' && 'El estudiante está en proceso de validación.'}
                {estudiante.estadoAptitud === 'SIN_EVALUAR' && 'El coordinador aún no ha evaluado la aptitud.'}
              </p>
            </div>
          </div>
        </SeccionCard>
      </div>
    </div>
  )
}

function SeccionCard({ titulo, icono: Icono, children }) {
  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="flex items-center gap-2 mb-4"
        style={{ borderBottom: '0.5px solid #f0f2f5', paddingBottom: 10 }}>
        <Icono size={14} style={{ color: '#0B416B' }} />
        <p className="text-xs font-bold" style={{ color: '#023859' }}>{titulo}</p>
      </div>
      {children}
    </div>
  )
}

function Fila({ label, valor }) {
  return (
    <div className="flex justify-between py-1.5"
      style={{ borderBottom: '0.5px solid #f7f9fb' }}>
      <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{label}</p>
      <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{valor}</p>
    </div>
  )
}