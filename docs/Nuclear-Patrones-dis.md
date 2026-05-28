



Análisis y aplicación de patrones de diseño en la Plataforma de Gestión de Prácticas Empresariales


Proyecto nuclear


Samuel Gómez Jaramillo
Samuel Giraldo


Universidad Alexander Von Humboldt
Programa de Ingeniería de Software
Análisis y diseño de sistemas
Docente: Diana M. Valencia


2026

Introducción
El presente trabajo desarrolla un análisis de los patrones de diseño estudiados durante el curso y su aplicación dentro del proyecto nuclear de gestión de prácticas empresariales. El propósito no es listar patrones de forma aislada, sino determinar cuáles se necesitan realmente en el diseño del backend, justificar su elección y mostrar cómo podrían implementarse mediante diagramas UML claros y coherentes con los requisitos actuales del sistema.
El proyecto consiste en una plataforma para administrar el ciclo de vida de las prácticas empresariales de la universidad. Su alcance actual incluye administración de usuarios y roles, configuración académica por facultades y programas, gestión de estudiantes, empresas vinculadas, vacantes, asignaciones, vinculación documental, seguimiento, calificaciones, encuestas, cierre formal, reportes, indicadores, alertas, notificaciones y bitácora de auditoría. En el flujo actualizado, el estudiante no realiza postulaciones autónomas; el Coordinador de Práctica asigna estudiantes aptos a vacantes activas, después de que la Coordinación Académica valida sus requisitos.
La selección de patrones se realiza con criterio de ingeniería de software. En un proyecto con tiempo limitado no es conveniente implementar patrones de diseño por obligación, porque esto puede producir sobreingeniería. Por esta razón, se integran nueve patrones que resuelven problemas concretos del sistema y que pueden reflejarse de manera real en la implementación del backend: Singleton, Facade, Chain of Responsibility, State, Observer, Strategy, Factory Method, Adapter y Builder.
Contexto del sistema y alcance de diseño
La plataforma debe operar con varios roles. Entre ellos se encuentran Administrador, Dirección, Coordinación Académica, Coordinador de Práctica, Secretaria, Docente Asesor, Empresa Vinculada, Tutor Empresarial y Estudiante. Cada rol tiene un alcance específico de acceso, conocido como scope, que puede ser global, por facultad, por programa, por empresa o por estudiantes asignados.
El flujo principal inicia cuando la Coordinación Académica registra estudiantes y valida sus requisitos. Si el estudiante cumple las condiciones configuradas para su programa y número de práctica, queda en estado Apto y el sistema crea una instancia de práctica desde el catálogo académico. Luego la empresa crea una vacante, el Coordinador de Práctica la aprueba, y posteriormente asigna un estudiante apto a esa vacante activa. Después se cargan documentos de vinculación, se confirma el convenio, se activa la práctica, se realiza seguimiento, se registran calificaciones y encuestas, y finalmente se ejecuta el cierre formal.
Este flujo evidencia varios problemas técnicos. Existen procesos complejos que involucran varios servicios al mismo tiempo, validaciones secuenciales antes de cerrar una práctica, entidades con ciclos de vida definidos, eventos que deben producir notificaciones, reglas configurables por programa y objetos complejos que deben construirse para reportes, correos o actas. Estos problemas justifican la aplicación de patrones de diseño concretos y no redundantes.
Criterios para seleccionar los patrones de diseño
La selección de patrones se realizó a partir de cuatro criterios. El primer criterio fue la aplicabilidad real al dominio del proyecto. Un patrón solo se considera necesario si resuelve una necesidad concreta del sistema. El segundo criterio fue la viabilidad de implementación en el plazo disponible. El tercer criterio fue la relación con principios SOLID, especialmente la separación de responsabilidades, el bajo acoplamiento y la extensibilidad. El cuarto criterio fue la claridad para el equipo de desarrollo y para la sustentación, porque un patrón debe poder explicarse y reflejarse en código.
Con base en estos criterios, se integran nueve patrones de diseño en el proyecto: Singleton, Facade, Chain of Responsibility, State, Observer, Strategy, Factory Method, Adapter y Builder. Los nueve se consideran aplicables porque cada uno atiende un problema diferente dentro del backend y no duplican responsabilidades entre sí.
Análisis de patrones estudiados
Patrones integrados en la implementación backend
La implementación backend debe integrar los nueve patrones seleccionados. Cada patrón tiene una ubicación específica dentro del sistema y una responsabilidad clara. La intención es evitar controladores gigantes, reglas repetidas, condicionales desordenadas, objetos difíciles de construir y dependencias directas con tecnologías externas.
Patrón Singleton
Singleton garantiza que exista una única instancia controlada de una clase durante la ejecución del sistema. En este proyecto se aplica de forma limitada y responsable para la configuración global del backend, no para entidades de negocio ni para servicios que deban probarse de manera independiente. Su objetivo es mantener una fuente única de parámetros como reglas generales por programa, plantillas de correo, valores de inactividad y configuraciones usadas por validaciones, notificaciones y checklist.
El componente propuesto es ConfiguracionSistema o ConfiguracionProvider, administrado preferiblemente por el contenedor de dependencias del framework. Este componente puede ser consultado por servicios como ValidacionAptitudService, NotificacionService y ChecklistCierreService. De esta manera se evita que cada servicio cargue o duplique su propia configuración.
Se selecciona porque el sistema necesita coherencia en parámetros globales que son consultados por varios módulos. Para respetar SOLID, el patrón no se usa como variable global libre, sino encapsulado detrás de una interfaz y con responsabilidad única: proveer configuración centralizada.
Patrón Facade
Facade proporciona una interfaz simplificada para un conjunto de servicios complejos. En el proyecto se aplica principalmente en el cierre formal de práctica, porque ese proceso no es una operación simple. Para cerrar una práctica se debe validar el checklist, revisar notas, confirmar encuestas, verificar documentos, actualizar el expediente, bloquear modificaciones, notificar actores y registrar auditoría.
El componente propuesto es CierrePracticaFacade. El controlador recibe la petición HTTP y delega el proceso completo a la fachada. La fachada coordina ChecklistCierreService, PracticaService, ExpedienteService, NotificacionService y AuditoriaService.
Se selecciona porque reduce acoplamiento, evita controladores gigantes y organiza un proceso crítico del sistema. Respeta el principio de responsabilidad única porque cada clase mantiene una función clara.
Patrón Chain of Responsibility
Chain of Responsibility permite organizar validaciones como una cadena de responsables. Cada validador revisa una condición y, si se cumple, pasa la solicitud al siguiente. En el proyecto se aplica al checklist de cierre, a la validación de aptitud del estudiante y a la activación de práctica por vinculación.
En el cierre formal, la cadena incluye validadores como ValidadorNotaDocente, ValidadorNotaTutor, ValidadorNotaFinal, ValidadorEncuestaTutor, ValidadorEncuestaEstudiante, ValidadorDocumentos y ValidadorInformeFinal. Si alguna condición falla, se detiene el proceso y se informa el pendiente.
Se selecciona porque el cierre formal exige varias condiciones obligatorias. Con este patrón cada regla queda separada, clara y fácil de extender.
Patrón State
State permite que una entidad cambie su comportamiento según su estado. En este sistema es fundamental porque vacantes, asignaciones, estudiantes y prácticas tienen ciclos de vida definidos. Una vacante activa permite asignaciones; una vacante cerrada no. Una práctica cerrada no permite modificar documentos; una práctica activa sí permite seguimiento.
Se implementa inicialmente en Vacante, AsignacionPractica y Practica. Cada entidad tiene una interfaz de estado y clases concretas que definen las acciones permitidas. Por ejemplo, EstadoVacanteActiva permite asignar estudiantes, mientras EstadoVacanteCerrada bloquea esa acción.
Se selecciona porque evita condicionales repetidas y hace explícitas las reglas de transición. Además, mejora la claridad del backend porque las restricciones del negocio quedan ubicadas en clases de estado.
Patrón Observer
Observer permite que varios componentes reaccionen automáticamente cuando ocurre un evento. En el proyecto se aplica a notificaciones, alertas, recordatorios, auditoría y actualización de checklist. Cada vez que ocurre un evento importante, el sistema lo publica y diferentes listeners reaccionan.
Ejemplos de eventos son AsignacionConfirmadaEvent, EncuestaPendienteEvent, PracticaCerradaEvent e InactividadDetectadaEvent. Los observadores pueden enviar correos, crear alertas en el panel, registrar bitácora o actualizar estados relacionados.
Se selecciona porque desacopla los módulos. El servicio de asignaciones no debe saber cómo se envía un correo ni cómo se registra una alerta. Solo emite el evento y los observadores hacen su trabajo.
Patrón Strategy
Strategy encapsula reglas o algoritmos intercambiables. En el proyecto se aplica en reglas variables por programa académico. No todos los programas tienen necesariamente los mismos requisitos, documentos, cortes, notas mínimas o umbrales de inactividad.
Se implementa en la validación de aptitud del estudiante, en el cálculo de indicadores y en reglas de checklist configurables. Por ejemplo, ReglaCreditosMinimos, ReglaPromedioMinimo, ReglaPracticaAnteriorAprobada, ReglaDocumentosBaseCompletos y ReglaPazYSalvoVigente pueden ser estrategias independientes.
Se selecciona porque permite agregar o modificar reglas sin reescribir todo el servicio de validación. También evita métodos llenos de condicionales por programa o por tipo de práctica.
Patrón Factory Method
Factory Method centraliza la creación de objetos según un tipo. En el proyecto se aplica en la creación de usuarios por rol, reportes por tipo y notificaciones por evento. Estos objetos varían en su forma de creación, pero comparten una interfaz común.
Un ejemplo es ReporteFactory, encargada de crear ReporteEstadoProceso, ReporteNotas, ReporteEmpresasVacantes o ReporteEncuestas según el tipo solicitado. También puede usarse UsuarioFactory para crear objetos de usuario según el rol configurado.
Se selecciona porque evita condicionales repetidas y concentra la lógica de creación en un punto específico. Esto respeta el principio abierto/cerrado, porque nuevos tipos pueden agregarse sin modificar los consumidores.
Patrón Adapter
Adapter permite conectar el sistema con servicios externos sin acoplar la lógica de negocio a una tecnología concreta. En este proyecto se aplica para correo SMTP, exportación a Excel, exportación a PDF y repositorio de archivos.
El backend depende de interfaces propias como EmailService, ExportadorReporte o AlmacenamientoArchivo. Las clases SmtpEmailAdapter, PdfExportAdapter, ExcelExportAdapter o LocalFileStorageAdapter traducen esas interfaces hacia librerías o servicios concretos.
Se selecciona porque protege la arquitectura frente a cambios tecnológicos y respeta el principio de inversión de dependencias. Si cambia el proveedor de correo o la librería de PDF, se reemplaza el adaptador sin afectar el dominio.
Patrón Builder
Builder permite construir objetos complejos paso a paso. En el proyecto se aplica para correos institucionales, reportes, actas de cierre y respaldos. Estos elementos pueden tener encabezados, destinatarios, variables, tablas, filtros, secciones opcionales y formatos diferentes.
Un ejemplo es CorreoBuilder, que permite construir un correo con destinatario, asunto, plantilla, variables dinámicas y cuerpo HTML. Otro ejemplo es ReporteBuilder para armar reportes con encabezado, filtros, indicadores y tablas.
Se selecciona porque evita constructores largos y permite construir documentos complejos de forma legible y controlada. Además, separa la construcción del documento de la lógica de negocio que lo solicita.
Relación de los patrones con principios SOLID
Patrones no implementados y razón técnica
No todos los patrones estudiados deben implementarse. En ingeniería de software, usar patrones sin necesidad puede generar sobreingeniería. Por eso se descartan patrones que no resuelven un problema claro en el alcance actual.
Abstract Factory no se requiere porque no se están creando familias completas de objetos relacionadas. Prototype no es necesario porque no se clonan objetos complejos. Bridge, Flyweight, Interpreter y Visitor no aportan valor directo al sistema actual. Command y Memento podrían ser útiles en sistemas con acciones reversibles o restauración de estados, pero en este proyecto la bitácora de auditoría es suficiente. Template Method podría aplicarse a reportes, pero Builder y Factory Method resultan más claros para este alcance.
Diseño UML propuesto para los patrones aplicados
Los siguientes diagramas se presentan en código PlantUML para ser pegados en PlantText. Cada diagrama ilustra una parte concreta de la solución propuesta. Se diseñaron de forma limpia, con nombres coherentes con el alcance actual y con una orientación directa a la implementación backend.
Diagrama de clases general de colaboración de patrones



Diagrama de clases del patrón Singleton para configuración global



Diagrama de clases del patrón Facade para cierre de práctica


Diagrama de secuencia del patrón Facade en el cierre de práctica


Diagrama de clases del patrón Chain of Responsibility para checklist de cierre


Diagrama de secuencia del patrón Chain of Responsibility


Diagrama de clases del patrón State para vacante, asignación y práctica


Diagrama de clases del patrón Observer para eventos y notificaciones


Diagrama de secuencia del patrón Observer


Diagrama de clases del patrón Strategy para aptitud del estudiante


Diagrama de clases del patrón Factory Method para usuarios y reportes



Diagrama de clases del patrón Adapter para correo y exportación


Diagrama de clases del patrón Builder para correos y reportes


Diagrama de componentes de la arquitectura backend con los nueve patrones


Conclusión
La aplicación de patrones de diseño en la Plataforma de Gestión de Prácticas Empresariales responde a problemas reales del sistema. La selección realizada integra nueve patrones que mejoran la organización del backend y facilitan una implementación profesional.
Singleton centraliza de forma controlada la configuración global del sistema. Facade permite coordinar procesos complejos como el cierre formal. Chain of Responsibility organiza las validaciones del checklist. State controla el comportamiento de vacantes, asignaciones y prácticas según su estado. Observer permite manejar notificaciones, alertas y auditoría a partir de eventos. Strategy separa las reglas configurables por programa. Factory Method evita condicionales en la creación de usuarios, reportes y notificaciones. Adapter desacopla el sistema de tecnologías externas como SMTP, PDF, Excel y almacenamiento. Builder permite construir correos, reportes, actas y respaldos de manera ordenada.
Con esta propuesta se obtiene un diseño más limpio, escalable y coherente con principios SOLID. Además, el equipo puede implementar los patrones de manera gradual, empezando por los procesos más críticos: cierre formal de práctica, validación del checklist, estados de vacantes y prácticas, reglas configurables y notificaciones automáticas.







Patrón | Decisión | Razón técnica
Singleton | Se implementa | Centraliza de forma controlada la configuración global del sistema, como parámetros por programa, plantillas de correo y reglas generales, evitando múltiples instancias inconsistentes.
Factory Method | Se implementa | Centraliza la creación de objetos según tipo, como usuarios, reportes y notificaciones.
Abstract Factory | No se implementa | No se requieren familias completas de objetos relacionadas; Factory Method cubre la necesidad actual.
Builder | Se implementa | Permite construir correos, reportes, actas y respaldos con varias partes opcionales.
Prototype | No se implementa | No existe necesidad fuerte de clonar objetos complejos en esta versión.
Adapter | Se implementa | Permite integrar SMTP, PDF, Excel y repositorio de archivos sin acoplar el dominio a tecnologías externas.
Bridge | No se implementa | No existe una abstracción y una implementación que cambien independientemente en esta etapa.
Composite | No se implementa | Podría servir en menús jerárquicos, pero no es crítico para el dominio actual.
Decorator | No se implementa | Podría extender correos o reportes, pero aumentaría complejidad sin necesidad inmediata.
Facade | Se implementa | Simplifica procesos complejos como cierre de práctica, asignación y activación de vinculación.
Flyweight | No aplica | No hay un problema de memoria por objetos repetidos.
Proxy | No se implementa | El control de acceso se puede manejar con permisos, middleware o guards del backend.
Chain of Responsibility | Se implementa | Organiza validaciones secuenciales del checklist, aptitud y vinculación.
Command | No se implementa | La bitácora de auditoría cubre la trazabilidad sin requerir acciones reversibles.
Interpreter | No aplica | No se requiere interpretar un lenguaje propio de reglas.
Iterator | No se implementa | Los lenguajes y frameworks ya ofrecen mecanismos para recorrer colecciones.
Mediator | No se implementa | Los procesos complejos se coordinan de forma más clara con Facade.
Memento | No se implementa | No se necesita restaurar estados anteriores; la bitácora conserva la trazabilidad.
Observer | Se implementa | Permite manejar eventos, notificaciones, alertas, recordatorios y auditoría.
State | Se implementa | Controla el comportamiento de vacantes, asignaciones, prácticas y estudiantes según su estado.
Strategy | Se implementa | Permite manejar reglas variables por programa, validaciones, indicadores y checklist.
Template Method | No se implementa | Podría usarse en reportes, pero Builder y Factory Method son más claros para este alcance.
Visitor | No se implementa | No hay estructuras complejas que requieran agregar operaciones externas.
Principio | Patrones | Aplicación
Responsabilidad única | Singleton, Facade, Chain of Responsibility, Strategy, Observer, Builder | Cada clase se concentra en una tarea específica. La configuración global se centraliza, el controlador no cierra prácticas, los validadores no notifican y los builders no aplican reglas de negocio.
Abierto y cerrado | Strategy, State, Chain of Responsibility, Factory Method | El sistema permite agregar reglas, estados, validadores o tipos de reporte sin modificar grandes bloques existentes.
Sustitución de Liskov | State, Strategy, Chain of Responsibility | Los estados, estrategias y validadores se pueden intercambiar mediante una misma interfaz sin romper el comportamiento esperado.
Segregación de interfaces | Adapter, Observer, Strategy | Las interfaces se mantienen pequeñas y enfocadas en operaciones claras, como enviar correo, validar una regla o manejar un evento.
Inversión de dependencias | Adapter, Observer, Facade, Singleton controlado por interfaz | Los servicios dependen de abstracciones, como EmailService, EventListener o ConfiguracionProvider, y no de implementaciones concretas.