import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload, CheckCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { ROLES } from '@/lib/roles'
import { empresasApi } from '../api/empresasApi'
import BadgeEstadoEmpresa from '../components/BadgeEstadoEmpresa'
import AlertaCamara from '../components/AlertaCamara'

export default function DetalleEmpresaPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const qc       = useQueryClient()
  const { user } = useAuthStore()

  const puedeValidar = [ROLES.ADMINISTRADOR, ROLES.COORDINADOR_PRACTICA, ROLES.SECRETARIA].includes(user?.rol)
  const puedeSubirConvenio = puedeValidar
  const esEmpresa = user?.rol === ROLES.EMPRESA

  const { data: empresa, isLoading } = useQuery({
    queryKey: ['empresa', id],
    queryFn:  () => empresasApi.getEmpresaById(id),
  })

  const validarMutation = useMutation({
    mutationFn: (tipo) => empresasApi.validarDocumento(Number(id), tipo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empresa', id] })
      qc.invalidateQueries({ queryKey: ['empresas'] })
      toast.success('Documento validado correctamente')
    },
  })

  if (isLoading) return (
    <div className="bg-white rounded-xl p-8 animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="h-6 w-48 bg-gray-100 rounded mb-4" />
      <div className="h-4 w-full bg-gray-50 rounded mb-2" />
    </div>
  )
  if (!empresa) return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: '0.5px solid #e2e8f0' }}>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>Empresa no encontrada</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => navigate('/empresas/listado')}
        className="flex items-center gap-2 text-xs font-medium w-fit"
        style={{ color: '#0B416B' }}>
        <ArrowLeft size={14} /> Volver al listado
      </button>

      {/* Alerta cámara de comercio */}
      {empresa.alertaCamara && <AlertaCamara alerta={empresa.alertaCamara} />}

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex items-start justify-between"
        style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#e6f0fb' }}>
            <span className="text-lg font-bold" style={{ color: '#0B416B' }}>
              {empresa.razonSocial[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#023859' }}>{empresa.razonSocial}</h2>
            <p className="text-xs" style={{ color: '#8a9bb0' }}>NIT: {empresa.nit}</p>
            <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
              {empresa.municipio} · {empresa.sectorEconomico}
            </p>
          </div>
        </div>
        <BadgeEstadoEmpresa estado={empresa.estado} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Información general */}
        <SeccionCard titulo="Información general">
          <Fila label="Dirección"  valor={empresa.direccion} />
          <Fila label="Municipio"  valor={empresa.municipio} />
          <Fila label="Teléfono"   valor={empresa.telefono}  />
          <Fila label="Sector"     valor={empresa.sectorEconomico} />
        </SeccionCard>

        {/* Contacto */}
        <SeccionCard titulo="Contacto principal">
          <Fila label="Nombre"  valor={empresa.nombreContacto} />
          <Fila label="Correo"  valor={empresa.emailContacto}  />
          <Fila label="Acceso"  valor={empresa.correoAcceso}   />
        </SeccionCard>

        {/* Documentos */}
        <div className="bg-white rounded-xl p-5 col-span-2"
          style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-4 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Documentos requeridos
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Cámara de Comercio */}
            <DocCard
              titulo="Cámara de comercio"
              doc={empresa.camaraComercio}
              puedeValidar={puedeValidar}
              onValidar={() => validarMutation.mutate('camaraComercio')}
              extra={empresa.camaraComercio?.fechaVigencia &&
                `Vigencia: ${new Date(empresa.camaraComercio.fechaVigencia).toLocaleDateString('es-CO')}`
              }
            />
            {/* NIT */}
            <DocCard
              titulo="NIT"
              doc={empresa.nit_doc}
              puedeValidar={puedeValidar}
              onValidar={() => validarMutation.mutate('nit_doc')}
            />
            {/* Cédula Representante Legal */}
            <DocCard
              titulo="Cédula representante legal"
              doc={empresa.cedulaRL}
              puedeValidar={puedeValidar}
              onValidar={() => validarMutation.mutate('cedulaRL')}
            />
            {/* Convenio */}
            <DocCard
              titulo="Convenio con la universidad"
              doc={empresa.convenio}
              puedeValidar={puedeValidar && puedeSubirConvenio}
              onValidar={() => validarMutation.mutate('convenio')}
              extra={empresa.convenio?.fechaFin &&
                `Vence: ${new Date(empresa.convenio.fechaFin).toLocaleDateString('es-CO')}`
              }
              esConvenio
            />
          </div>
        </div>

      </div>
    </div>
  )
}

function DocCard({ titulo, doc, puedeValidar, onValidar, extra, esConvenio }) {
  const tiene   = !!doc?.url
  const validado = !!doc?.validado

  return (
    <div className="p-4 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
      <p className="text-xs font-semibold mb-3" style={{ color: '#023859' }}>{titulo}</p>

      {tiene ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={13} style={{ color: validado ? '#1a7a4a' : '#a07010' }} />
            <span className="text-[10px]" style={{ color: validado ? '#1a7a4a' : '#a07010' }}>
              {validado ? 'Documento validado' : 'Pendiente de validación'}
            </span>
          </div>
          {extra && (
            <p className="text-[10px]" style={{ color: '#8a9bb0' }}>{extra}</p>
          )}
          <a href={doc.url} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-medium"
            style={{ color: '#0B416B' }}>
            <ExternalLink size={11} /> Ver documento
          </a>
          {puedeValidar && !validado && (
            <button onClick={onValidar}
              className="h-7 px-3 rounded-lg text-[10px] font-semibold text-white w-fit"
              style={{ background: '#0B416B' }}>
              Marcar como validado
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-[10px]" style={{ color: '#c0392b' }}>
            {esConvenio ? 'Sin convenio cargado' : 'Documento no subido'}
          </p>
          <p className="text-[9px]" style={{ color: '#8a9bb0' }}>
            {esConvenio ? 'La coordinadora debe subir el convenio' : 'La empresa debe subir este documento'}
          </p>
        </div>
      )}
    </div>
  )
}

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
      <p className="text-[11px] font-medium" style={{ color: '#023859' }}>{valor}</p>
    </div>
  )
}