package co.edu.sistema_practicas_empresariales.modules.practica.controller;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.AvanceDto;
import co.edu.sistema_practicas_empresariales.modules.practica.enums.EstadoAvance;
import co.edu.sistema_practicas_empresariales.modules.practica.request.ComentarioDocenteRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.CrearAvanceRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.response.ApiResponse;
import co.edu.sistema_practicas_empresariales.modules.practica.service.AvanceFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controlador REST para el módulo de Avances de Práctica.
 * <p>
 * Facilita la gestión de entregas y seguimiento (avances) que realiza un estudiante
 * durante su práctica.
 * <p>
 * <b>Roles y Permisos:</b> Estudiantes pueden crear avances. Docentes asesores y
 * coordinadores pueden revisarlos, comentarlos y cambiar su estado.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link AvanceFacade}).
 * Delega la lógica de almacenamiento de archivos y reglas de estado a la fachada.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Avances", description = "Gestión de avances del estudiante por corte")
public class AvanceController {

    private final AvanceFacade avanceFacade;

    /**
     * Lista todos los avances asociados a una práctica específica.
     */
    @GetMapping("/practicas/{practicaId}/avances")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA_COORDINACION','ESTUDIANTE')")
    @Operation(summary = "Listar avances de una práctica")
    public ResponseEntity<ApiResponse<List<AvanceDto>>> listar(
            @PathVariable Long practicaId) {
        return ResponseEntity.ok(ApiResponse.ok(avanceFacade.listarPorPractica(practicaId)));
    }

    /**
     * Lista los avances pendientes de revisión que han sido enviados a un docente específico.
     */
    @GetMapping("/docentes/{docenteId}/avances/pendientes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','DOCENTE_ASESOR')")
    @Operation(summary = "Avances pendientes de revisión para un docente")
    public ResponseEntity<ApiResponse<List<AvanceDto>>> pendientesDocente(
            @PathVariable Long docenteId) {
        return ResponseEntity.ok(
                ApiResponse.ok(avanceFacade.listarPendientesPorDocente(docenteId)));
    }

    /**
     * Registra un nuevo avance en una práctica, con posibilidad de adjuntar un archivo (ej. documento de avance).
     */
    @PostMapping(value = "/practicas/{practicaId}/avances",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','ESTUDIANTE')")
    @Operation(summary = "Crear avance con archivo opcional (Firebase Storage)")
    public ResponseEntity<ApiResponse<AvanceDto>> crear(
            @PathVariable Long practicaId,
            @RequestPart("datos") @Valid CrearAvanceRequest req,
            @RequestPart(value = "archivo", required = false) MultipartFile archivo) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Avance registrado correctamente",
                avanceFacade.crearAvance(practicaId, req, archivo)));
    }

    /**
     * Agrega un comentario por parte del docente asesor a un avance enviado por el estudiante.
     * Al agregar el comentario, el estado del avance puede transicionar a REVISADO.
     */
    @PatchMapping("/avances/{avanceId}/comentario")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','DOCENTE_ASESOR')")
    @Operation(summary = "Agregar comentario del docente a un avance")
    public ResponseEntity<ApiResponse<AvanceDto>> comentar(
            @PathVariable Long avanceId,
            @RequestBody @Valid ComentarioDocenteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Comentario agregado correctamente",
                avanceFacade.agregarComentarioDocente(avanceId, req)));
    }

    /**
     * Cambia manualmente el estado de revisión de un avance.
     */
    @PatchMapping("/avances/{avanceId}/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','DOCENTE_ASESOR')")
    @Operation(summary = "Cambiar estado de un avance")
    public ResponseEntity<ApiResponse<AvanceDto>> cambiarEstado(
            @PathVariable Long avanceId,
            @PathVariable EstadoAvance estado) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Estado actualizado",
                avanceFacade.cambiarEstado(avanceId, estado)));
    }

    /**
     * Realiza un borrado lógico (desactivación) de un avance.
     */
    @DeleteMapping("/avances/{avanceId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    @Operation(summary = "Eliminar (borrado lógico) un avance")
    public ResponseEntity<Void> eliminarAvance(@PathVariable Long avanceId) {
        avanceFacade.eliminarAvance(avanceId);
        return ResponseEntity.noContent().build();
    }
}
