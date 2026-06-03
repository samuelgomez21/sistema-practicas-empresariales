package co.edu.sistema_practicas_empresariales.modules.estudiante.controller;

import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteRequest;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.PracticaResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.EstudianteFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteFacade estudianteFacade;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINACION_ACADEMICA')")
    public ResponseEntity<EstudianteResponse> registrar(@RequestBody EstudianteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estudianteFacade.registrarEstudiante(request));
    }

    @PostMapping(value = "/masivo", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<EstudianteResponse>> registrarMasivo(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estudianteFacade.registrarEstudiantesMasivo(file));
    }

    @GetMapping
    public ResponseEntity<List<EstudianteResponse>> listarTodos() {
        return ResponseEntity.ok(estudianteFacade.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteFacade.obtenerPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<EstudianteResponse> obtenerPorUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudianteFacade.obtenerPorUsuarioId(usuarioId));
    }

    @GetMapping("/programa/{programaId}")
    public ResponseEntity<List<EstudianteResponse>> listarPorPrograma(@PathVariable Long programaId) {
        return ResponseEntity.ok(estudianteFacade.listarPorPrograma(programaId));
    }

    @GetMapping("/aptos")
    public ResponseEntity<List<EstudianteResponse>> listarAptos() {
        return ResponseEntity.ok(estudianteFacade.listarAptos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudianteResponse> actualizar(
            @PathVariable Long id,
            @RequestBody EstudianteRequest request) {
        return ResponseEntity.ok(estudianteFacade.actualizarEstudiante(id, request));
    }

    @PostMapping("/{estudianteId}/evaluar-aptitud/{numeroPractica}")
    public ResponseEntity<EstudianteResponse> evaluarAptitud(
            @PathVariable Long estudianteId,
            @PathVariable int numeroPractica) {
        return ResponseEntity.ok(estudianteFacade.evaluarAptitud(estudianteId, numeroPractica));
    }

    @GetMapping("/{estudianteId}/practicas")
    public ResponseEntity<List<PracticaResponse>> obtenerHistorialPracticas(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(estudianteFacade.obtenerHistorialPracticas(estudianteId));
    }
}
