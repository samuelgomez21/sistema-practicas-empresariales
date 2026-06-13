import { useState } from 'react'
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'

export default function ModalCargaMasiva({ onClose, onSubir, cargando }) {
  const [archivo, setArchivo] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setArchivo(file)
  }

  const handleSubmit = () => {
    if (!archivo) return
    onSubir(archivo)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            Carga masiva de estudiantes
          </p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">

          {/* Instrucciones */}
          <div className="p-3 rounded-lg text-[11px] leading-relaxed"
            style={{ background: '#e6f0fb', color: '#0B416B' }}>
            El archivo Excel debe tener las columnas en este orden (sin encabezado obligatorio en la primera fila):
            <strong> Nombre, Email, Tipo de Identificación, Identificación, Teléfono, Contacto de Emergencia,
            Programa ID, Semestre, Créditos Aprobados, Promedio Acumulado.</strong>
          </div>

          {/* Selector de archivo */}
          <label
            className="flex flex-col items-center gap-2 p-6 rounded-lg cursor-pointer transition-all"
            style={{
              border: archivo ? '1.5px solid #1a7a4a' : '1.5px dashed #b5d4f4',
              background: archivo ? '#eaf7f0' : '#f7fbff',
            }}>
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
            {archivo ? (
              <>
                <CheckCircle size={28} style={{ color: '#1a7a4a' }} />
                <p className="text-xs font-semibold" style={{ color: '#1a7a4a' }}>{archivo.name}</p>
                <p className="text-[10px]" style={{ color: '#1a7a4a' }}>
                  {(archivo.size / 1024).toFixed(1)} KB — Click para cambiar
                </p>
              </>
            ) : (
              <>
                <FileSpreadsheet size={28} style={{ color: '#0B416B' }} />
                <p className="text-xs font-semibold" style={{ color: '#0B416B' }}>
                  Selecciona un archivo Excel
                </p>
                <p className="text-[10px]" style={{ color: '#8a9bb0' }}>
                  Formatos soportados: .xlsx, .xls
                </p>
              </>
            )}
          </label>

          {/* Nota sobre filas con error */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg"
            style={{ background: '#fff8e6', border: '0.5px solid #f0d080' }}>
            <AlertCircle size={13} style={{ color: '#a07010', flexShrink: 0, marginTop: 1 }} />
            <p className="text-[10px]" style={{ color: '#a07010' }}>
              Las filas con errores (documentos duplicados o datos inválidos)
              se omitirán automáticamente sin detener la carga del resto.
            </p>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!archivo || cargando}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: !archivo || cargando ? '#a0aab4' : '#D91438' }}>
              <Upload size={13} />
              {cargando ? 'Procesando...' : 'Cargar estudiantes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}