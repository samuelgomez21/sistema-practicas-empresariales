import { useRef, useState } from 'react'

const ESTUDIANTE_MOCK = {
  nombre:             'Carlos Mendoza Ríos',
  correo:             'c.mendoza@uah.edu.co',
  tipoDocumento:      'CC',
  documento:          '1046527082',
  telefono:           '3001234567',
  contactoEmergencia: 'Rosa Mendoza — 3009876543',
  programa:           'Ingeniería de Software',
  semestre:           8,
  numeroPractica:     1,
  creditosAprobados:  148,
  promedioAcumulado:  4.10,
  estadoAptitud:      'APTO',
}

const HOJA_VIDA_MOCK = {
  url:        'https://mock.firebase.com/hv_carlos.pdf',
  fechaCarga: '2025-01-20',
  nombre:     'HV_Carlos_Mendoza.pdf',
}

const APTITUD_STYLE = {
  APTO:        { bg: '#eaf7f0', color: '#1a7a4a', label: 'Apto'        },
  NO_APTO:     { bg: '#fef0f0', color: '#c0392b', label: 'No apto'     },
  EN_REVISION: { bg: '#fff8e6', color: '#a07010', label: 'En revisión' },
  SIN_EVALUAR: { bg: '#f0f2f5', color: '#6b7a8d', label: 'Sin evaluar' },
}

const APTITUD_TEXTO = {
  APTO:        'Cumple todos los requisitos para salir a práctica empresarial.',
  NO_APTO:     'No cumple los requisitos mínimos para práctica en este momento.',
  EN_REVISION: 'El coordinador está validando tu situación académica.',
  SIN_EVALUAR: 'Aún no has sido evaluado por el coordinador académico.',
}

export default function MiPerfilEstudiantePage() {
  const e       = ESTUDIANTE_MOCK
  const fileRef = useRef(null)

  const [hojaVida, setHojaVida] = useState(HOJA_VIDA_MOCK)
  const [subiendo, setSubiendo] = useState(false)

  const iniciales = e.nombre
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  const aptitud = APTITUD_STYLE[e.estadoAptitud] ?? APTITUD_STYLE.SIN_EVALUAR

  const handleArchivo = (archivo) => {
    if (!archivo) return
    setSubiendo(true)
    // Reemplazar con llamada real a Firebase Storage + API
    setTimeout(() => {
      setHojaVida({
        url:        URL.createObjectURL(archivo),
        fechaCarga: new Date().toISOString().split('T')[0],
        nombre:     archivo.name,
      })
      setSubiendo(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-6 flex items-center gap-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{ background: '#e6f0fb', color: '#0B416B' }}
        >
          {iniciales}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>{e.nombre}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>{e.correo}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {e.tipoDocumento}: {e.documento}
          </p>
        </div>
        <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: aptitud.bg, color: aptitud.color }}>
          {aptitud.label}
        </span>
      </div>

      {/* ── Datos personales + académicos ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Datos personales
          </p>
          {[
            ['Nombre completo',     e.nombre],
            ['Tipo de documento',   e.tipoDocumento],
            ['Número de documento', e.documento],
            ['Correo electrónico',  e.correo],
            ['Teléfono',            e.telefono],
            ['Contacto emergencia', e.contactoEmergencia],
          ].map(([label, valor]) => (
            <div key={label} className="flex justify-between py-1.5"
              style={{ borderBottom: '0.5px solid #f7f9fb' }}>
              <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{label}</p>
              <p className="text-[11px] font-medium text-right" style={{ color: '#023859' }}>
                {valor ?? '—'}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Información académica
            </p>
            {[
              ['Programa',    e.programa],
              ['Semestre',    `Semestre ${e.semestre}`],
              ['N° práctica', `Práctica ${e.numeroPractica}`],
            ].map(([label, valor]) => (
              <div key={label} className="flex justify-between py-1.5"
                style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{label}</p>
                <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{valor}</p>
              </div>
            ))}
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1"
                style={{ color: '#8a9bb0' }}>
                Créditos aprobados
              </p>
              <p className="text-2xl font-bold" style={{ color: '#023859' }}>
                {e.creditosAprobados}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #e2e8f0' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1"
                style={{ color: '#8a9bb0' }}>
                Promedio acumulado
              </p>
              <p className="text-2xl font-bold" style={{ color: '#023859' }}>
                {e.promedioAcumulado.toFixed(2)}
              </p>
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>sobre 5.0</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Estado de aptitud ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-3 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Estado de aptitud
        </p>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: aptitud.bg }}>
            <span className="text-lg font-bold" style={{ color: aptitud.color }}>
              {e.estadoAptitud === 'APTO' ? '✓' : e.estadoAptitud === 'NO_APTO' ? '✗' : '~'}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: aptitud.bg, color: aptitud.color }}>
                {aptitud.label}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
              {APTITUD_TEXTO[e.estadoAptitud]}
            </p>
          </div>
        </div>
      </div>

      {/* ── Hoja de vida ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-1 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Hoja de vida
        </p>
        <p className="text-[10px] mb-4" style={{ color: '#8a9bb0' }}>
          Debe estar cargada para poder ser postulado a vacantes empresariales.
        </p>

        {hojaVida ? (
          <div className="flex items-center gap-4 p-4 rounded-lg"
            style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>

            {/* Ícono archivo */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#eaf7f0' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#1a7a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                {hojaVida.nombre}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                Cargada el {new Date(hojaVida.fechaCarga).toLocaleDateString('es-CO', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 flex-shrink-0">
              <a href={hojaVida.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Ver
              </a>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={subiendo}
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                {subiendo ? 'Subiendo...' : 'Actualizar'}
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer"
            style={{ border: '2px dashed #dce4ec', background: '#f7f9fb' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#fef0f0' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#D91438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold" style={{ color: '#023859' }}>
                No tienes hoja de vida cargada
              </p>
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                Haz clic para subir tu hoja de vida en PDF o Word
              </p>
            </div>
            <span className="h-8 px-4 rounded-lg text-[10px] font-bold text-white flex items-center"
              style={{ background: subiendo ? '#a0aab4' : '#D91438' }}>
              {subiendo ? 'Subiendo...' : 'Seleccionar archivo'}
            </span>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={e => handleArchivo(e.target.files?.[0])}
        />
      </div>

    </div>
  )
}