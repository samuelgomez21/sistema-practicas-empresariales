package co.edu.sistema_practicas_empresariales.modules.encuesta.service.impl;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.EnviarEncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.repository.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearPlantillaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearPreguntaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearSeccionRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.service.EncuestaService;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaFacade;
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
    private final PracticaFacade               practicaFacade;

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
            practicaFacade.marcarEncuestaEstudianteCompletada(respuesta.getPracticaId());
        } else {
            practicaFacade.marcarEncuestaTutorCompletada(practicaId);
        }

        log.info("Encuesta {} enviada — practicaId={} por={}",
                tipo, practicaId, emailRespondiente);

        return toRespuestaDto(guardada);
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

    // ── Gestión de plantillas ──────────────────────────────────────

    /**
     * Crea una nueva plantilla de encuesta.
     * Si ya existe una plantilla activa del mismo tipo,
     * la desactiva para que solo haya una activa por tipo.
     */
    public EncuestaPlantillaDto crearPlantilla(CrearPlantillaRequest req) {
        // Desactivar plantilla anterior del mismo tipo si existe
        plantillaRepository.findByTipoAndActivaTrue(req.getTipo())
                .ifPresent(p -> {
                    p.setActiva(false);
                    plantillaRepository.save(p);
                });

        EncuestaPlantilla nueva = EncuestaPlantilla.builder()
                .tipo(req.getTipo())
                .version(req.getVersion())
                .nombre(req.getNombre())
                .activa(true)
                .build();

        return toPlantillaDto(plantillaRepository.save(nueva));
    }

    @Transactional(readOnly = true)
    public List<EncuestaPlantillaDto> listarPlantillas() {
        return plantillaRepository.findAll().stream()
                .map(this::toPlantillaDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public EncuestaPlantillaDto obtenerPlantillaPorId(Long id) {
        return toPlantillaDto(
                plantillaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Plantilla no encontrada: " + id))
        );
    }

    public void togglePlantilla(Long id) {
        EncuestaPlantilla p = plantillaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));
        p.setActiva(!p.getActiva());
        plantillaRepository.save(p);
    }

// ── Gestión de secciones ───────────────────────────────────────

    /**
     * Crea una nueva sección dentro de una plantilla existente.
     */
    public SeccionDto crearSeccion(CrearSeccionRequest req) {
        EncuestaPlantilla plantilla = plantillaRepository.findById(req.getPlantillaId())
                .orElseThrow(() -> new RuntimeException("Plantilla no encontrada"));

        EncuestaSeccion seccion = EncuestaSeccion.builder()
                .plantilla(plantilla)
                .codigo(req.getCodigo())
                .titulo(req.getTitulo())
                .orden(req.getOrden())
                .build();

        plantilla.getSecciones().add(seccion);
        plantillaRepository.save(plantilla);

        return SeccionDto.builder()
                .id(seccion.getId())
                .codigo(seccion.getCodigo())
                .titulo(seccion.getTitulo())
                .orden(seccion.getOrden())
                .preguntas(List.of())
                .build();
    }

    @Transactional(readOnly = true)
    public SeccionDto obtenerSeccion(Long seccionId) {
        EncuestaSeccion seccion = obtenerSeccionById(seccionId);
        return SeccionDto.builder()
                .id(seccion.getId())
                .codigo(seccion.getCodigo())
                .titulo(seccion.getTitulo())
                .orden(seccion.getOrden())
                .preguntas(seccion.getPreguntas().stream()
                        .filter(EncuestaPregunta::getActiva)
                        .map(p -> PreguntaDto.builder()
                                .id(p.getId())
                                .orden(p.getOrden())
                                .texto(p.getTexto())
                                .tipo(p.getTipo())
                                .build())
                        .toList())
                .build();
    }

    public void eliminarSeccion(Long seccionId) {
        EncuestaPlantilla plantilla = plantillaRepository.findAll().stream()
                .flatMap(p -> p.getSecciones().stream())
                .filter(s -> s.getId().equals(seccionId))
                .findFirst()
                .map(EncuestaSeccion::getPlantilla)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));

        plantilla.getSecciones().removeIf(s -> s.getId().equals(seccionId));
        plantillaRepository.save(plantilla);
    }

// ── Gestión de preguntas ───────────────────────────────────────

    /**
     * Método corregido — ahora recibe un DTO en lugar de parámetros sueltos.
     */
    public PreguntaDto agregarPregunta(Long seccionId, CrearPreguntaRequest req) {
        EncuestaSeccion seccion = obtenerSeccionById(seccionId);

        int maxOrden = seccion.getPreguntas().stream()
                .mapToInt(EncuestaPregunta::getOrden)
                .max()
                .orElse(0);

        EncuestaPregunta nueva = EncuestaPregunta.builder()
                .seccion(seccion)
                .orden(maxOrden + 1)
                .texto(req.getTexto())
                .tipo(req.getTipo() != null ? req.getTipo() : TipoPregunta.ESCALA)
                .activa(true)
                .build();

        seccion.getPreguntas().add(nueva);
        plantillaRepository.save(seccion.getPlantilla());

        return PreguntaDto.builder()
                .id(nueva.getId())
                .orden(nueva.getOrden())
                .texto(nueva.getTexto())
                .tipo(nueva.getTipo())
                .build();
    }

    public PreguntaDto editarPregunta(Long preguntaId, CrearPreguntaRequest req) {
        EncuestaPregunta pregunta = obtenerPreguntaById(preguntaId);
        if (req.getTexto() != null)  pregunta.setTexto(req.getTexto());
        if (req.getTipo()  != null)  pregunta.setTipo(req.getTipo());
        plantillaRepository.save(pregunta.getSeccion().getPlantilla());
        return PreguntaDto.builder()
                .id(pregunta.getId())
                .orden(pregunta.getOrden())
                .texto(pregunta.getTexto())
                .tipo(pregunta.getTipo())
                .build();
    }

    public void desactivarPregunta(Long preguntaId) {
        EncuestaPregunta pregunta = obtenerPreguntaById(preguntaId);
        pregunta.setActiva(false);
        plantillaRepository.save(pregunta.getSeccion().getPlantilla());
    }

    @Transactional(readOnly = true)
    public List<EncuestaRespuestaDto> listarTodasLasRespuestas() {
        return respuestaRepository.findAll().stream()
                .map(this::toRespuestaDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EncuestaRespuestaDto> listarRespuestasPorTipo(TipoEncuesta tipo) {
        return respuestaRepository.findByTipo(tipo).stream()
                .map(this::toRespuestaDto)
                .toList();
    }

// ── Helpers privados ───────────────────────────────────────────

    private EncuestaSeccion obtenerSeccionById(Long seccionId) {
        return plantillaRepository.findAll().stream()
                .flatMap(p -> p.getSecciones().stream())
                .filter(s -> s.getId().equals(seccionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Sección no encontrada: " + seccionId));
    }

    private EncuestaPregunta obtenerPreguntaById(Long preguntaId) {
        return plantillaRepository.findAll().stream()
                .flatMap(p -> p.getSecciones().stream())
                .flatMap(s -> s.getPreguntas().stream())
                .filter(p -> p.getId().equals(preguntaId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada: " + preguntaId));
    }
}