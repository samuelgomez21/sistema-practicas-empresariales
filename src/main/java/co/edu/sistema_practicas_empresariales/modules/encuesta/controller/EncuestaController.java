package co.edu.sistema_practicas_empresariales.modules.encuesta.controller;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.EnviarEncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearPlantillaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearPreguntaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearSeccionRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.service.EncuestaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/encuestas")
@RequiredArgsConstructor
public class EncuestaController {

    private final EncuestaService encuestaService;

    // ── Plantillas ─────────────────────────────────────────────────

    @GetMapping("/plantillas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<List<EncuestaPlantillaDto>> listarPlantillas() {
        return ResponseEntity.ok(encuestaService.listarPlantillas());
    }

    @GetMapping("/plantillas/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<EncuestaPlantillaDto> obtenerPlantillaPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(encuestaService.obtenerPlantillaPorId(id));
    }

    @GetMapping("/plantilla/{tipo}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','ESTUDIANTE','TUTOR_EMPRESARIAL')")
    public ResponseEntity<EncuestaPlantillaDto> obtenerPlantilla(
            @PathVariable TipoEncuesta tipo) {
        return ResponseEntity.ok(encuestaService.obtenerPlantilla(tipo));
    }

    @PostMapping("/plantillas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<EncuestaPlantillaDto> crearPlantilla(
            @RequestBody @Valid CrearPlantillaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(encuestaService.crearPlantilla(req));
    }

    @PatchMapping("/plantillas/{id}/toggle")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> togglePlantilla(@PathVariable Long id) {
        encuestaService.togglePlantilla(id);
        return ResponseEntity.noContent().build();
    }

    // ── Secciones ──────────────────────────────────────────────────

    @GetMapping("/secciones/{seccionId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<SeccionDto> obtenerSeccion(@PathVariable Long seccionId) {
        return ResponseEntity.ok(encuestaService.obtenerSeccion(seccionId));
    }

    @PostMapping("/secciones")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<SeccionDto> crearSeccion(
            @RequestBody @Valid CrearSeccionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(encuestaService.crearSeccion(req));
    }

    @DeleteMapping("/secciones/{seccionId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> eliminarSeccion(@PathVariable Long seccionId) {
        encuestaService.eliminarSeccion(seccionId);
        return ResponseEntity.noContent().build();
    }

    // ── Preguntas ──────────────────────────────────────────────────

    @PostMapping("/secciones/{seccionId}/preguntas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PreguntaDto> agregarPregunta(
            @PathVariable Long seccionId,
            @RequestBody @Valid CrearPreguntaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(encuestaService.agregarPregunta(seccionId, req));
    }

    @PutMapping("/preguntas/{preguntaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PreguntaDto> editarPregunta(
            @PathVariable Long preguntaId,
            @RequestBody @Valid CrearPreguntaRequest req) {
        return ResponseEntity.ok(encuestaService.editarPregunta(preguntaId, req));
    }

    @DeleteMapping("/preguntas/{preguntaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> desactivarPregunta(@PathVariable Long preguntaId) {
        encuestaService.desactivarPregunta(preguntaId);
        return ResponseEntity.noContent().build();
    }

    // ── Respuestas ─────────────────────────────────────────────────

    @PostMapping("/practica/{practicaId}/tipo/{tipo}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE','TUTOR_EMPRESARIAL','ADMINISTRADOR')")
    public ResponseEntity<EncuestaRespuestaDto> enviar(
            @PathVariable Long practicaId,
            @PathVariable TipoEncuesta tipo,
            @RequestBody @Valid EnviarEncuestaRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                encuestaService.enviarEncuesta(
                        practicaId, tipo, req, userDetails.getUsername()));
    }

    @GetMapping("/practica/{practicaId}/tipo/{tipo}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA')")
    public ResponseEntity<EncuestaRespuestaDto> obtenerRespuesta(
            @PathVariable Long practicaId,
            @PathVariable TipoEncuesta tipo) {
        return ResponseEntity.ok(
                encuestaService.obtenerRespuesta(practicaId, tipo));
    }

    @GetMapping("/practica/{practicaId}/tipo/{tipo}/completada")
    public ResponseEntity<Map<String, Boolean>> estaCompletada(
            @PathVariable Long practicaId,
            @PathVariable TipoEncuesta tipo) {
        return ResponseEntity.ok(
                Map.of("completada", encuestaService.estaCompletada(practicaId, tipo)));
    }
}