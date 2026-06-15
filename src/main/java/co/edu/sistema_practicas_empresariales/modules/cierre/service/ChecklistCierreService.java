package co.edu.sistema_practicas_empresariales.modules.cierre.service;

import co.edu.sistema_practicas_empresariales.modules.cierre.dto.ChecklistResponse;
import co.edu.sistema_practicas_empresariales.modules.cierre.event.CierreFormalEvent;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.chain.ValidadorNotaDocente;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.ProgramaParametro;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaParametroRepository;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.exception.BusinessException;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.model.PracticaDocumento;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaDocumentoRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChecklistCierreService {

    private final ValidadorNotaDocente validadorNotaDocente;
    private final PracticaRepository practicaRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final co.edu.sistema_practicas_empresariales.modules.encuesta.repository
            .EncuestaRespuestaRepository encuestaRepository;
    private final PracticaDocumentoRepository practicaDocumentoRepository;
    private final ProgramaParametroRepository programaParametroRepository;
    private final ApplicationEventPublisher eventPublisher;

    public void validarChecklistCierre(Practica practica) {
        // Iniciar la validación secuencial usando la cadena pre-configurada e inmutable
        validadorNotaDocente.validar(practica);
    }

    @Transactional(readOnly = true)
    public ChecklistResponse obtenerChecklistCierre(Long practicaId) {
        if (!practicaRepository.existsById(practicaId)) {
            throw new BusinessException("No se encontró la práctica con ID: " + practicaId);
        }

        Optional<Evaluacion> evalOpt = evaluacionRepository
                .findByPracticaIdAndActivoTrue(practicaId);

        boolean notaDocenteRegistrada = evalOpt.map(e -> e.getNotaDocente() != null).orElse(false);
        boolean notaTutorRegistrada   = evalOpt.map(e -> e.getNotaTutor()   != null).orElse(false);
        boolean notaFinalRegistrada   = evalOpt.map(e -> e.getNotaFinal()   != null).orElse(false);

        //  Usa encuesta_respuesta (nuevo sistema)
        boolean encuestaEstCompletada = encuestaRepository
                .existsByPracticaIdAndTipo(practicaId, TipoEncuesta.ESTUDIANTE);
        boolean encuestaTutCompletada = encuestaRepository
                .existsByPracticaIdAndTipo(practicaId, TipoEncuesta.TUTOR);

        String estadoEncEst = encuestaEstCompletada ? "COMPLETADA" : "PENDIENTE";
        String estadoEncTut = encuestaTutCompletada ? "COMPLETADA" : "PENDIENTE";

        List<PracticaDocumento> documentos = practicaDocumentoRepository
                .findByPracticaId(practicaId);
        Map<String, List<PracticaDocumento>> docsPorCategoria = documentos.stream()
                .collect(Collectors.groupingBy(d -> d.getCategoria().toUpperCase()));

        List<String> docsObligatorios = List.of(
                "ARL", "PLANEADOR", "INFORME_EJECUTIVO", "PRESENTACION");
        boolean documentosAprobados = true;
        for (String cat : docsObligatorios) {
            List<PracticaDocumento> docs = docsPorCategoria.get(cat);
            if (docs == null || docs.isEmpty()
                    || docs.stream().noneMatch(d -> "APROBADO".equalsIgnoreCase(d.getEstado()))) {
                documentosAprobados = false;
                break;
            }
        }

        List<PracticaDocumento> docFinal = docsPorCategoria.get("DOCUMENTO_FINAL");
        boolean informeFinalAprobado = docFinal != null && !docFinal.isEmpty()
                && docFinal.stream().anyMatch(d -> "APROBADO".equalsIgnoreCase(d.getEstado()));

        boolean todoListo = notaDocenteRegistrada && notaTutorRegistrada && notaFinalRegistrada
                && encuestaEstCompletada && encuestaTutCompletada
                && documentosAprobados && informeFinalAprobado;

        return ChecklistResponse.builder()
                .notaDocenteRegistrada(notaDocenteRegistrada)
                .notaTutorRegistrada(notaTutorRegistrada)
                .notaFinalRegistrada(notaFinalRegistrada)
                .estadoEncuestaEstudiante(estadoEncEst)
                .estadoEncuestaTutor(estadoEncTut)
                .fechaUltimoRecordatorioEstudiante(null)  // ya no aplica
                .fechaUltimoRecordatorioTutor(null)
                .documentosAprobados(documentosAprobados)
                .informeFinalAprobado(informeFinalAprobado)
                .todoListo(todoListo)
                .build();
    }

    @Transactional
    public void ejecutarCierreFormal(Long practicaId, String coordinadorEmail) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new BusinessException("No se encontró la práctica con ID: " + practicaId));

        // Validar la cadena completa
        validarChecklistCierre(practica);

        // Obtener nota mínima
        ProgramaParametro parametros = programaParametroRepository.findByProgramaId(practica.getEstudiante().getPrograma().getId())
                .orElseThrow(() -> new BusinessException("No se encontraron parámetros para el programa."));
        BigDecimal notaMinima = parametros.getNotaMinimaAprobacion();

        // Transicionar usando el patrón State
        practica.ejecutarCierre(notaMinima);
        practicaRepository.save(practica);

        // Publicar evento
        eventPublisher.publishEvent(new CierreFormalEvent(practicaId, practica.getResultado(), coordinadorEmail));
    }

/*    @Transactional
    public void enviarRecordatorio(Long practicaId, String actorType) {
        if (actorType == null || actorType.trim().isEmpty()) {
            throw new BusinessException("El tipo de actor no puede estar vacío.");
        }
        Encuesta.TipoActor actor;
        try {
            actor = Encuesta.TipoActor.valueOf(actorType.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Tipo de actor no válido: " + actorType);
        }

        Encuesta encuesta = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(practicaId, actor)
                .orElseGet(() -> {
                    Practica practica = practicaRepository.findById(practicaId)
                            .orElseThrow(() -> new BusinessException("No se encontró la práctica."));
                    return Encuesta.builder()
                            .practica(practica)
                            .tipoActor(actor)
                            .estado(Encuesta.EstadoEncuesta.PENDIENTE)
                            .activo(true)
                            .build();
                });

        encuesta.setFechaUltimoRecordatorio(LocalDateTime.now());
        encuestaRepository.save(encuesta);

        // Publicar evento de recordatorio
        eventPublisher.publishEvent(new RecordatorioEncuestaEvent(practicaId, actor));
    }*/
}
