package co.edu.sistema_practicas_empresariales.modules.evaluacion.controller;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionRequest;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.service.EvaluacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con la entidad Evaluacion.
 * Maneja las peticiones HTTP y orquesta la respuesta delegando la lógica de negocio al servicio o facade correspondiente.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
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

    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA', 'DOCENTE_ASESOR','SECRETARIA_COORDINACION')")
    @PostMapping("/coordinador/practica/{practicaId}")
    public ResponseEntity<EvaluacionResponse> registrarNotaFinal(
            @PathVariable Long practicaId,
            @RequestBody EvaluacionRequest request,
            Principal principal) {

        EvaluacionResponse response = evaluacionService.registrarNotaFinal(
                practicaId,
                request.getNotaFinal(),
                request.getObservacionesFinales(),
                principal.getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/practica/{practicaId}")
    public ResponseEntity<EvaluacionResponse> obtenerEvaluacionByPractica(@PathVariable Long practicaId) {
        EvaluacionResponse response = evaluacionService.getEvaluacionByPractica(practicaId);
        return ResponseEntity.ok(response);
    }
}
