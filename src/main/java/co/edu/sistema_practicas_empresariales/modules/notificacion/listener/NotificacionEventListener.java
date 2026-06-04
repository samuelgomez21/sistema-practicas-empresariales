package co.edu.sistema_practicas_empresariales.modules.notificacion.listener;

import co.edu.sistema_practicas_empresariales.modules.cierre.event.CierreFormalEvent;
import co.edu.sistema_practicas_empresariales.modules.cierre.event.RecordatorioEncuestaEvent;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.event.EstudianteRegistradoEvent;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.email.EmailService;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteAprobadaEvent;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteCreadaEvent;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.Encuesta;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NotificacionEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificacionEventListener.class);

    private final EmailService emailService;
    private final PracticaRepository practicaRepository;
    private final EmpresaRepository empresaRepository;
    private final TutorEmpresarialRepository tutorEmpresarialRepository;

    @EventListener
    public void handleEstudianteRegistrado(EstudianteRegistradoEvent event) {
        Estudiante estudiante = event.getEstudiante();
        if (estudiante != null && estudiante.getUsuario() != null) {
            String email = estudiante.getUsuario().getEmail();
            String nombre = estudiante.getUsuario().getNombre();
            log.info("Notificando registro a estudiante: {}", email);

            String asunto = "Bienvenido a la Plataforma de Prácticas - Universidad Alexander von Humboldt";
            String cuerpoHtml = String.format(
                    "<h3>Hola %s,</h3>" +
                    "<p>Te damos la bienvenida a la plataforma de prácticas empresariales de la universidad.</p>" +
                    "<p>Tu cuenta ha sido creada exitosamente. Muy pronto podrás ser asignado a una vacante para iniciar tu proceso.</p>" +
                    "<p>Atentamente,<br/>Coordinación de Prácticas</p>",
                    nombre
            );
            emailService.enviarCorreo(email, asunto, cuerpoHtml);
        }
    }

    @EventListener
    public void handleVacanteCreada(VacanteCreadaEvent event) {
        log.info("Notificando creación de vacante: {}", event.getTituloVacante());
        String emailCoordinador = "coordinador@unihumboldt.edu.co";
        String asunto = "Nueva Vacante Creada - Pendiente de Aprobación";
        String cuerpoHtml = String.format(
                "<h3>Estimado Coordinador,</h3>" +
                "<p>Se ha registrado una nueva vacante en el sistema que requiere su revisión y aprobación:</p>" +
                "<ul>" +
                "  <li><strong>Título:</strong> %s</li>" +
                "  <li><strong>ID Empresa:</strong> %d</li>" +
                "</ul>" +
                "<p>Por favor, ingrese a la plataforma para evaluar la vacante.</p>",
                event.getTituloVacante(),
                event.getEmpresaId()
        );
        emailService.enviarCorreo(emailCoordinador, asunto, cuerpoHtml);
    }

    @EventListener
    public void handleVacanteAprobada(VacanteAprobadaEvent event) {
        log.info("Notificando aprobación de vacante ID: {}", event.getVacanteId());
        Optional<Empresa> empresaOpt = empresaRepository.findById(event.getEmpresaId());
        if (empresaOpt.isPresent()) {
            Empresa empresa = empresaOpt.get();
            String email = empresa.getContactoPrincipalEmail();
            if (email != null && !email.trim().isEmpty()) {
                String asunto = "Vacante Aprobada Exitosamente";
                String cuerpoHtml = String.format(
                        "<h3>Estimados representantes de %s,</h3>" +
                        "<p>Nos complace informarles que la vacante con ID %d ha sido revisada y aprobada por la coordinación.</p>" +
                        "<p>A partir de este momento, los estudiantes aptos podrán ser asignados a ella.</p>" +
                        "<p>Gracias por su colaboración constante.</p>",
                        empresa.getRazonSocial(),
                        event.getVacanteId()
                );
                emailService.enviarCorreo(email, asunto, cuerpoHtml);
            }
        }
    }

    @EventListener
    public void handleCierreFormal(CierreFormalEvent event) {
        log.info("Notificando cierre formal de práctica ID: {}", event.getPracticaId());
        Optional<Practica> practicaOpt = practicaRepository.findById(event.getPracticaId());
        if (practicaOpt.isPresent()) {
            Practica practica = practicaOpt.get();
            
            // 1. Notificar al estudiante
            if (practica.getEstudiante() != null && practica.getEstudiante().getUsuario() != null) {
                String estEmail = practica.getEstudiante().getUsuario().getEmail();
                String asunto = "Resultado del Cierre Formal de Práctica";
                String cuerpoHtml = String.format(
                        "<h3>Hola %s,</h3>" +
                        "<p>Tu práctica número %d ha sido cerrada formalmente.</p>" +
                        "<p><strong>Resultado:</strong> %s</p>" +
                        "<p><strong>Nota Final:</strong> %s</p>" +
                        "<p>Puedes consultar el acta de cierre en tu expediente digital.</p>",
                        practica.getEstudiante().getUsuario().getNombre(),
                        practica.getNumeroPractica(),
                        event.getResultado(),
                        practica.getNotaFinal() != null ? practica.getNotaFinal().toString() : "N/A"
                );
                emailService.enviarCorreo(estEmail, asunto, cuerpoHtml);
            }

            // 2. Notificar al docente asesor
            if (practica.getDocenteAsesor() != null) {
                String docEmail = practica.getDocenteAsesor().getEmail();
                String asunto = "Cierre formal de práctica completado";
                String cuerpoHtml = String.format(
                        "<h3>Estimado Docente Asesor %s,</h3>" +
                        "<p>Le informamos que la práctica del estudiante %s ha sido cerrada formalmente.</p>" +
                        "<p><strong>Resultado:</strong> %s</p>" +
                        "<p>Muchas gracias por su tutoría académica.</p>",
                        practica.getDocenteAsesor().getNombre(),
                        practica.getEstudiante() != null ? practica.getEstudiante().getUsuario().getNombre() : "N/A",
                        event.getResultado()
                );
                emailService.enviarCorreo(docEmail, asunto, cuerpoHtml);
            }

            // 3. Notificar al tutor empresarial
            if (practica.getTutorEmpresarialId() != null) {
                Optional<TutorEmpresarial> tutorOpt = tutorEmpresarialRepository.findById(practica.getTutorEmpresarialId());
                if (tutorOpt.isPresent()) {
                    TutorEmpresarial tutor = tutorOpt.get();
                    String tutEmail = tutor.getCorreo();
                    if (tutEmail != null && !tutEmail.trim().isEmpty()) {
                        String asunto = "Finalización del Proceso de Práctica";
                        String cuerpoHtml = String.format(
                                "<h3>Estimado Tutor %s,</h3>" +
                                "<p>Le informamos que el proceso de práctica del estudiante %s ha concluido formalmente y ha sido registrado en el sistema.</p>" +
                                "<p>Agradecemos sinceramente su valioso acompañamiento y guía en la empresa.</p>",
                                tutor.getNombreCompleto(),
                                practica.getEstudiante() != null ? practica.getEstudiante().getUsuario().getNombre() : "N/A"
                        );
                        emailService.enviarCorreo(tutEmail, asunto, cuerpoHtml);
                    }
                }
            }
        }
    }

    @EventListener
    public void handleRecordatorioEncuesta(RecordatorioEncuestaEvent event) {
        log.info("Notificando recordatorio de encuesta para práctica ID: {}, actor: {}", event.getPracticaId(), event.getTipoActor());
        Optional<Practica> practicaOpt = practicaRepository.findById(event.getPracticaId());
        if (practicaOpt.isPresent()) {
            Practica practica = practicaOpt.get();

            if (event.getTipoActor() == Encuesta.TipoActor.ESTUDIANTE) {
                if (practica.getEstudiante() != null && practica.getEstudiante().getUsuario() != null) {
                    String estEmail = practica.getEstudiante().getUsuario().getEmail();
                    String asunto = "Recordatorio: Diligenciar Encuesta de Satisfacción de Prácticas";
                    String cuerpoHtml = String.format(
                            "<h3>Hola %s,</h3>" +
                            "<p>Tienes una encuesta de satisfacción/autoevaluación pendiente para tu práctica actual.</p>" +
                            "<p>Por favor, ingresa al sistema y complétala lo antes posible, ya que es un requisito obligatorio para tu cierre formal de práctica.</p>",
                            practica.getEstudiante().getUsuario().getNombre()
                    );
                    emailService.enviarCorreo(estEmail, asunto, cuerpoHtml);
                }
            } else if (event.getTipoActor() == Encuesta.TipoActor.TUTOR_EMPRESARIAL) {
                if (practica.getTutorEmpresarialId() != null) {
                    Optional<TutorEmpresarial> tutorOpt = tutorEmpresarialRepository.findById(practica.getTutorEmpresarialId());
                    if (tutorOpt.isPresent()) {
                        TutorEmpresarial tutor = tutorOpt.get();
                        String tutEmail = tutor.getCorreo();
                        if (tutEmail != null && !tutEmail.trim().isEmpty()) {
                            String asunto = "Recordatorio: Encuesta de Satisfacción del Tutor Empresarial";
                            String cuerpoHtml = String.format(
                                    "<h3>Estimado Tutor %s,</h3>" +
                                    "<p>Aún tiene pendiente diligenciar la encuesta de satisfacción sobre el proceso de práctica del estudiante %s.</p>" +
                                    "<p>Le agradecemos ingresar a la plataforma con su enlace para completarla. Sus respuestas nos ayudan a seguir mejorando.</p>",
                                    tutor.getNombreCompleto(),
                                    practica.getEstudiante() != null ? practica.getEstudiante().getUsuario().getNombre() : "N/A"
                            );
                            emailService.enviarCorreo(tutEmail, asunto, cuerpoHtml);
                        }
                    }
                }
            }
        }
    }
}
