import { useQuery } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
import { estudianteApi } from '../api/estudianteApi'
import BadgeEstadoPractica from '../components/BadgeEstadoPractica'

export default function MiPracticaPage() {
  const { data: practica, isLoading } = useQuery({
    queryKey: ['mi-practica'],
    queryFn:  estudianteApi.getMiPractica,
  })

  if (isLoading) return <Skeleton />
  if (!practica) return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Sin práctica asignada</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-5 flex items-start justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>
            {practica.nombrePractica}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {practica.programa} · Semestre {practica.semestre}
          </p>
        </div>
        <BadgeEstadoPractica estado={practica.estado} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Información del catálogo */}
        <SeccionCard titulo="Información de la práctica">
          <Fila label="Nombre"         valor={practica.nombrePractica} />
          <Fila label="Materia núcleo" valor={practica.materiaNucleo}  />
          <Fila label="Programa"       valor={practica.programa}       />
          <Fila label="N° práctica"    valor={`Práctica ${practica.numeroPractica}`} />
          <Fila label="Fecha inicio"   valor={fmt(practica.fechaInicio)} />
          <Fila label="Fecha fin"      valor={fmt(practica.fechaFin)}    />
          <div className="mt-3 p-3 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#8a9bb0' }}>
              Actividades de la práctica
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
              {practica.descripcion}
            </p>
          </div>
        </SeccionCard>

        {/* Cortes */}
        <SeccionCard titulo="Cortes de seguimiento">
          <div className="flex flex-col gap-2 mt-1">
            {practica.cortes.map(c => (
              <div key={c.numero} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>{c.nombre}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                    Fecha límite: {fmt(c.fechaLimite)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SeccionCard>

        {/* Empresa */}
        <SeccionCard titulo="Mi empresa">
          <Fila label="Razón social" valor={practica.empresa?.razonSocial} />
          <Fila label="Sector"       valor={practica.empresa?.sector}       />
          <Fila label="Municipio"    valor={practica.empresa?.municipio}    />
          <Fila label="Teléfono"     valor={practica.empresa?.telefono}     />
          <Fila label="Contacto"     valor={practica.empresa?.nombreContacto} />
          <Fila label="Correo"       valor={practica.empresa?.emailContacto}  />
        </SeccionCard>

        {/* Equipo */}
        <SeccionCard titulo="Mi equipo de práctica">
          {/* Docente */}
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
              style={{ color: '#8a9bb0' }}>
              Docente asesor
            </p>
            <div className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                {practica.docente?.nombre?.[0]}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                  {practica.docente?.nombre}
                </p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  {practica.docente?.correo}
                </p>
              </div>
            </div>
          </div>

          {/* Tutor */}
          {practica.tutor && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
                style={{ color: '#8a9bb0' }}>
                Tutor empresarial
              </p>
              <div className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: '#fff8e6', color: '#a07010' }}>
                  {practica.tutor.nombre[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                    {practica.tutor.nombre}
                  </p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                    {practica.tutor.cargo} · {practica.tutor.telefono}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SeccionCard>

        {/* Planeador */}
        {practica.planeador?.url && (
          <div className="col-span-2 bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Planeador de práctica
            </p>
            <div className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#e6f0fb' }}>
                <ExternalLink size={16} style={{ color: '#0B416B' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                  Planeador firmado
                </p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  Cargado el {fmt(practica.planeador.fechaCarga)}
                </p>
              </div>
              <a href={practica.planeador.url} target="_blank" rel="noreferrer"
                className="h-7 px-3 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                <ExternalLink size={11} /> Ver documento
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const fmt = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

function SeccionCard({ titulo, children }) {
  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-3 pb-2"
        style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
        {titulo}
      </p>
      {children}
    </div>
  )
}

function Fila({ label, valor }) {
  return (
    <div className="flex justify-between py-1.5" style={{ borderBottom: '0.5px solid #f7f9fb' }}>
      <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{label}</p>
      <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{valor ?? '—'}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-white rounded-xl p-5 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-50 rounded mb-2" />)}
    </div>
  )
}