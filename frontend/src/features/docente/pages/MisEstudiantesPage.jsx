import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Building2, Search } from 'lucide-react'
import { docenteApi, ESTADO_PRACTICA_LABEL } from '../api/docenteApi'

export default function MisEstudiantesPage() {
  const navigate  = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['mis-estudiantes-docente'],
    queryFn:  docenteApi.getMisEstudiantes,
  })

  const filtrados = estudiantes.filter(e =>
    !busqueda ||
    e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.programa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.practica?.empresaNombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const conEmpresa = estudiantes.filter(e => e.practica?.empresaNombre).length
  const sinEmpresa = estudiantes.length - conEmpresa

  if (isLoading) return (
    <div className="flex flex-col gap-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-20"
          style={{ border: '0.5px solid #e2e8f0' }} />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Mis estudiantes asignados
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          {estudiantes.length} estudiante(s) a tu cargo este semestre
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Asignados',  value: estudiantes.length, bg: '#fef0f0', color: '#c0392b' },
          { label: 'Con empresa', value: conEmpresa,        bg: '#eaf7f0', color: '#1a7a4a' },
          { label: 'Sin empresa', value: sinEmpresa,        bg: '#fff8e6', color: '#a07010' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center"
            style={{ background: s.bg, border: `0.5px solid ${s.color}30` }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg"
          style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
          <Search size={13} style={{ color: '#8a9bb0' }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, programa o empresa..."
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: '#023859' }} />
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-sm" style={{ color: '#8a9bb0' }}>
            {estudiantes.length === 0
              ? 'No tienes estudiantes asignados'
              : 'Ningún estudiante coincide con la búsqueda'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map(e => {
            const cfg = ESTADO_PRACTICA_LABEL[e.practica?.estado]
              ?? ESTADO_PRACTICA_LABEL.ASIGNADA_PENDIENTE_INICIO

            return (
              <button key={e.id}
                onClick={() => navigate(`/docente/estudiantes/${e.id}`)}
                className="bg-white rounded-xl p-5 flex items-center justify-between text-left transition-all hover:shadow-sm"
                style={{ border: '0.5px solid #e2e8f0' }}>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: '#fde6ea', color: '#D91438' }}>
                    {e.nombre?.[0] ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#023859' }}>{e.nombre}</p>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      {e.programa} · Sem. {e.semestre}
                    </p>
                    {e.practica?.empresaNombre && (
                      <p className="flex items-center gap-1 text-[10px] mt-0.5"
                        style={{ color: '#0B416B' }}>
                        <Building2 size={10} /> {e.practica.empresaNombre}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <ChevronRight size={16} style={{ color: '#8a9bb0' }} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}