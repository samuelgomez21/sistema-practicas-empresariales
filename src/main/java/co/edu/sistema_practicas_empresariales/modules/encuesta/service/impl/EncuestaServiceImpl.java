package co.edu.sistema_practicas_empresariales.modules.encuesta.service.impl;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EnviarEncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.repository.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.service.EncuestaService;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaService;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de encuestas de satisfacción.
 * Patrón Observer: al completar una encuesta notifica a PracticaService
 * para actualizar el checklist de paz y salvo.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EncuestaServiceImpl implements EncuestaService {

    private final EncuestaPlantillaRepository  plantillaRepository;
    private final EncuestaRespuestaRepository  respuestaRepository;
    private final PracticaRepository           practicaRepository;
    private final PracticaService              practicaService;

    // ── Consultas ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public EncuestaPlantillaDto obtenerPlantilla(TipoEncuesta tipo) {
        EncuestaPlantilla plantilla = plantillaRepository
                .findByTipoAndActivaTrue(tipo)
                .orElseThrow(() -> new RuntimeException(
                        "No hay plantilla activa para el tipo: " + tipo));
        return toPlantillaDto(plantilla);
    }

    @Transactional(readOnly = true)
    public EncuestaRespuestaDto obtenerRespuesta(Long practicaId, TipoEncuesta tipo) {
        EncuestaRespuesta respuesta = respuestaRepository
                .findByPracticaIdAndTipo(practicaId, tipo)
                .orElseThrow(() -> new RuntimeException(
                        "No se encontró encuesta " + tipo + " para la práctica " + practicaId));
        return toRespuestaDto(respuesta);
    }

    @Transactional(readOnly = true)
    public boolean estaCompletada(Long practicaId, TipoEncuesta tipo) {
        return respuestaRepository.existsByPracticaIdAndTipo(practicaId, tipo);
    }

    // ── Envío de encuesta ──────────────────────────────────────────

    /**
     * Envía y guarda la encuesta.
     * Una vez guardada es inmutable.
     * Patrón Observer: actualiza el checklist de paz y salvo.
     */
    public EncuestaRespuestaDto enviarEncuesta(Long practicaId,
                                               TipoEncuesta tipo,
                                               EnviarEncuestaRequest req,
                                               String emailRespondiente) {

        // Validar que la práctica esté en curso
        practicaRepository.findById(practicaId)
                .filter(p -> p.getEstado() == EstadoPracticaTipo.EN_PRACTICA)
                .orElseThrow(() -> new RuntimeException(
                        "Solo se pueden responder encuestas en prácticas EN_PRACTICA"));

        // Validar que no haya sido respondida antes — es inmutable
        if (respuestaRepository.existsByPracticaIdAndTipo(practicaId, tipo)) {
            throw new RuntimeException(
                    "La encuesta " + tipo + " ya fue respondida y no puede modificarse");
        }

        EncuestaPlantilla plantilla = plantillaRepository.findById(req.getPlantillaId())
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));

        // Construir la respuesta — Patrón Builder
        EncuestaRespuesta respuesta = EncuestaRespuesta.builder()
                .practicaId(practicaId)
                .plantilla(plantilla)
                .tipo(tipo)
                .respondidoPor(emailRespondiente)
                .observaciones(req.getObservaciones())
                .nombreProyecto(req.getNombreProyecto())
                .postularProyecto(req.getPostularProyecto() != null
                        ? req.getPostularProyecto() : false)
                .build();

        // Construir items de respuesta
        List<EncuestaItemRespuesta> items = req.getRespuestas().stream()
                .map(itemReq -> {
                    // Buscar la pregunta en las secciones de la plantilla
                    EncuestaPregunta pregunta = plantilla.getSecciones().stream()
                            .flatMap(s -> s.getPreguntas().stream())
                            .filter(p -> p.getId().equals(itemReq.getPreguntaId()))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException(
                                    "Pregunta no encontrada: " + itemReq.getPreguntaId()));

                    return EncuestaItemRespuesta.builder()
                            .respuesta(respuesta)
                            .pregunta(pregunta)
                            .valorEscala(itemReq.getValorEscala())
                            .valorTexto(itemReq.getValorTexto())
                            .valorBooleano(itemReq.getValorBooleano())
                            .build();
                })
                .toList();

        respuesta.setItems(items);
        EncuestaRespuesta guardada = respuestaRepository.save(respuesta);

        // Patrón Observer: notificar al servicio de práctica para
        // actualizar el checklist correspondiente
        if (tipo == TipoEncuesta.ESTUDIANTE) {
            practicaService.marcarEncuestaEstudianteCompletada(practicaId);
        } else {
            practicaService.marcarEncuestaTutorCompletada(practicaId);
        }

        log.info("Encuesta {} enviada — practicaId={} por={}",
                tipo, practicaId, emailRespondiente);

        return toRespuestaDto(guardada);
    }

    // ── Gestión de plantillas (coordinador) ───────────────────────

    public PreguntaDto agregarPregunta(Long seccionId,
                                       String texto,
                                       TipoPregunta tipoPregunta) {
        // Se busca la sección y se agrega la pregunta
        // La sección se obtiene a través de las plantillas existentes
        EncuestaPlantilla plantilla = plantillaRepository.findAll().stream()
                .flatMap(p -> p.getSecciones().stream())
                .filter(s -> s.getId().equals(seccionId))
                .findFirst()
                .map(EncuestaSeccion::getPlantilla)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada: " + seccionId));

        EncuestaSeccion seccion = plantilla.getSecciones().stream()
                .filter(s -> s.getId().equals(seccionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));

        int maxOrden = seccion.getPreguntas().stream()
                .mapToInt(EncuestaPregunta::getOrden)
                .max()
                .orElse(0);

        EncuestaPregunta nueva = EncuestaPregunta.builder()
                .seccion(seccion)
                .orden(maxOrden + 1)
                .texto(texto)
                .tipo(tipoPregunta)
                .activa(true)
                .build();

        seccion.getPreguntas().add(nueva);
        plantillaRepository.save(plantilla);

        return PreguntaDto.builder()
                .id(nueva.getId())
                .orden(nueva.getOrden())
                .texto(nueva.getTexto())
                .tipo(nueva.getTipo())
                .build();
    }

    // ── Mappers ───────────────────────────────────────────────────

    private EncuestaPlantillaDto toPlantillaDto(EncuestaPlantilla p) {
        return EncuestaPlantillaDto.builder()
                .id(p.getId())
                .tipo(p.getTipo())
                .version(p.getVersion())
                .nombre(p.getNombre())
                .secciones(p.getSecciones().stream()
                        .map(s -> SeccionDto.builder()
                                .id(s.getId())
                                .codigo(s.getCodigo())
                                .titulo(s.getTitulo())
                                .orden(s.getOrden())
                                .preguntas(s.getPreguntas().stream()
                                        .filter(EncuestaPregunta::getActiva)
                                        .map(pr -> PreguntaDto.builder()
                                                .id(pr.getId())
                                                .orden(pr.getOrden())
                                                .texto(pr.getTexto())
                                                .tipo(pr.getTipo())
                                                .build())
                                        .toList())
                                .build())
                        .toList())
                .build();
    }

    private EncuestaRespuestaDto toRespuestaDto(EncuestaRespuesta r) {
        return EncuestaRespuestaDto.builder()
                .id(r.getId())
                .practicaId(r.getPracticaId())
                .tipo(r.getTipo())
                .respondidoPor(r.getRespondidoPor())
                .fechaEnvio(r.getFechaEnvio())
                .observaciones(r.getObservaciones())
                .nombreProyecto(r.getNombreProyecto())
                .postularProyecto(r.getPostularProyecto())
                .items(r.getItems().stream()
                        .map(i -> ItemRespuestaDto.builder()
                                .preguntaId(i.getPregunta().getId())
                                .textoPregunta(i.getPregunta().getTexto())
                                .tipoPregunta(i.getPregunta().getTipo())
                                .valorEscala(i.getValorEscala())
                                .valorTexto(i.getValorTexto())
                                .valorBooleano(i.getValorBooleano())
                                .build())
                        .toList())
                .build();
    }
}