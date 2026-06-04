package co.edu.sistema_practicas_empresariales.modules.evaluacion.controller;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionRequest;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.service.EvaluacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @PostMapping("/docente/practica/{practicaId}")
    public ResponseEntity<EvaluacionResponse> registrarNotaDocente(
            @PathVariable Long practicaId,
            @RequestBody EvaluacionRequest request,
            Principal principal) {
        
        EvaluacionResponse response = evaluacionService.registrarNotaDocente(
                practicaId, request.getNotaDocente(), request.getObservacionesDocente(), principal.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tutor/practica/{practicaId}")
    public ResponseEntity<EvaluacionResponse> registrarNotaTutor(
            @PathVariable Long practicaId,
            @RequestBody EvaluacionRequest request,
            Principal principal) {
        
        EvaluacionResponse response = evaluacionService.registrarNotaTutor(
                practicaId, request.getNotaTutor(), request.getObservacionesTutor(), principal.getName());
        return ResponseEntity.ok(response);
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    @PostMapping("/coordinador/practica/{practicaId}")
            @PathVariable Long practicaId,
            @RequestBody EvaluacionRequest request,
            Principal principal) {
        
        EvaluacionResponse response = evaluacionService.registrarNotaFinal(
                practicaId, request.getNotaFinal(), request.getObservacionesFinales(), principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/practica/{practicaId}")
    public ResponseEntity<EvaluacionResponse> obtenerEvaluacionByPractica(@PathVariable Long practicaId) {
        EvaluacionResponse response = evaluacionService.getEvaluacionByPractica(practicaId);
        return ResponseEntity.ok(response);
    }
}
