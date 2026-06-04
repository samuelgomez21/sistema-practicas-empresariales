package co.edu.sistema_practicas_empresariales.modules.encuesta.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.ProgramaParametro;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaParametroRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EncuestaResponse;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.Encuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.repository.EncuestaRepository;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.email.CorreoBuilder;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.email.EmailService;
import co.edu.sistema_practicas_empresariales.modules.practica.exception.BusinessException;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EncuestaServiceImpl implements EncuestaService {

    private static final Logger logger = LoggerFactory.getLogger(EncuestaServiceImpl.class);

    private final EncuestaRepository encuestaRepository;
    private final PracticaRepository practicaRepository;
    private final TutorEmpresarialRepository tutorEmpresarialRepository;
    private final ProgramaParametroRepository programaParametroRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public EncuestaResponse guardarBorradorEncuesta(Long practicaId, String respuestasJson, String comentarios, String actorEmail, String tipoActor) {
        return registrarEncuesta(practicaId, respuestasJson, comentarios, actorEmail, tipoActor, Encuesta.EstadoEncuesta.BORRADOR);
    }

    @Override
    @Transactional
    public EncuestaResponse completarEncuesta(Long practicaId, String respuestasJson, String comentarios, String actorEmail, String tipoActor) {
        return registrarEncuesta(practicaId, respuestasJson, comentarios, actorEmail, tipoActor, Encuesta.EstadoEncuesta.COMPLETADA);
    }

    private EncuestaResponse registrarEncuesta(Long practicaId, String respuestasJson, String comentarios, String actorEmail, String tipoActorStr, Encuesta.EstadoEncuesta nuevoEstado) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new BusinessException("No se encontró la práctica con ID: " + practicaId));

        if ("CANCELADA".equals(practica.getEstado().name())) {
            throw new BusinessException("La práctica se encuentra cancelada y no permite registros de encuestas.");
        }

        Encuesta.TipoActor tipoActor = Encuesta.TipoActor.valueOf(tipoActorStr.toUpperCase());
        validarAutorizacionActor(practica, actorEmail, tipoActor);

        Encuesta encuesta = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(practicaId, tipoActor)
                .orElseGet(() -> Encuesta.builder()
                        .practica(practica)
                        .tipoActor(tipoActor)
                        .activo(true)
                        .build());

        if (encuesta.getEstado() == Encuesta.EstadoEncuesta.COMPLETADA) {
            throw new BusinessException("La encuesta ya ha sido completada y no se puede modificar.");
        }

        encuesta.setEstado(nuevoEstado);
        encuesta.setRespuestasJson(respuestasJson);
        encuesta.setComentarios(comentarios);
        
        if (nuevoEstado == Encuesta.EstadoEncuesta.COMPLETADA) {
            encuesta.setFechaCompletada(LocalDateTime.now());
        }

        Encuesta guardada = encuestaRepository.save(encuesta);
        return convertToResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public EncuestaResponse getEncuestaByPracticaAndActor(Long practicaId, String tipoActor) {
        Encuesta.TipoActor actor = Encuesta.TipoActor.valueOf(tipoActor.toUpperCase());
        Encuesta encuesta = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(practicaId, actor)
                .orElseThrow(() -> new BusinessException("No se encontró encuesta registrada para esta práctica y tipo de actor."));
        return convertToResponse(encuesta);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EncuestaResponse> getEncuestasByPractica(Long practicaId) {
        return encuestaRepository.findByPracticaIdAndActivoTrue(practicaId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void enviarInvitacionEncuesta(Long practicaId, String tipoActorStr) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new BusinessException("No se encontró la práctica con ID: " + practicaId));

        Encuesta.TipoActor tipoActor = Encuesta.TipoActor.valueOf(tipoActorStr.toUpperCase());
        String destinatarioEmail = obtenerEmailDestinatario(practica, tipoActor);

        // Crear registro de encuesta en estado PENDIENTE si no existe
        Encuesta encuesta = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(practicaId, tipoActor)
                .orElseGet(() -> {
                    Encuesta nueva = Encuesta.builder()
                            .practica(practica)
                            .tipoActor(tipoActor)
                            .estado(Encuesta.EstadoEncuesta.PENDIENTE)
                            .activo(true)
                            .build();
                    return encuestaRepository.save(nueva);
                });

        // Enviar correo electrónico usando el patrón Builder
        String link = "http://universidad.edu.co/practicas/encuesta?id=" + encuesta.getId();
        
        new CorreoBuilder()
                .destinatario(destinatarioEmail)
                .asunto("Invitación: Encuesta de Satisfacción de Prácticas")
                .variable("asunto", "Encuesta de Satisfacción de Práctica")
                .variable("mensaje", "Estimado usuario,<br/><br/>Te invitamos a diligenciar la encuesta de satisfacción correspondiente a la práctica de <b>" +
                        practica.getEstudiante().getUsuario().getNombre() + "</b>.<br/><br/>" +
                        "Puedes completar tu encuesta ingresando al siguiente enlace:<br/>" +
                        "<a href='" + link + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #1F4E79; text-decoration: none; border-radius: 4px; margin-top: 10px;'>Diligenciar Encuesta</a>")
                .enviar(emailService);

        logger.info("Invitación enviada a {} para la práctica ID {}", destinatarioEmail, practicaId);
    }

    @Override
    @Transactional
    public void enviarRecordatoriosPendientes() {
        List<Encuesta> encuestasPendientes = encuestaRepository.findAll().stream()
                .filter(e -> e.isActivo() && e.getEstado() == Encuesta.EstadoEncuesta.PENDIENTE)
                .collect(Collectors.toList());

        for (Encuesta encuesta : encuestasPendientes) {
            Practica practica = encuesta.getPractica();
            
            // Obtener el intervalo de días del recordatorio configurado en el programa
            int diasUmbral = 3; // Por defecto
            try {
                ProgramaParametro parametros = programaParametroRepository.findByProgramaId(practica.getEstudiante().getPrograma().getId())
                        .orElse(null);
                if (parametros != null) {
                    diasUmbral = parametros.getUmbralInactividadDias(); // Se usa este umbral para recordatorios por defecto
                }
            } catch (Exception e) {
                logger.warn("Error leyendo ProgramaParametro para recordatorios: {}", e.getMessage());
            }

            LocalDateTime ultimaAlerta = encuesta.getUpdatedAt();
            long diasTranscurridos = ChronoUnit.DAYS.between(ultimaAlerta, LocalDateTime.now());

            if (diasTranscurridos >= diasUmbral) {
                String destinatarioEmail = obtenerEmailDestinatario(practica, encuesta.getTipoActor());
                String link = "http://universidad.edu.co/practicas/encuesta?id=" + encuesta.getId();

                new CorreoBuilder()
                        .destinatario(destinatarioEmail)
                        .asunto("Recordatorio: Diligenciamiento de Encuesta de Satisfacción")
                        .variable("asunto", "Recordatorio de Encuesta de Satisfacción")
                        .variable("mensaje", "Estimado usuario,<br/><br/>Te recordamos que tienes pendiente diligenciar la encuesta de satisfacción de la práctica de <b>" +
                                practica.getEstudiante().getUsuario().getNombre() + "</b>.<br/><br/>" +
                                "Por favor, complétala ingresando al siguiente enlace:<br/>" +
                                "<a href='" + link + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #1F4E79; text-decoration: none; border-radius: 4px; margin-top: 10px;'>Diligenciar Encuesta</a>")
                        .enviar(emailService);

                // Forzar actualización del updatedAt para contar nuevamente el intervalo
                encuesta.setUpdatedAt(LocalDateTime.now());
                encuestaRepository.save(encuesta);

                logger.info("Recordatorio enviado a {} para la encuesta ID {}", destinatarioEmail, encuesta.getId());
            }
        }
    }

    private void validarAutorizacionActor(Practica practica, String actorEmail, Encuesta.TipoActor tipoActor) {
        if (tipoActor == Encuesta.TipoActor.ESTUDIANTE) {
            if (!practica.getEstudiante().getUsuario().getEmail().equalsIgnoreCase(actorEmail)) {
                throw new BusinessException("No tienes permisos para diligenciar esta encuesta como estudiante.");
            }
        } else if (tipoActor == Encuesta.TipoActor.TUTOR_EMPRESARIAL) {
            TutorEmpresarial tutor = tutorEmpresarialRepository.findByCorreo(actorEmail)
                    .orElseThrow(() -> new BusinessException("No se encontró tutor empresarial registrado con el correo: " + actorEmail));
            
            if (practica.getTutorEmpresarialId() == null || !practica.getTutorEmpresarialId().equals(tutor.getId())) {
                throw new BusinessException("No tienes permisos para diligenciar esta encuesta como tutor de esta práctica.");
            }
        }
    }

    private String obtenerEmailDestinatario(Practica practica, Encuesta.TipoActor tipoActor) {
        if (tipoActor == Encuesta.TipoActor.ESTUDIANTE) {
            return practica.getEstudiante().getUsuario().getEmail();
        } else {
            if (practica.getTutorEmpresarialId() == null) {
                throw new BusinessException("No hay tutor empresarial asignado a esta práctica para enviar la encuesta.");
            }
            TutorEmpresarial tutor = tutorEmpresarialRepository.findById(practica.getTutorEmpresarialId())
                    .orElseThrow(() -> new BusinessException("No se encontró el tutor asignado con ID: " + practica.getTutorEmpresarialId()));
            return tutor.getCorreo();
        }
    }

    private EncuestaResponse convertToResponse(Encuesta e) {
        return EncuestaResponse.builder()
                .id(e.getId())
                .practicaId(e.getPractica().getId())
                .tipoActor(e.getTipoActor().name())
                .estado(e.getEstado().name())
                .respuestasJson(e.getRespuestasJson())
                .comentarios(e.getComentarios())
                .fechaCompletada(e.getFechaCompletada())
                .activo(e.isActivo())
                .build();
    }
}
