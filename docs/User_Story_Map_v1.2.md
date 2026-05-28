--- Page 1 ---
User Story Map – Plataforma de Gestión de Prácticas Empresariales
 Universidad Alexander Von Humboldt · Versión 1.2 · 4 Incrementos · 21 Historias de Usuario
 Leyenda:
[NUEVO] Historia nueva
[MODIFICADO] Historia modificada
[AJUSTADO] Historia ajustada
 Estado
 Incremento
 Objetivo
 Valor de Negocio
 Consideraciones
 Historia de Usuario 1
 Historia de Usuario 2
 Historia de Usuario 3
 Historia de Usuario 4
 Historia de Usuario 5
PRÓXIM
 O
SPRINT
 INCREMENTO 01
 Cimientos del
 Sistema
 Sprint 1
Establecer la infraestructura base
del sistema. Definir arquitectura,
modelo de datos, autenticación
por roles y catálogos maestros
para que todos los módulos
siguientes tengan fundamento
sólido.
Reduce riesgos de retrabajo.
Garantiza que el sistema se
construya sobre cimientos
seguros y escalables. Sin esta
base, los módulos de negocio
no pueden funcionar
correctamente.
 La arquitectura debe soportar 9 roles
con permisos diferenciados (frontend y
backend).  El modelo de datos es la
columna vertebral; errores aquí
impactan todo el proyecto.  La
bitácora de auditoría debe
implementarse desde el inicio.  Los
wireframes deben validarse con
usuarios antes del desarrollo.
PE-4 / PE-5
Diseñar el modelo de base de datos (entidades,
relaciones, atributos) y definir la arquitectura del
sistema como base técnica del proyecto.
PE-7 / PE-8 / PE-14
Como usuario, deseo iniciar sesión con correo y
contraseña para acceder solo a las funcionalidades de
mi rol, con restricción en backend y bitácora de
auditoría de acciones críticas.
PE-11 / PE-1
Como administrador, deseo gestionar usuarios (crear,
editar, activar, inactivar) y definir sus roles y permisos
para controlar el acceso al sistema.
PE-47 / PE-48 / PE-12 / PE-13
Como administrador, deseo configurar facultades,
programas y sus parámetros (número de prácticas,
número de cortes de seguimiento, nota mínima de
aprobación) para reflejar la estructura institucional.
PE-9 / PE-10
Como usuario, deseo ver un panel de inicio
personalizado con tarjetas de resumen y contadores
dinámicos según mi rol para gestionar mis tareas
pendientes eficientemente.
PRÓXIM
 O
SPRINT
 INCREMENTO 02
 Gestión de
Participantes y Oferta
 Sprint 2
Administrar participantes, catálogo
de prácticas y vacantes. Registrar
docentes, estudiantes con
validación de requisitos, gestionar
el catálogo de prácticas (número,
nombre, materia núcleo),
empresas vinculadas y sus
vacantes para tener la oferta lista
antes del proceso de asignación.
Centraliza la información clave.
Valida elegibilidad de
estudiantes, configura el
catálogo de prácticas como
plantilla base para la asignación
automática, amplía la oferta de
oportunidades y formaliza la
relación universidad-empresa
de forma sistemática.
 La importación masiva desde Excel
es clave para el inicio de cada periodo
académico.  El catálogo de prácticas
debe configurarse antes de marcar
estudiantes como Aptos; de lo
contrario el sistema no puede crear la
instancia automáticamente.  Al
marcar un estudiante como Apto, el
sistema crea automáticamente la
instancia de práctica en su expediente
desde el catálogo, con los datos
precargados (nombre, materia núcleo,
cortes, duración y documentos
requeridos).  El flujo de aprobación de
vacantes protege la calidad de las
ofertas disponibles.  Empresa inactiva
no aparece en selectores de nuevos
registros.
PE-17 / PE-20 / PE-19
Como coordinación académica, deseo registrar e
importar masivamente estudiantes desde Excel, con
filtros avanzados y búsqueda por texto para ubicarlos
rápidamente.
RF-02-06
[NUEVO]
Como coordinación académica, deseo gestionar el
catálogo de prácticas —número, nombre y materia
núcleo obligatoria— de forma independiente a los
estudiantes, para disponer de las plantillas base que el
sistema usará al crear automáticamente las instancias
de práctica al marcar aptitud.
RF-03-03 / PE-21
[MODIFICADO]
Como coordinación académica, deseo validar
requisitos y marcar estudiantes como Aptos o No
Aptos, y que el sistema cree automáticamente la
instancia de práctica correspondiente en el expediente
desde el catálogo, notificando el cambio de estado al
estudiante.
PE-15 / PE-18
Como coordinador, deseo gestionar el catálogo de
docentes asesores y el expediente histórico del
estudiante con todas sus prácticas anteriores.
PE-22 / PE-23 / PE-24 / PE-25 / PE-26 / PE-27
[AJUSTADO]
Como coordinador, deseo registrar empresas
vinculadas y sus tutores empresariales; como
empresa, deseo crear vacantes con perfil, requisitos y
cupos para que el coordinador las apruebe y estén
disponibles para el proceso de asignación.
PRÓXIM
 O
SPRINT
 INCREMENTO 03
 Proceso de Práctica
 Sprint 3
Asignación por coordinador,
vinculación y seguimiento.
Gestionar el flujo completo desde
la asignación del coordinador
hasta el acompañamiento activo
durante la ejecución de la práctica
empresarial.
Automatiza el flujo central del
negocio. Centraliza en el
coordinador la asignación de
estudiantes a vacantes, genera
trazabilidad documental
completa con notificaciones por
correo y previene deserción
mediante alertas de inactividad
y seguimiento estructurado.
 El coordinador es el único
responsable de asignar estudiantes a
vacantes; los estudiantes no se
postulan de forma autónoma.  Cada
asignación o cambio de estado genera
notificación automática por correo a
todos los actores (estudiante,
empresa, tutor empresarial, docente
asesor).  La confirmación 'En práctica'
es el hito que activa el seguimiento
formal.  Documentos de práctica
cerrada son inmutables (solo lectura).
 Las alertas de inactividad son
configurables por programa.
RF-05-01 / RF-05-02 / RF-05-03 / RF-05-04
[MODIFICADO]
Como coordinador de práctica, deseo asignar
estudiantes aptos a vacantes activas (seleccionando
candidatos, revisando perfiles y confirmando la
asignación), gestionar el listado de asignaciones y
cancelar con motivo obligatorio, con notificación
automática por correo a todos los actores y
trazabilidad completa de estados en tiempo real.
PE-29
[MODIFICADO]
Como coordinador, deseo que el sistema notifique
automáticamente por correo a todos los actores
involucrados ante cada cambio de estado de la
asignación (asignada, vinculada, cancelada), con
historial visible en el expediente y registro en la
bitácora de auditoría.
PE-32 / PE-33 / PE-34
Como coordinador, deseo generar cartas de
presentación, convenios de práctica y confirmar el
estado 'En práctica' para formalizar la vinculación del
estudiante.
PE-35 / PE-36
Como coordinador, deseo ver el tablero de
seguimiento con indicadores y alertas; como docente
asesor, registrar observaciones por corte para
acompañar al estudiante.
PE-37
Como estudiante, deseo registrar mi bitácora de
avances periódicamente para que el docente asesor
pueda consultarlas y comentarlas por corte de
evaluación.
PRÓXIM
 O
SPRINT
 INCREMENTO 04
 Evaluación y Cierre
 Sprint 4
Calificar, cerrar y reportar.
Registrar calificaciones, recopilar
encuestas de satisfacción con
notificaciones automáticas por
correo, ejecutar el cierre formal
con checklist de seguimiento
dinámico y proveer reportes
estratégicos a la dirección.
Habilita la mejora continua del
programa. Garantiza la
evaluación formal del
desempeño, automatiza el flujo
de encuestas con recordatorios,
habilita la certificación de
prácticas y provee indicadores
estratégicos para la toma de
decisiones institucionales.
 El docente asesor y el tutor
empresarial registran una única nota
final de referencia al concluir la
práctica; las calificaciones por corte
son gestionadas en el sistema
académico externo.  El cierre formal
es irreversible; el expediente queda
inmutable.  El sistema envía correos
de invitación y recordatorios
automáticos a tutor y estudiante para
las encuestas; el checklist muestra el
estado dinámico en tiempo real
(Pendiente / En borrador /
Completada) y permite recordatorios
manuales por actor.  Los reportes
respetan el scope del usuario que los
genera.
RF-08-01 / RF-08-02
[MODIFICADO]
Como docente asesor y tutor empresarial, deseo
registrar una única nota final de referencia al concluir
la práctica, para que el coordinador la consulte y
registre la nota final definitiva. Las calificaciones por
corte se gestionan en el sistema académico externo.
PE-41 / PE-42
[MODIFICADO]
Como tutor empresarial y estudiante, deseo recibir un
correo automático con enlace a la encuesta de
satisfacción y recordatorios periódicos mientras esté
pendiente, para retroalimentar el proceso y habilitar el
cierre formal.
PE-43
[MODIFICADO]
Como coordinador, deseo ejecutar el cierre formal
verificando el checklist con estado dinámico de
encuestas (indicador visual Pendiente / En borrador /
Completada y botón de recordatorio manual por actor),
para generar el acta de cierre y actualizar el
expediente del estudiante.
PE-45 / PE-46
Como dirección, deseo ver el dashboard de
indicadores consolidados y el reporte de empresas
vinculadas con encuestas de satisfacción para tomar
decisiones estratégicas.
PE-6 / RF-11-01 / RF-11-05
[MODIFICADO]
Como administrador, deseo configurar plantillas de
correo con variables dinámicas y reglas de
recordatorio automático por evento (asignación,
cambio de estado, encuestas pendientes) y gestionar
catálogos maestros para personalizar el sistema por
facultad y programa.
