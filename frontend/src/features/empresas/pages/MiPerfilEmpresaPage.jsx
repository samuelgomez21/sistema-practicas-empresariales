import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Edit, Upload, CheckCircle, ExternalLink,
  MapPin, Globe, Phone, Mail, X
} from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'

const schema = z.object({
  razonSocial:     z.string().min(3),
  nit:             z.string().min(5),
  sectorEconomico: z.string().min(1),
  direccion:       z.string().min(5),
  municipio:       z.string().min(3),
  telefono:        z.string().min(7),
  sitioWeb:        z.string().optional(),
  nombreContacto:  z.string().min(3),
  emailContacto:   z.string().email(),
})

const SECTORES = [
  'Tecnología','Finanzas','Turismo','Comercio','Manufactura',
  'Salud','Educación','Construcción','Agropecuario','Servicios',
]

const DOCS_CONFIG = [
  {
    key:    'camaraComercio',
    label:  'Cámara de Comercio',
    nota:   'Vigencia no mayor a 30 días',
    tieneVigencia: true,
  },
  {
    key:    'nit_doc',
    label:  'RUT / NIT',
    nota:   'Documento tributario de la empresa',
    tieneVigencia: false,
  },
  {
    key:    'cedulaRL',
    label:  'Cédula Representante Legal',
    nota:   'Fotocopia ampliada al 150%',
    tieneVigencia: false,
  },
  {
    key:    'convenio',
    label:  'Convenio con la Universidad',
    nota:   'Vigencia 5 años — Firmado por ambas partes',
    tieneVigencia: true,
    soloCoordinadora: true,
  },
]

export default function MiPerfilEmpresaPage({ soloLectura = false, empresaOverride = null }) {

  const { data: empresaFetched, isLoading } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
    enabled:  !empresaOverride, // no hace fetch si ya tenemos datos
  })

  const empresa = empresaOverride ?? empresaFetched
  
  const qc       = useQueryClient()
  const fileRefs = useRef({})
  const [editando, setEditando] = useState(false)


  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    values:   empresa,
  })

  const editarMutation = useMutation({
    mutationFn: (data) => empresasApi.editarEmpresa(empresa.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-empresa'] })
      toast.success('Perfil actualizado correctamente')
      setEditando(false)
    },
  })

  const subirMutation = useMutation({
    mutationFn: ({ tipo }) => empresasApi.subirDocumento(empresa.id, tipo, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-empresa'] })
      toast.success('Documento actualizado correctamente')
    },
  })

  

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse"
      style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }

  // Calcular estado del convenio
  const convenioVigente = empresa?.convenio?.fechaFin
    && new Date(empresa.convenio.fechaFin) > new Date()


  return (
    <div className="flex flex-col gap-4">

      {/* ── Header con stats ───────────────────────────────────── */}
      <div className="bg-white rounded-xl p-5"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#e6f0fb' }}>
            <span className="text-xl font-bold" style={{ color: '#0B416B' }}>
              {empresa?.razonSocial?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: '#023859' }}>
                {empresa?.razonSocial}
              </h2>
              <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                Empresa habilitada
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
              {empresa?.sectorEconomico}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px]"
                style={{ color: '#8a9bb0' }}>
                <MapPin size={11} /> {empresa?.municipio}
              </span>
              {empresa?.sitioWeb && (
                <span className="flex items-center gap-1 text-[10px]"
                  style={{ color: '#8a9bb0' }}>
                  <Globe size={11} /> {empresa?.sitioWeb}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats dinámicas */}
        <div className="grid grid-cols-3 gap-3 pt-4"
          style={{ borderTop: '0.5px solid #f0f2f5' }}>
          {[
            { label: 'Vacantes activas',       value: empresa?.vacantesActivas ?? 0        },
            { label: 'En práctica',            value: empresa?.estudiantesEnPractica ?? 0  },
            { label: 'NIT',                    value: empresa?.nit, isText: true            },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={s.isText ? 'text-base font-bold' : 'text-2xl font-bold'}
                style={{ color: '#023859' }}>
                {s.value}
              </p>
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cuerpo principal ───────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Columna izquierda — 2/3 */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Información general */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center justify-between mb-4 pb-2"
              style={{ borderBottom: '0.5px solid #f0f2f5' }}>
              <p className="text-xs font-bold" style={{ color: '#023859' }}>
                Información general
              </p>
              {!soloLectura && !editando && (
                <button onClick={() => setEditando(true)}
                  className="flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-semibold"
                  style={{ border: '0.5px solid #e2e8f0', color: '#6b7a8d', background: '#f7f9fb' }}>
                  <Edit size={11} /> Editar
                </button>
              )}
            </div>

            {!editando ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['NIT',              empresa?.nit],
                  ['Sector',           empresa?.sectorEconomico],
                  ['Nombre contacto',  empresa?.nombreContacto],
                  ['Correo contacto',  empresa?.emailContacto],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{l}</p>
                    <p className="text-xs font-medium" style={{ color: '#023859' }}>{v ?? '—'}</p>
                  </div>
                ))}
                <div className="col-span-2">
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Actividad económica</p>
                  <p className="text-xs font-medium" style={{ color: '#023859' }}>
                    {empresa?.sectorEconomico}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(d => editarMutation.mutate(d))}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { name: 'razonSocial',    label: 'Razón social'    },
                    { name: 'nit',            label: 'NIT'             },
                    { name: 'sectorEconomico', label: 'Sector',  isSelect: true },
                    { name: 'nombreContacto', label: 'Nombre contacto' },
                    { name: 'emailContacto',  label: 'Email contacto'  },
                    { name: 'telefono',       label: 'Teléfono'        },
                    { name: 'direccion',      label: 'Dirección'       },
                    { name: 'municipio',      label: 'Municipio'       },
                    { name: 'sitioWeb',       label: 'Sitio web (opcional)' },
                  ].map(f => (
                    <div key={f.name} className="flex flex-col gap-1">
                      <label className={lc} style={ls}>{f.label}</label>
                      {f.isSelect ? (
                        <select {...register(f.name)} className={ic} style={is}>
                          {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <input {...register(f.name)} className={ic} style={is} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setEditando(false); reset() }}
                    className="h-8 px-4 rounded-lg text-xs font-semibold"
                    style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={editarMutation.isPending}
                    className="h-8 px-4 rounded-lg text-xs font-bold text-white"
                    style={{ background: editarMutation.isPending ? '#a0aab4' : '#D91438' }}>
                    {editarMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Información de contacto */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-4 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Información de contacto
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Mail size={13} />,  label: 'Correo corporativo', value: empresa?.emailContacto },
                { icon: <Phone size={13} />, label: 'Teléfono',           value: empresa?.telefono      },
                { icon: <MapPin size={13} />,label: 'Ciudad',             value: empresa?.municipio     },
                { icon: <MapPin size={13} />,label: 'Dirección',          value: empresa?.direccion     },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-2">
                  <div className="mt-0.5" style={{ color: '#8a9bb0' }}>{c.icon}</div>
                  <div>
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{c.label}</p>
                    <p className="text-xs font-medium" style={{ color: '#023859' }}>{c.value ?? '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha — 1/3 */}
        <div className="flex flex-col gap-4">

          {/* Documentación requerida */}
          <div className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-4 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Documentación requerida
            </p>
            <div className="flex flex-col gap-3">
              {DOCS_CONFIG.map(doc => {
                const d       = empresa?.[doc.key]
                const tiene   = !!d?.url
                const valido  = !!d?.validado
                const esSoloCoord = doc.soloLectura || doc.soloCoordinadora

                return (
                  <div key={doc.key} className="p-3 rounded-lg"
                    style={{
                      background: tiene && valido ? '#f7fdf9' : '#f7f9fb',
                      border: tiene && valido ? '0.5px solid #b6e8cf' : '0.5px solid #e2e8f0',
                    }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                            {doc.label}
                          </p>
                          {tiene && valido && (
                            <CheckCircle size={11} style={{ color: '#1a7a4a' }} />
                          )}
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
                          {doc.nota}
                        </p>
                        {doc.tieneVigencia && d?.fechaVigencia && (
                          <p className="text-[10px]" style={{ color: '#6b7a8d' }}>
                            Vence: {new Date(d.fechaVigencia).toLocaleDateString('es-CO')}
                          </p>
                        )}
                        {doc.key === 'convenio' && d?.fechaFin && (
                          <p className="text-[10px]" style={{ color: '#6b7a8d' }}>
                            Vence: {new Date(d.fechaFin).toLocaleDateString('es-CO')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 mt-2">
                      {tiene && (
                        <a href={d.url} target="_blank" rel="noreferrer"
                          className="text-[10px] font-medium"
                          style={{ color: '#0B416B' }}>
                          Ver
                        </a>
                      )}
                      {tiene && !soloLectura && !esSoloCoord && (
                        <>
                          <span style={{ color: '#e2e8f0' }}>·</span>
                          <button
                            onClick={() => fileRefs.current[doc.key]?.click()}
                            className="text-[10px] font-medium"
                            style={{ color: '#0B416B' }}>
                            Actualizar
                          </button>
                        </>
                      )}
                      {!tiene && !soloLectura && !esSoloCoord && (
                        <button
                          onClick={() => fileRefs.current[doc.key]?.click()}
                          className="flex items-center gap-1 h-6 px-2 rounded text-[10px] font-semibold"
                          style={{ background: '#e6f0fb', color: '#0B416B' }}>
                          <Upload size={10} /> Subir
                        </button>
                      )}
                      {!tiene && esSoloCoord && (
                        <p className="text-[10px]" style={{ color: '#c0392b' }}>
                          Pendiente de carga
                        </p>
                      )}
                    </div>

                    <input
                      ref={el => fileRefs.current[doc.key] = el}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={() => subirMutation.mutate({ tipo: doc.key })}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estado del convenio */}
          <div className="bg-white rounded-xl p-4"
            style={{
              border: convenioVigente
                ? '0.5px solid #b6e8cf'
                : '0.5px solid #f7c1c1',
              background: convenioVigente ? '#f7fdf9' : '#fef0f0',
            }}>
            <div className="flex items-center gap-2">
              <CheckCircle size={14}
                style={{ color: convenioVigente ? '#1a7a4a' : '#c0392b' }} />
              <p className="text-xs font-semibold"
                style={{ color: convenioVigente ? '#1a7a4a' : '#c0392b' }}>
                {convenioVigente ? 'Convenio vigente' : 'Convenio vencido'}
              </p>
            </div>
            {empresa?.convenio?.fechaFin && (
              <p className="text-[10px] mt-1" style={{ color: '#6b7a8d' }}>
                Vence: {new Date(empresa.convenio.fechaFin).toLocaleDateString('es-CO')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}