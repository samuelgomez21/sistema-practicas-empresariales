package co.edu.sistema_practicas_empresariales.modules.practica.controller;



import co.edu.sistema_practicas_empresariales.modules.practica.dto.AvanceDto;
import co.edu.sistema_practicas_empresariales.modules.practica.enums.EstadoAvance;
import co.edu.sistema_practicas_empresariales.modules.practica.request.ComentarioDocenteRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.CrearAvanceRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.response.ApiResponse;
import co.edu.sistema_practicas_empresariales.modules.practica.service.AvanceService;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Avances", description = "Gestión de avances del estudiante por corte")
public class AvanceController {

    private final AvanceService avanceService;

    @GetMapping("/practicas/{practicaId}/avances")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA','ESTUDIANTE')")
    @Operation(summary = "Listar avances de una práctica")
    public ResponseEntity<ApiResponse<List<AvanceDto>>> listar(
            @PathVariable Long practicaId) {
        return ResponseEntity.ok(ApiResponse.ok(avanceService.listarPorPractica(practicaId)));
    }

    @GetMapping("/docentes/{docenteId}/avances/pendientes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','DOCENTE_ASESOR')")
    @Operation(summary = "Avances pendientes de revisión para un docente")
    public ResponseEntity<ApiResponse<List<AvanceDto>>> pendientesDocente(
            @PathVariable Long docenteId) {
        return ResponseEntity.ok(
                ApiResponse.ok(avanceService.listarPendientesPorDocente(docenteId)));
    }

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
                avanceService.crearAvance(practicaId, req, archivo)));
    }

    @PatchMapping("/avances/{avanceId}/comentario")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','DOCENTE_ASESOR')")
    @Operation(summary = "Agregar comentario del docente a un avance")
    public ResponseEntity<ApiResponse<AvanceDto>> comentar(
            @PathVariable Long avanceId,
            @RequestBody @Valid ComentarioDocenteRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Comentario agregado correctamente",
                avanceService.agregarComentarioDocente(avanceId, req)));
    }

    @PatchMapping("/avances/{avanceId}/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','DOCENTE_ASESOR')")
    @Operation(summary = "Cambiar estado de un avance")
    public ResponseEntity<ApiResponse<AvanceDto>> cambiarEstado(
            @PathVariable Long avanceId,
            @PathVariable EstadoAvance estado) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Estado actualizado",
                avanceService.cambiarEstado(avanceId, estado)));
    }
}
