package co.edu.sistema_practicas_empresariales.modules.evaluacion.controller;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionRequest;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.service.EvaluacionFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para el módulo de Calificaciones y Evaluaciones.
 * <p>
 * Gestiona las evaluaciones bidireccionales de la práctica: tanto del tutor
 * y docente hacia el estudiante, como la retroalimentación del estudiante
 * hacia la empresa.
 * <p>
 * <b>Roles y Permisos:</b> Administradores, Docentes, Tutores Empresariales
 * pueden registrar evaluaciones. Coordinadores y Estudiantes pueden visualizarlas.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link EvaluacionFacade}).
 * Consolida la lógica de registro y cálculo de puntajes.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
public class EvaluacionController {

    private final EvaluacionFacade evaluacionFacade;

    /**
     * Registra una nueva evaluación.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE_ASESOR', 'TUTOR_EMPRESARIAL', 'TUTOR_EMPRESARIAL', 'ESTUDIANTE')")
    public ResponseEntity<EvaluacionResponse> registrarEvaluacion(@Valid @RequestBody EvaluacionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(evaluacionFacade.registrarEvaluacion(request));
    }

    /**
     * Lista las evaluaciones asociadas a una práctica.
     */
    @GetMapping("/practica/{practicaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'COORDINADOR_ACADEMICO', 'DOCENTE_ASESOR', 'ESTUDIANTE', 'TUTOR_EMPRESARIAL')")
    public ResponseEntity<List<EvaluacionResponse>> listarPorPractica(@PathVariable Long practicaId) {
        return ResponseEntity.ok(evaluacionFacade.listarPorPractica(practicaId));
    }

    /**
     * Obtiene el detalle de una evaluación.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'DOCENTE_ASESOR', 'ESTUDIANTE', 'TUTOR_EMPRESARIAL')")
    public ResponseEntity<EvaluacionResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(evaluacionFacade.obtenerPorId(id));
    }

    /**
     * Realiza un borrado lógico de una evaluación.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> eliminarEvaluacion(@PathVariable Long id) {
        evaluacionFacade.eliminarEvaluacion(id);
        return ResponseEntity.noContent().build();
    }
}
