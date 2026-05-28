import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { usuariosApi } from '../api/usuariosApi'

const ROLES_DISPONIBLES = [
  { value: 'COORDINACION_ACADEMICA', label: 'Coordinación Académica' },
  { value: 'COORDINADOR_PRACTICA',   label: 'Coordinador de Práctica' },
  { value: 'SECRETARIA',             label: 'Secretaria' },
  { value: 'DIRECCION',              label: 'Dirección' },
]

const PROGRAMAS_DISPONIBLES = [
  'Ingeniería de Software',
  'Ingeniería Industrial',
  'Administración de Empresas',
  'Turismo',
]

const schema = z.object({
  nombre:  z.string().min(3, 'Mínimo 3 caracteres'),
  correo:  z.string().email('Correo inválido'),
  rol:     z.string().min(1, 'Selecciona un rol'),
})

export default function ModalCoordinador({ coordinador, onClose, onGuardado }) {
  const esEdicion = !!coordinador
  const [programasSeleccionados, setProgramas] = useState(coordinador?.programas ?? [])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: coordinador ?? {},
  })

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, programas: programasSeleccionados }
      return esEdicion
        ? usuariosApi.editarCoordinador(coordinador.id, payload)
        : usuariosApi.crearCoordinador(payload)
    },
    onSuccess: () => {
      toast.success(esEdicion ? 'Usuario actualizado' : 'Usuario creado — se envió contraseña temporal al correo')
      onGuardado()
    },
    onError: () => toast.error('Error al guardar'),
  })

  const togglePrograma = (p) =>
    setProgramas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide"
  const ls = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {esEdicion ? 'Editar usuario' : 'Nuevo coordinador / staff'}
          </p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        {!esEdicion && (
          <div className="mb-4 p-3 rounded-lg text-xs"
            style={{ background: '#e6f0fb', color: '#0B416B', border: '0.5px solid #b5d4f4' }}>
            Se generará una contraseña temporal y se enviará al correo ingresado.
          </div>
        )}

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Nombre completo</label>
            <input {...register('nombre')} className={ic} style={is} placeholder="Nombre completo" />
            {errors.nombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.nombre.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Correo electrónico</label>
            <input {...register('correo')} className={ic} style={is} placeholder="correo@uah.edu.co" />
            {errors.correo && <p className="text-xs" style={{ color: '#D91438' }}>{errors.correo.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={lc} style={ls}>Rol</label>
            <select {...register('rol')} className={ic} style={is}>
              <option value="">Seleccionar rol...</option>
              {ROLES_DISPONIBLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.rol && <p className="text-xs" style={{ color: '#D91438' }}>{errors.rol.message}</p>}
          </div>

          {/* Programas asignados */}
          <div className="flex flex-col gap-2">
            <label className={lc} style={ls}>Programas asignados</label>
            <div className="flex flex-wrap gap-2">
              {PROGRAMAS_DISPONIBLES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePrograma(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={programasSeleccionados.includes(p)
                    ? { background: '#0B416B', color: '#fff', border: '0.5px solid #0B416B' }
                    : { background: '#f4f6f9', color: '#6b7a8d', border: '0.5px solid #e2e8f0' }
                  }>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// necesita useState
