import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Edit, MapPin, Phone, Mail, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'
import TutoresAdminPage from './TutoresAdminPage'
import { useRef } from 'react'
import { Upload, ExternalLink, CheckCircle, Clock } from 'lucide-react'

const schema = z.object({
  razonSocial:             z.string().min(3),
  sectorEconomico:         z.string().min(1),
  direccion:               z.string().min(5),
  municipio:               z.string().min(3),
  telefono:                z.string().min(7),
  contactoPrincipalNombre: z.string().min(3),
  contactoPrincipalEmail:  z.string().email(),
})

const DOCS_CONFIG = [
  { tipo: 'CAMARA_COMERCIO', label: 'Cámara de Comercio',           tieneVigencia: true  },
  { tipo: 'NIT',             label: 'RUT / NIT',                    tieneVigencia: false },
  { tipo: 'CEDULA_RL',       label: 'Cédula Representante Legal',   tieneVigencia: false },
  { tipo: 'CONVENIO',        label: 'Convenio con la Universidad',  tieneVigencia: true  },
]

const SECTORES = [
  'Tecnología','Finanzas','Turismo','Comercio','Manufactura',
  'Salud','Educación','Construcción','Agropecuario','Servicios',
]

export default function MiPerfilEmpresaPage({ soloLectura = false, empresaOverride = null }) {
  const { data: empresaFetched, isLoading } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
    enabled:  !empresaOverride,
  })

  const empresa = empresaOverride ?? empresaFetched
  const qc = useQueryClient()
  const [editando, setEditando] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    values: empresa,
  })

  const editarMutation = useMutation({
    mutationFn: (data) => empresasApi.editarEmpresa(empresa.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-empresa'] })
      qc.invalidateQueries({ queryKey: ['empresa', String(empresa?.id)] })
      toast.success('Perfil actualizado correctamente')
      setEditando(false)
    },
    onError: () => toast.error('Error al actualizar el perfil'),
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-3" />
    </div>
  )

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#e6f0fb' }}>
            <Building2 size={24} style={{ color: '#0B416B' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold" style={{ color: '#023859' }}>
              {empresa?.razonSocial}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
              {empresa?.sectorEconomico} · NIT {empresa?.nit}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                <MapPin size={11} /> {empresa?.municipio}
              </span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: '#8a9bb0' }}>
                <Phone size={11} /> {empresa?.telefono}
              </span>
            </div>
          </div>
          {!soloLectura && !editando && (
            <button onClick={() => setEditando(true)}
              className="flex items-center gap-1 h-8 px-3 rounded-lg text-[10px] font-semibold"
              style={{ border: '0.5px solid #e2e8f0', color: '#6b7a8d', background: '#f7f9fb' }}>
              <Edit size={12} /> Editar
            </button>
          )}
        </div>
      </div>

      {/* Información general */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-4 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Información general
        </p>

        {!editando ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              ['NIT',                empresa?.nit],
              ['Sector económico',   empresa?.sectorEconomico],
              ['Dirección',          empresa?.direccion],
              ['Municipio',          empresa?.municipio],
              ['Teléfono',           empresa?.telefono],
              ['Contacto principal', empresa?.contactoPrincipalNombre],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{l}</p>
                <p className="text-xs font-medium" style={{ color: '#023859' }}>{v ?? '—'}</p>
              </div>
            ))}
            <div className="flex items-start gap-2">
              <Mail size={13} style={{ color: '#8a9bb0', marginTop: 2 }} />
              <div>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>Correo de contacto</p>
                <p className="text-xs font-medium" style={{ color: '#023859' }}>
                  {empresa?.contactoPrincipalEmail}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(d => editarMutation.mutate(d))}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { name: 'razonSocial',             label: 'Razón social' },
                { name: 'sectorEconomico',         label: 'Sector', isSelect: true },
                { name: 'direccion',               label: 'Dirección' },
                { name: 'municipio',               label: 'Municipio' },
                { name: 'telefono',                label: 'Teléfono' },
                { name: 'contactoPrincipalNombre', label: 'Contacto principal' },
                { name: 'contactoPrincipalEmail',  label: 'Correo de contacto' },
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
                  {errors[f.name] && (
                    <p className="text-xs" style={{ color: '#D91438' }}>{errors[f.name].message}</p>
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

      {/* Tutores de esta empresa */}
      {empresa?.id && (
        <TutoresAdminPage empresaIdFijo={empresa.id} />
      )}
      {/* Documentos de la empresa */}
      {empresa?.id && <DocumentosEmpresaSection empresaId={empresa.id} soloLectura={soloLectura} />}
    </div>
  )
}

function DocumentosEmpresaSection({ empresaId, soloLectura }) {
  const qc   = useQueryClient()
  const refs = useRef({})
  const [subiendo, setSubiendo] = useState({})
  const [vigencias, setVigencias] = useState({})

  const { data: documentos = [] } = useQuery({
    queryKey: ['empresa-documentos', empresaId],
    queryFn:  () => empresasApi.getDocumentosEmpresa(empresaId),
    enabled:  !!empresaId,
  })

  const docPorTipo = (tipo) => documentos.find(d => d.tipo === tipo)

  const handleSubir = async (config, archivo) => {
    if (!archivo) return
    setSubiendo(p => ({ ...p, [config.tipo]: true }))
    try {
      await empresasApi.subirDocumentoEmpresa(
        empresaId,
        config.tipo,
        archivo,
        config.tieneVigencia ? (vigencias[config.tipo] ?? null) : null
      )
      qc.invalidateQueries({ queryKey: ['empresa-documentos', empresaId] })
      toast.success(`${config.label} actualizado correctamente`)
    } catch (err) {
      toast.error(err?.message ?? `Error al subir ${config.label}`)
    } finally {
      setSubiendo(p => ({ ...p, [config.tipo]: false }))
    }
  }

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-bold mb-4 pb-2"
        style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
        Documentación legal
      </p>
      <div className="flex flex-col gap-3">
        {DOCS_CONFIG.map(config => {
          const doc     = docPorTipo(config.tipo)
          const cargado = !!doc?.url
          const esSub   = subiendo[config.tipo]

          return (
            <div key={config.tipo} className="p-3 rounded-lg"
              style={{
                background: cargado ? '#f7fdf9' : '#f7f9fb',
                border: cargado ? '0.5px solid #b6e8cf' : '0.5px solid #e2e8f0',
              }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold" style={{ color: '#023859' }}>
                      {config.label}
                    </p>
                    {cargado && <CheckCircle size={11} style={{ color: '#1a7a4a' }} />}
                  </div>
                  {doc?.fechaVigencia && (
                    <p className="text-[10px] mt-0.5" style={{ color: '#6b7a8d' }}>
                      Vigencia: {new Date(doc.fechaVigencia).toLocaleDateString('es-CO')}
                    </p>
                  )}
                  {doc?.fechaCarga && (
                    <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                      Cargado: {new Date(doc.fechaCarga).toLocaleDateString('es-CO')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {cargado && (
                    <a href={doc.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold"
                      style={{ background: '#e6f0fb', color: '#0B416B' }}>
                      <ExternalLink size={10} /> Ver
                    </a>
                  )}
                  {!soloLectura && (
                    <button
                      onClick={() => refs.current[config.tipo]?.click()}
                      disabled={esSub}
                      className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold"
                      style={cargado
                        ? { background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }
                        : { background: '#D91438', color: '#fff' }}>
                      <Upload size={10} />
                      {esSub ? 'Subiendo...' : cargado ? 'Actualizar' : 'Cargar'}
                    </button>
                  )}
                </div>
              </div>

              {/* Fecha de vigencia opcional */}
              {!soloLectura && config.tieneVigencia && (
                <div className="mt-2">
                  <label className="text-[9px] font-bold uppercase tracking-wide"
                    style={{ color: '#8a9bb0' }}>
                    Fecha de vigencia (opcional)
                  </label>
                  <input
                    type="date"
                    value={vigencias[config.tipo] ?? ''}
                    onChange={e => setVigencias(v => ({ ...v, [config.tipo]: e.target.value }))}
                    className="w-full h-8 px-2 rounded text-xs outline-none mt-1"
                    style={{ border: '0.5px solid #e2e8f0', background: '#f7f9fb', color: '#023859' }}
                  />
                </div>
              )}

              <input
                ref={el => refs.current[config.tipo] = el}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={e => handleSubir(config, e.target.files?.[0])}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}