import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X, Upload, Download, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { usuariosApi } from '../api/usuariosApi'

/**
 * Formato de columnas esperado en el Excel:
 * nombre | tipoDocumento | documento | correo | telefono |
 * contactoEmergencia | programa | semestre | numeroPractica |
 * creditosAprobados | promedioAcumulado
 */
const COLUMNAS_REQUERIDAS = [
  'nombre', 'tipoDocumento', 'documento', 'correo',
  'telefono', 'contactoEmergencia', 'programa',
  'semestre', 'numeroPractica', 'creditosAprobados', 'promedioAcumulado',
]

export default function ModalCargaMasiva({ onClose, onGuardado }) {
  const inputRef      = useRef(null)
  const [archivo, setArchivo]   = useState(null)
  const [filas, setFilas]       = useState([])
  const [erroresFormato, setErroresFormato] = useState([])
  const [resultado, setResultado] = useState(null) // { exitosos, errores }

  const mutation = useMutation({
    mutationFn: () => usuariosApi.cargaMasivaEstudiantes(filas),
    onSuccess: (data) => {
      setResultado(data)
      if (data.errores.length === 0) {
        toast.success(`${data.exitosos} estudiante(s) registrados correctamente`)
        onGuardado()
      }
    },
    onError: () => toast.error('Error en la carga masiva'),
  })

  const procesarArchivo = (file) => {
    setArchivo(file)
    setResultado(null)
    setErroresFormato([])

    const reader = new FileReader()
    reader.onload = (e) => {
      const wb    = XLSX.read(e.target.result, { type: 'binary' })
      const ws    = wb.Sheets[wb.SheetNames[0]]
      const data  = XLSX.utils.sheet_to_json(ws, { defval: '' })

      // Validar columnas
      if (data.length === 0) {
        setErroresFormato(['El archivo está vacío'])
        return
      }
      const columnasArchivo = Object.keys(data[0])
      const faltantes = COLUMNAS_REQUERIDAS.filter(c => !columnasArchivo.includes(c))
      if (faltantes.length > 0) {
        setErroresFormato([`Columnas faltantes: ${faltantes.join(', ')}`])
        return
      }
      setFilas(data)
    }
    reader.readAsBinaryString(file)
  }

  const descargarPlantilla = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      COLUMNAS_REQUERIDAS,
      ['Juan Pérez', 'CC', '1046512345', 'j.perez@uah.edu.co', '3001234567',
       'María Pérez - 3009876543', 'Ingeniería de Software', 8, 1, 148, 4.1],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes')
    XLSX.writeFile(wb, 'plantilla_estudiantes_uah.xlsx')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-lg p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold" style={{ color: '#023859' }}>
              Carga masiva de estudiantes
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8a9bb0' }}>
              Sube un archivo Excel con los datos de los estudiantes
            </p>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        {/* Descargar plantilla */}
        <button
          onClick={descargarPlantilla}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-xs font-semibold mb-4"
          style={{ background: '#f4f6f9', color: '#0B416B', border: '0.5px solid #e2e8f0' }}>
          <Download size={14} /> Descargar plantilla Excel
        </button>

        {/* Columnas requeridas */}
        <div className="mb-4 p-3 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: '#023859' }}>
            Columnas requeridas en el Excel
          </p>
          <div className="flex flex-wrap gap-1">
            {COLUMNAS_REQUERIDAS.map(c => (
              <span key={c} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: '#e6f0fb', color: '#0B416B' }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4"
          style={{ borderColor: archivo ? '#1a7a4a' : '#dce4ec', background: archivo ? '#f0faf5' : '#f7f9fb' }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            const f = e.dataTransfer.files[0]
            if (f) procesarArchivo(f)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={e => { if (e.target.files[0]) procesarArchivo(e.target.files[0]) }}
          />
          {archivo ? (
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet size={28} style={{ color: '#1a7a4a' }} />
              <p className="text-xs font-semibold" style={{ color: '#1a7a4a' }}>{archivo.name}</p>
              <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                {filas.length} fila(s) encontrada(s)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} style={{ color: '#8a9bb0' }} />
              <p className="text-xs" style={{ color: '#8a9bb0' }}>
                Arrastra el archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-[10px]" style={{ color: '#b0bec9' }}>.xlsx o .xls</p>
            </div>
          )}
        </div>

        {/* Errores de formato */}
        {erroresFormato.length > 0 && (
          <div className="mb-4 p-3 rounded-lg flex gap-2"
            style={{ background: '#fef0f0', border: '0.5px solid #f7c1c1' }}>
            <AlertCircle size={15} style={{ color: '#D91438', flexShrink: 0, marginTop: 1 }} />
            <div>
              {erroresFormato.map((e, i) => (
                <p key={i} className="text-xs" style={{ color: '#c0392b' }}>{e}</p>
              ))}
            </div>
          </div>
        )}

        {/* Resultado de carga */}
        {resultado && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} style={{ color: '#1a7a4a' }} />
              <p className="text-xs font-semibold" style={{ color: '#1a7a4a' }}>
                {resultado.exitosos} estudiante(s) registrados exitosamente
              </p>
            </div>
            {resultado.errores.length > 0 && (
              <div>
                <p className="text-[10px] font-bold mb-1" style={{ color: '#D91438' }}>
                  {resultado.errores.length} error(es):
                </p>
                {resultado.errores.map((e, i) => (
                  <p key={i} className="text-[10px]" style={{ color: '#c0392b' }}>
                    Fila {e.fila}: {e.motivo}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-semibold"
            style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
            Cancelar
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={filas.length === 0 || erroresFormato.length > 0 || mutation.isPending}
            className="h-9 px-4 rounded-lg text-xs font-bold text-white"
            style={{ background: filas.length === 0 || erroresFormato.length > 0 ? '#a0aab4' : '#D91438' }}>
            {mutation.isPending ? 'Procesando...' : `Cargar ${filas.length} estudiante(s)`}
          </button>
        </div>
      </div>
    </div>
  )
}