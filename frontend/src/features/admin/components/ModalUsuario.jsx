import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { rolesApi, etiquetaRol } from '../api/rolesApi'
import { usuariosApi } from '../api/usuariosApi'
import { estudiantesApi } from '@/features/usuarios/api/estudiantesApi'
import { programasApi } from '@/features/configuracion/api/programasApi'

const ROLES_CON_PROGRAMAS = ['COORDINADOR_ACADEMICO', 'COORDINADOR_PRACTICA', 'SECRETARIA_COORDINACION']

const TIPOS_IDENTIFICACION = [
  { value: 'cedula', label: 'Cédula de ciudadanía' },
  { value: 'tarjeta_identidad', label: 'Tarjeta de identidad' },
  { value: 'cedula_extranjeria', label: 'Cédula de extranjería' },
  { value: 'pasaporte', label: 'Pasaporte' },
]

const schema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email:  z.string().email('Correo inválido'),
  rol:    z.string().min(1, 'Selecciona un rol'),
  activo: z.boolean().optional(),
  programaIds: z.array(z.number()).optional(),

  // ── Campos exclusivos de ESTUDIANTE ──────────────────────────
  identificacion: z.string().optional(),
  tipoIdentificacion: z.string().optional(),
  telefono: z.string().optional(),
  contactoEmergencia: z.string().optional(),
  programaId: z.union([z.string(), z.number()]).optional(),
  semestre: z.union([z.string(), z.number()]).optional(),
  creditosAprobados: z.union([z.string(), z.number()]).optional(),
  promedioAcumulado: z.union([z.string(), z.number()]).optional(),
}).superRefine((data, ctx) => {
  if (data.rol !== 'ESTUDIANTE') return

  const requeridos = {
    identificacion: 'La identificación es obligatoria',
    tipoIdentificacion: 'Selecciona el tipo de identificación',
    programaId: 'Selecciona un programa',
    semestre: 'El semestre es obligatorio',
    creditosAprobados: 'Los créditos aprobados son obligatorios',
    promedioAcumulado: 'El promedio acumulado es obligatorio',
  }

  Object.entries(requeridos).forEach(([campo, mensaje]) => {
    const valor = data[campo]
    if (valor === undefined || valor === null || valor === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: mensaje, path: [campo] })
    }
  })
})

export default function ModalUsuario({ usuario, onClose, onGuardado }) {
  const esEdicion = !!usuario

  const { data: roles = [], isLoading: cargandoRoles } = useQuery({
    queryKey: ['roles-disponibles'],
    queryFn:  rolesApi.getRoles,
  })

  const { data: programasTodos = [] } = useQuery({
    queryKey: ['programas-todos'],
    queryFn:  programasApi.getProgramas,
  })

  const { data: programasAsignados = [] } = useQuery({
    queryKey: ['programas-coordinador', usuario?.id],
    queryFn:  () => usuariosApi.getProgramasDeCoordinador(usuario.id),
    enabled:  esEdicion && ROLES_CON_PROGRAMAS.includes(usuario?.rol),
  })

  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: usuario
      ? { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, activo: usuario.activo, programaIds: [] }
      : { nombre: '', email: '', rol: '', programaIds: [], tipoIdentificacion: '', programaId: '' },
  })

  const rolSeleccionado = watch('rol')
  const mostrarProgramas  = ROLES_CON_PROGRAMAS.includes(rolSeleccionado)
  // Los campos de estudiante solo se muestran al CREAR (no al editar,
  // ya que la edición de datos académicos se hace desde Estudiantes)
  const mostrarEstudiante = !esEdicion && rolSeleccionado === 'ESTUDIANTE'

  useEffect(() => {
    if (esEdicion && programasAsignados.length > 0) {
      setValue('programaIds', programasAsignados.map(p => p.id))
    }
  }, [programasAsignados, esEdicion, setValue])

  const mutation = useMutation({
    mutationFn: async (data) => {

      // ── Caso 1: crear ESTUDIANTE → crea Usuario + Estudiante ────
      if (!esEdicion && data.rol === 'ESTUDIANTE') {
        return estudiantesApi.crearEstudiante({
          identificacion:     data.identificacion,
          tipoIdentificacion: data.tipoIdentificacion,
          nombre:             data.nombre,
          email:              data.email,
          telefono:           data.telefono,
          contactoEmergencia: data.contactoEmergencia,
          programaId:         Number(data.programaId),
          semestre:           Number(data.semestre),
          creditosAprobados:  Number(data.creditosAprobados),
          promedioAcumulado:  Number(data.promedioAcumulado),
        })
      }

      // ── Caso 2: cualquier otro rol (admin, docente, coordinación, etc.) ──
      const { programaIds, ...usuarioData } = data
      // Limpia campos de estudiante que no aplican a /usuarios
      delete usuarioData.identificacion
      delete usuarioData.tipoIdentificacion
      delete usuarioData.telefono
      delete usuarioData.contactoEmergencia
      delete usuarioData.programaId
      delete usuarioData.semestre
      delete usuarioData.creditosAprobados
      delete usuarioData.promedioAcumulado

      const res = esEdicion
        ? await usuariosApi.actualizarUsuario(usuario.id, usuarioData)
        : await usuariosApi.crearUsuario(usuarioData)

      if (mostrarProgramas && programaIds?.length) {
        const targetId = esEdicion ? usuario.id : res.id
        await usuariosApi.asignarProgramas(targetId, programaIds)
      }
      return res
    },
    onSuccess: () => {
      toast.success(esEdicion ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente')
      onGuardado()
    },
    onError: (err) => {
      const msg = err?.response?.data?.message ?? 'Error al guardar el usuario'
      toast.error(msg)
    },
  })

  const is = { border: '1.5px solid #dce4ec', background: '#f7f9fb', color: '#023859' }
  const ic = "w-full h-10 px-3 rounded-lg text-sm outline-none"
  const lc = "text-[10px] font-bold uppercase tracking-wide mb-1.5 block"
  const ls = { color: '#023859' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,56,89,0.4)' }}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        style={{ border: '0.5px solid #e2e8f0' }}>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: '#023859' }}>
            {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
          </p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="flex flex-col gap-3">

          <div>
            <label className={lc} style={ls}>Nombre completo</label>
            <input {...register('nombre')} className={ic} style={is} placeholder="Ej: Dr. Juan Pérez" />
            {errors.nombre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.nombre.message}</p>}
          </div>

          <div>
            <label className={lc} style={ls}>Correo institucional</label>
            <input {...register('email')} type="email" className={ic} style={is}
              placeholder="usuario@universidad.edu.co" />
            {errors.email && <p className="text-xs" style={{ color: '#D91438' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={lc} style={ls}>Rol</label>
            <select {...register('rol')} className={ic} style={is} disabled={cargandoRoles || esEdicion}>
              <option value="">
                {cargandoRoles ? 'Cargando roles...' : 'Seleccionar rol...'}
              </option>
              {roles.map(r => (
                <option key={r.id} value={r.nombre}>{etiquetaRol(r.nombre)}</option>
              ))}
            </select>
            {errors.rol && <p className="text-xs" style={{ color: '#D91438' }}>{errors.rol.message}</p>}
            {esEdicion && (
              <p className="text-[10px] mt-1" style={{ color: '#8a9bb0' }}>
                El rol no puede modificarse después de creado el usuario.
              </p>
            )}
          </div>

          {/* ── Programas — coordinadores/secretaría ──────────────── */}
          {mostrarProgramas && (
            <div>
              <label className={lc} style={ls}>Programas asignados</label>
              <p className="text-[10px] mb-2" style={{ color: '#8a9bb0' }}>
                Selecciona los programas que este usuario podrá gestionar
              </p>
              <Controller
                name="programaIds"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 p-2 rounded-lg max-h-40 overflow-y-auto"
                    style={{ border: '1.5px solid #dce4ec', background: '#f7f9fb' }}>
                    {programasTodos.map(p => {
                      const checked = field.value?.includes(p.id)
                      return (
                        <label key={p.id} className="flex items-center gap-2 text-xs px-1 py-1 rounded cursor-pointer hover:bg-white"
                          style={{ color: '#023859' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const actual = field.value ?? []
                              field.onChange(
                                checked
                                  ? actual.filter(id => id !== p.id)
                                  : [...actual, p.id]
                              )
                            }}
                          />
                          {p.nombre}
                        </label>
                      )
                    })}
                    {programasTodos.length === 0 && (
                      <p className="text-[10px] p-1" style={{ color: '#8a9bb0' }}>
                        No hay programas registrados
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {/* ── Campos exclusivos de ESTUDIANTE (solo al crear) ───── */}
          {mostrarEstudiante && (
            <div className="flex flex-col gap-3 p-3 rounded-lg"
              style={{ background: '#f7f9fb', border: '0.5px solid #e2e8f0' }}>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#0B416B' }}>
                Información académica
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lc} style={ls}>Tipo de identificación</label>
                  <select {...register('tipoIdentificacion')} className={ic} style={is}>
                    <option value="">Seleccionar...</option>
                    {TIPOS_IDENTIFICACION.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.tipoIdentificacion && <p className="text-xs" style={{ color: '#D91438' }}>{errors.tipoIdentificacion.message}</p>}
                </div>
                <div>
                  <label className={lc} style={ls}>Identificación</label>
                  <input {...register('identificacion')} className={ic} style={is} placeholder="Ej: 1046527082" />
                  {errors.identificacion && <p className="text-xs" style={{ color: '#D91438' }}>{errors.identificacion.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lc} style={ls}>Teléfono</label>
                  <input {...register('telefono')} className={ic} style={is} placeholder="3001234567" />
                </div>
                <div>
                  <label className={lc} style={ls}>Contacto de emergencia</label>
                  <input {...register('contactoEmergencia')} className={ic} style={is} placeholder="Nombre - teléfono" />
                </div>
              </div>

              <div>
                <label className={lc} style={ls}>Programa académico</label>
                <select {...register('programaId')} className={ic} style={is}>
                  <option value="">Seleccionar programa...</option>
                  {programasTodos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
                {errors.programaId && <p className="text-xs" style={{ color: '#D91438' }}>{errors.programaId.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={lc} style={ls}>Semestre</label>
                  <input {...register('semestre')} type="number" min="1" max="12" className={ic} style={is} />
                  {errors.semestre && <p className="text-xs" style={{ color: '#D91438' }}>{errors.semestre.message}</p>}
                </div>
                <div>
                  <label className={lc} style={ls}>Créditos aprobados</label>
                  <input {...register('creditosAprobados')} type="number" min="0" className={ic} style={is} />
                  {errors.creditosAprobados && <p className="text-xs" style={{ color: '#D91438' }}>{errors.creditosAprobados.message}</p>}
                </div>
                <div>
                  <label className={lc} style={ls}>Promedio</label>
                  <input {...register('promedioAcumulado')} type="number" step="0.01" min="0" max="5" className={ic} style={is} />
                  {errors.promedioAcumulado && <p className="text-xs" style={{ color: '#D91438' }}>{errors.promedioAcumulado.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Aviso si se edita un usuario con rol ESTUDIANTE */}
          {esEdicion && usuario.rol === 'ESTUDIANTE' && (
            <div className="p-2.5 rounded-lg text-[10px]"
              style={{ background: '#fff8e6', color: '#a07010' }}>
              Para editar datos académicos (programa, semestre, créditos, etc.)
              usa la sección "Estudiantes".
            </div>
          )}

          {!esEdicion && (
            <div className="p-2.5 rounded-lg text-[10px]"
              style={{ background: '#e6f0fb', color: '#0B416B' }}>
              El usuario recibirá una contraseña temporal y deberá cambiarla en su primer inicio de sesión.
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="h-9 px-4 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f6f9', color: '#023859', border: '0.5px solid #e2e8f0' }}>
              Cancelar
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="h-9 px-4 rounded-lg text-xs font-bold text-white"
              style={{ background: mutation.isPending ? '#a0aab4' : '#D91438' }}>
              {mutation.isPending ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}