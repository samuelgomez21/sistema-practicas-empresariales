import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { estudianteApi } from '../api/estudianteApi'
import api from '@/lib/axios'

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
  const { user }   = useAuthStore()
  const qc         = useQueryClient()
  const fileRef    = useRef(null)
  const [subiendo, setSubiendo] = useState(false)

  const { data: perfil, isLoading } = useQuery({
    queryKey: ['mi-perfil-estudiante'],
    queryFn:  async () => {
      const { data } = await api.get('/estudiantes/mi-perfil')
      return data
    },
    enabled: !!user?.email,
  })

  const { data: hojaVida, refetch: refetchHV } = useQuery({
    queryKey: ['mi-hoja-vida'],
    queryFn:  async () => {
      const { data } = await api.get('/estudiantes/mi-perfil')
      return data?.hojaVidaUrl ? {
        url:        data.hojaVidaUrl,
        fechaCarga: data.fechaCreacion?.split('T')[0],
        nombre:     'Hoja de vida',
      } : null
    },
    enabled: !!user?.email,
  })

  const handleArchivo = async (archivo) => {
    if (!archivo) return
    setSubiendo(true)
    try {
      await estudianteApi.subirHojaVida(archivo)
      await refetchHV()
      qc.invalidateQueries({ queryKey: ['mi-perfil-estudiante'] })
      toast.success('Hoja de vida actualizada correctamente')
    } catch (err) {
      toast.error(err?.message ?? 'Error al subir la hoja de vida')
    } finally {
      setSubiendo(false)
    }
  }

  const e       = perfil
  const iniciales = e?.nombre
    ? e.nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : '?'
  const aptitud = APTITUD_STYLE[e?.estadoAptitud ?? 'SIN_EVALUAR']

  if (!e) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex items-center gap-4"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{ background: '#e6f0fb', color: '#0B416B' }}>
          {iniciales}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: '#023859' }}>{e.nombre}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>{e.email}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
            {e.tipoIdentificacion}: {e.identificacion}
          </p>
        </div>
        <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: aptitud.bg, color: aptitud.color }}>
          {aptitud.label}
        </span>
      </div>

      {/* Datos personales + académicos */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Datos personales
          </p>
          {[
            ['Nombre completo',     e.nombre],
            ['Tipo de documento',   e.tipoIdentificacion],
            ['Número de documento', e.identificacion],
            ['Correo electrónico',  e.email],
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
              ['Programa',           e.nombrePrograma],
              ['Facultad',           e.nombreFacultad],
              ['Semestre',           `Semestre ${e.semestre}`],
              ['Créditos aprobados', e.creditosAprobados],
              ['Promedio acumulado', `${Number(e.promedioAcumulado ?? 0).toFixed(2)} / 5.0`],
            ].map(([label, valor]) => (
              <div key={label} className="flex justify-between py-1.5"
                style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{label}</p>
                <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{valor ?? '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estado de aptitud */}
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
            <span className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-1"
              style={{ background: aptitud.bg, color: aptitud.color }}>
              {aptitud.label}
            </span>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7a8d' }}>
              {APTITUD_TEXTO[e.estadoAptitud ?? 'SIN_EVALUAR']}
            </p>
          </div>
        </div>
      </div>

      {/* Hoja de vida */}
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
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#023859' }}>
                {hojaVida.nombre}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                {hojaVida.fechaCarga
                  ? `Cargada el ${new Date(hojaVida.fechaCarga).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}`
                  : 'Fecha no disponible'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a href={hojaVida.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                Ver
              </a>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={subiendo}
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                {subiendo ? 'Subiendo...' : 'Actualizar'}
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !subiendo && fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer"
            style={{ border: '2px dashed #dce4ec', background: '#f7f9fb' }}>
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