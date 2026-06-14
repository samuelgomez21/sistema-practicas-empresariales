import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Eye, Download, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { coordEmpresarialApi } from '../api/coordEmpresarialApi'

const TIPOS_CONTRATO   = ['Contrato de aprendizaje', 'Contrato universitario', 'Otro']
const TIPOS_REMUNERACION = ['Auxilio de práctica', 'Salario mínimo', 'Sin remuneración']

export default function ContratosPage() {
  const qc = useQueryClient()
  const [empresaId,    setEmpresaId]    = useState('')
  const [estudianteId, setEstudianteId] = useState('')
  const [form, setForm] = useState({
    fechaInicio: '', fechaFin: '', tipoContrato: 'Contrato de aprendizaje',
    tipoRemuneracion: 'Auxilio de práctica', valorMensual: '',
  })

  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ['empresas-seleccionados'],
    queryFn:  coordEmpresarialApi.getEmpresasConSeleccionados,
  })

  const { data: contratos = [], isLoading } = useQuery({
    queryKey: ['contratos'],
    queryFn:  coordEmpresarialApi.getContratos,
  })

  const empresa    = empresas.find(e => String(e.empresaId) === empresaId)
  const estudiante = empresa?.seleccionados.find(s => String(s.estudianteId) === estudianteId)


  const mutation = useMutation({
    mutationFn: () => coordEmpresarialApi.generarContrato({
      practicaId: Number(estudiante.practicaId),
      estudianteId:     estudiante.estudianteId,
      estudianteNombre: estudiante.nombre,
      empresaNombre:    empresa.razonSocial,
      empresaId:   Number(empresaId),
      tipoContrato:     form.tipoContrato,
      fechaInicio:      form.fechaInicio,
      fechaFin:         form.fechaFin,
      valorMensual:     Number(form.valorMensual),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contratos'] })
      qc.invalidateQueries({ queryKey: ['empresas-seleccionados'] })
      toast.success('Contrato generado correctamente')
      setEmpresaId(''); setEstudianteId('')
      setForm({ fechaInicio: '', fechaFin: '', tipoContrato: 'Contrato de aprendizaje', tipoRemuneracion: 'Auxilio de práctica', valorMensual: '' })
    },
    onError: () => toast.error('Error al generar el contrato'),
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }
  const ro = { ...is, background: '#f0f2f5', color: '#6b7a8d' }

  const puedeGenerar = empresaId && estudianteId && form.fechaInicio && form.fechaFin
    && form.tipoContrato && form.valorMensual

  return (
    <div className="flex flex-col gap-4">

      <div className="bg-white rounded-xl px-5 py-4" style={{ border: '0.5px solid #e2e8f0' }}>
        <h2 className="text-base font-bold" style={{ color: '#023859' }}>
          Generación de contratos
        </h2>
        <p className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
          Genera contratos empresa-estudiante con datos precargados del sistema
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Formulario */}
        <div className="col-span-2 bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>

          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#8a9bb0' }}>
            Paso 1 — Seleccionar empresa
          </p>

          {/* ── Nuevo: aviso cuando no hay seleccionados pendientes ── */}
          {!loadingEmpresas && empresas.length === 0 ? (
            <div className="p-4 rounded-lg text-xs"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0', color: '#8a9bb0' }}>
              No hay estudiantes seleccionados pendientes de contrato.
              Un estudiante aparece aquí cuando una empresa lo marca como
              <strong style={{ color: '#023859' }}> Seleccionado</strong> y aún no tiene empresa
              asignada en su práctica.
            </div>
          ) : (
            <>
              <select value={empresaId}
                onChange={e => { setEmpresaId(e.target.value); setEstudianteId('') }}
                className={ic} style={is}>
                <option value="">Seleccionar empresa con estudiante seleccionado...</option>
                {empresas.map(e => (
                  <option key={e.empresaId} value={e.empresaId}>
                    {e.razonSocial} ({e.seleccionados.length} seleccionado(s))
                  </option>
                ))}
              </select>

              {empresa && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className={lc} style={ls}>NIT</label>
                    <input value={empresa.nit ?? '—'} disabled className={ic} style={ro} />
                  </div>
                  <div>
                    <label className={lc} style={ls}>Nombre de contacto</label>
                    <input value={empresa.nombreContacto ?? '—'} disabled className={ic} style={ro} />
                  </div>
                  <div>
                    <label className={lc} style={ls}>Cédula contacto</label>
                    <input value={empresa.cedulaContacto ?? '—'} disabled className={ic} style={ro} />
                  </div>
                  <div>
                    <label className={lc} style={ls}>Ciudad</label>
                    <input value={empresa.municipio ?? '—'} disabled className={ic} style={ro} />
                  </div>
                </div>
              )}

              {empresa && (
                <div className="mt-5 pt-5" style={{ borderTop: '0.5px solid #f0f2f5' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#8a9bb0' }}>
                    Paso 2 — Seleccionar estudiante
                  </p>
                  <select value={estudianteId} onChange={e => setEstudianteId(e.target.value)}
                    className={ic} style={is}>
                    <option value="">Seleccionar estudiante seleccionado...</option>
                    {empresa.seleccionados.map(s => (
                      <option key={s.estudianteId} value={s.estudianteId}>
                        {s.nombre} — {s.programa} (Sem. {s.semestre})
                      </option>
                    ))}
                  </select>

                  {estudiante && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className={lc} style={ls}>Programa</label>
                        <input value={estudiante.programa} disabled className={ic} style={ro} />
                      </div>
                      <div>
                        <label className={lc} style={ls}>Semestre</label>
                        <input value={`Semestre ${estudiante.semestre}`} disabled className={ic} style={ro} />
                      </div>
                      <div>
                        <label className={lc} style={ls}>Correo</label>
                        <input value={estudiante.correo} disabled className={ic} style={ro} />
                      </div>
                      <div>
                        <label className={lc} style={ls}>Número de práctica</label>
                        <input value={`#${estudiante.numeroPractica}`} disabled className={ic} style={ro} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {estudiante && (
                <div className="mt-5 pt-5" style={{ borderTop: '0.5px solid #f0f2f5' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#8a9bb0' }}>
                    Paso 3 — Datos del contrato
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lc} style={ls}>Fecha de inicio</label>
                      <input type="date" value={form.fechaInicio}
                        onChange={e => setForm(f => ({ ...f, fechaInicio: e.target.value }))}
                        className={ic} style={is} />
                    </div>
                    <div>
                      <label className={lc} style={ls}>Fecha de finalización</label>
                      <input type="date" value={form.fechaFin}
                        onChange={e => setForm(f => ({ ...f, fechaFin: e.target.value }))}
                        className={ic} style={is} />
                    </div>
                    <div>
                      <label className={lc} style={ls}>Tipo de contrato</label>
                      <select value={form.tipoContrato}
                        onChange={e => setForm(f => ({ ...f, tipoContrato: e.target.value }))}
                        className={ic} style={is}>
                        {TIPOS_CONTRATO.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lc} style={ls}>Tipo de remuneración</label>
                      <select value={form.tipoRemuneracion}
                        onChange={e => setForm(f => ({ ...f, tipoRemuneracion: e.target.value }))}
                        className={ic} style={is}>
                        {TIPOS_REMUNERACION.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className={lc} style={ls}>Valor mensual (COP)</label>
                      <input type="number"
                        placeholder={`Ej: ${estudiante.salarioVacante ?? 1300000}`}
                        value={form.valorMensual}
                        onChange={e => setForm(f => ({ ...f, valorMensual: e.target.value }))}
                        className={ic} style={is} />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => mutation.mutate()}
                disabled={!puedeGenerar || mutation.isPending}
                className="w-full h-10 rounded-lg text-sm font-bold text-white mt-5 transition-all"
                style={{ background: !puedeGenerar || mutation.isPending ? '#a0aab4' : '#D91438' }}>
                {mutation.isPending ? 'Generando contrato...' : 'Generar contrato'}
              </button>
            </>
          )}
        </div>

        {/* Contratos generados */}
        <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #e2e8f0' }}>
          <p className="text-xs font-bold mb-3 pb-2"
            style={{ color: '#023859', borderBottom: '0.5px solid #f0f2f5' }}>
            Contratos generados
          </p>
          {isLoading ? (
            <div className="h-20 bg-gray-50 rounded animate-pulse" />
          ) : contratos.length === 0 ? (
            <p className="text-xs" style={{ color: '#8a9bb0' }}>Aún no se han generado contratos</p>
          ) : (
            <div className="flex flex-col gap-3">
              {contratos.map(c => (
                <div key={c.id} className="p-3 rounded-lg"
                  style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold" style={{ color: '#023859' }}>{c.estudianteNombre}</p>
                    <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#eaf7f0', color: '#1a7a4a' }}>
                      <CheckCircle size={9} /> {c.estado === 'FIRMADO' ? 'Firmado' : 'Generado'}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: '#0B416B' }}>{c.empresaNombre}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>{c.tipoContrato}</p>
                  <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                    {new Date(c.fechaInicio).toLocaleDateString('es-CO')} → {new Date(c.fechaFin).toLocaleDateString('es-CO')}
                  </p>
                  <p className="text-[10px] font-semibold" style={{ color: '#1a7a4a' }}>
                    ${Number(c.valorMensual).toLocaleString('es-CO')}/mes
                  </p>
                  {c.pdfUrl && (
                    <div className="flex gap-2 mt-2">
                      <a href={c.pdfUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold flex-1 justify-center"
                        style={{ background: '#e6f0fb', color: '#0B416B' }}>
                        <Eye size={11} /> Ver
                      </a>
                      <a href={c.pdfUrl} download
                        className="flex items-center gap-1 h-7 px-2 rounded text-[10px] font-semibold flex-1 justify-center"
                        style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
                        <Download size={11} /> PDF
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 p-3 rounded-lg text-[10px] leading-relaxed"
            style={{ background: '#e6f0fb', color: '#0B416B' }}>
            Los contratos generados requieren la firma de:
            <ul className="list-disc pl-4 mt-1">
              <li>Representante legal de la empresa</li>
              <li>Estudiante practicante</li>
              <li>Coordinadora empresarial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}