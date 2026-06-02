import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Edit, Upload, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { empresasApi } from '../api/empresasApi'
import BadgeEstadoEmpresa from '../components/BadgeEstadoEmpresa'
import AlertaCamara from '../components/AlertaCamara'

const schema = z.object({
  razonSocial:     z.string().min(3),
  nit:             z.string().min(5),
  sectorEconomico: z.string().min(1),
  direccion:       z.string().min(5),
  municipio:       z.string().min(3),
  telefono:        z.string().min(7),
  nombreContacto:  z.string().min(3),
  emailContacto:   z.string().email(),
})

const SECTORES = ['Tecnología','Finanzas','Turismo','Comercio','Manufactura','Salud','Educación','Construcción','Agropecuario','Servicios']

export default function MiPerfilEmpresaPage() {
  const qc       = useQueryClient()
  const [editando, setEditando] = useState(false)

  const { data: empresa, isLoading } = useQuery({
    queryKey: ['mi-empresa'],
    queryFn:  empresasApi.getMiEmpresa,
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    values: empresa,
  })

  const editarMutation = useMutation({
    mutationFn: (data) => empresasApi.editarEmpresa(empresa.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-empresa'] })
      toast.success('Perfil actualizado correctamente')
      setEditando(false)
    },
    onError: () => toast.error('Error al guardar'),
  })

  const subirDocMutation = useMutation({
    mutationFn: ({ tipo, data }) => empresasApi.subirDocumento(empresa.id, tipo, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mi-empresa'] })
      toast.success('Documento cargado correctamente')
    },
    onError: () => toast.error('Error al subir el documento'),
  })

  const simularSubida = (tipo, campo) => {
    // Simula subida de archivo — en producción usa Firebase Storage
    subirDocMutation.mutate({
      tipo,
      data: campo === 'camaraComercio'
        ? { fechaVigencia: '2025-08-30' }
        : {},
    })
  }

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-4" />
      <div className="h-4 w-full bg-gray-50 rounded mb-2" />
    </div>
  )

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  return (
    <div className="flex flex-col gap-4">

      {empresa?.alertaCamara && <AlertaCamara alerta={empresa.alertaCamara} />}

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex items-center justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: '#e6f0fb' }}>
            <span className="text-lg font-bold" style={{ color: '#0B416B' }}>
              {empresa?.razonSocial?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#023859' }}>{empresa?.razonSocial}</h2>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>NIT: {empresa?.nit}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BadgeEstadoEmpresa estado={empresa?.estado} />
          {!editando && (
            <button onClick={() => setEditando(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              <Edit size={13} /> Editar perfil
            </button>
          )}
        </div>
      </div>

      {!editando ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Información general
            </p>
            {[
              ['Sector',     empresa?.sectorEconomico],
              ['Dirección',  empresa?.direccion],
              ['Municipio',  empresa?.municipio],
              ['Teléfono',   empresa?.telefono],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5"
                style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{l}</p>
                <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{v}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
            <p className="text-xs font-bold mb-3 pb-2"
              style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
              Contacto principal
            </p>
            {[
              ['Nombre', empresa?.nombreContacto],
              ['Correo', empresa?.emailContacto],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5"
                style={{ borderBottom: '0.5px solid #f7f9fb' }}>
                <p className="text-[11px]" style={{ color: '#8a9bb0' }}>{l}</p>
                <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #e2e8f0' }}>
          <form onSubmit={handleSubmit(d => editarMutation.mutate(d))}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { name: 'razonSocial',     label: 'Razón social',    placeholder: '' },
                { name: 'nit',             label: 'NIT',              placeholder: '' },
                { name: 'direccion',       label: 'Dirección',        placeholder: '' },
                { name: 'municipio',       label: 'Municipio',        placeholder: '' },
                { name: 'telefono',        label: 'Teléfono',         placeholder: '' },
                { name: 'nombreContacto',  label: 'Nombre contacto',  placeholder: '' },
                { name: 'emailContacto',   label: 'Email contacto',   placeholder: '' },
              ].map(f => (
                <div key={f.name} className="flex flex-col gap-1.5">
                  <label className={lc} style={ls}>{f.label}</label>
                  <input {...register(f.name)} className={ic} style={is} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className={lc} style={ls}>Sector económico</label>
                <select {...register('sectorEconomico')} className={ic} style={is}>
                  {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { setEditando(false); reset() }}
                className="h-9 px-4 rounded-lg text-xs font-semibold"
                style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                Cancelar
              </button>
              <button type="submit" disabled={editarMutation.isPending}
                className="h-9 px-4 rounded-lg text-xs font-bold text-white"
                style={{ background: editarMutation.isPending ? '#a0aab4' : '#D91438' }}>
                {editarMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documentos — la empresa los sube */}
      <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
        <p className="text-xs font-bold mb-4 pb-2"
          style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
          Mis documentos
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'camaraComercio', label: 'Cámara de comercio', nota: 'Vigencia máx. 30 días' },
            { key: 'nit_doc',        label: 'NIT',                nota: 'Certificado RUT' },
            { key: 'cedulaRL',       label: 'Cédula Rep. Legal',  nota: 'Fotocopia' },
          ].map(doc => {
            const d = empresa?.[doc.key]
            return (
              <div key={doc.key} className="p-4 rounded-lg"
                style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#023859' }}>{doc.label}</p>
                <p className="text-[10px] mb-3" style={{ color: '#8a9bb0' }}>{doc.nota}</p>
                {d?.url ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} style={{ color: d.validado ? '#1a7a4a' : '#a07010' }} />
                    <span className="text-[10px]" style={{ color: d.validado ? '#1a7a4a' : '#a07010' }}>
                      {d.validado ? 'Validado' : 'En revisión'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => simularSubida(doc.key, doc.key)}
                    className="flex items-center gap-1 h-7 px-2 rounded-lg text-[10px] font-semibold"
                    style={{ background: '#e6f0fb', color: '#0B416B', border: '0.5px solid #b5d4f4' }}>
                    <Upload size={11} /> Subir documento
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Convenio — solo lectura para la empresa */}
        <div className="mt-3 p-4 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#023859' }}>
            Convenio con la universidad
          </p>
          <p className="text-[10px] mb-2" style={{ color: '#8a9bb0' }}>
            El convenio es cargado por la coordinación. Vigencia: 5 años.
          </p>
          {empresa?.convenio?.url ? (
            <div className="flex items-center gap-2">
              <CheckCircle size={12} style={{ color: empresa.convenio.validado ? '#1a7a4a' : '#a07010' }} />
              <span className="text-[10px]" style={{ color: '#6b7a8d' }}>
                Vence: {new Date(empresa.convenio.fechaFin).toLocaleDateString('es-CO')}
              </span>
            </div>
          ) : (
            <p className="text-[10px]" style={{ color: '#c0392b' }}>Sin convenio cargado</p>
          )}
        </div>
      </div>
    </div>
  )
}