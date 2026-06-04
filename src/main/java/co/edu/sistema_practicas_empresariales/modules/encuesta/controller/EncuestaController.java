package co.edu.sistema_practicas_empresariales.modules.encuesta.controller;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EnviarEncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.service.EncuestaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/encuestas")
@RequiredArgsConstructor
public class EncuestaController {

    private final EncuestaService encuestaService;

    // ── Plantillas ─────────────────────────────────────────────────

    @GetMapping("/plantilla/{tipo}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','ESTUDIANTE','TUTOR_EMPRESARIAL')")
    public ResponseEntity<EncuestaPlantillaDto> obtenerPlantilla(
            @PathVariable TipoEncuesta tipo) {
        return ResponseEntity.ok(encuestaService.obtenerPlantilla(tipo));
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
        return ResponseEntity.ok(encuestaService.obtenerRespuesta(practicaId, tipo));
    }

    @GetMapping("/practica/{practicaId}/tipo/{tipo}/completada")
    public ResponseEntity<Map<String, Boolean>> estaCompletada(
            @PathVariable Long practicaId,
            @PathVariable TipoEncuesta tipo) {
        return ResponseEntity.ok(
                Map.of("completada", encuestaService.estaCompletada(practicaId, tipo)));
    }

    // ── Gestión de plantillas (coordinador) ───────────────────────

    @PostMapping("/secciones/{seccionId}/preguntas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PreguntaDto> agregarPregunta(
            @PathVariable Long seccionId,
            @RequestBody Map<String, String> body) {
        TipoPregunta tipo = body.containsKey("tipo")
                ? TipoPregunta.valueOf(body.get("tipo"))
                : TipoPregunta.ESCALA;
        return ResponseEntity.ok(
                encuestaService.agregarPregunta(seccionId, body.get("texto"), tipo));
    }
}