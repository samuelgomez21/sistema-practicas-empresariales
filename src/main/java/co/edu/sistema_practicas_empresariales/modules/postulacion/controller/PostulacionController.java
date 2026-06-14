package co.edu.sistema_practicas_empresariales.modules.postulacion.controller;

import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionRequestDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionResponseDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.service.PostulacionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
public class PostulacionController {

    private final PostulacionFacade postulacionFacade;

    @PostMapping
    @PreAuthorize("hasAnyRole('COORDINADOR_PRACTICA', 'ADMINISTRADOR','SECRETARIA_COORDINACION')")
    public ResponseEntity<PostulacionResponseDto> crearPostulacion(@RequestBody PostulacionRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postulacionFacade.crearPostulacion(dto));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('EMPRESA_VINCULADA', 'ADMINISTRADOR', 'COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PostulacionResponseDto> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String estado = body.getOrDefault("estado", "");
        return ResponseEntity.ok(postulacionFacade.actualizarEstado(id, estado));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'EMPRESA_VINCULADA', 'ADMINISTRADOR', 'COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PostulacionResponseDto> obtenerPostulacion(@PathVariable Long id) {
        return ResponseEntity.ok(postulacionFacade.obtenerPostulacion(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<PostulacionResponseDto>> listarTodas() {
        return ResponseEntity.ok(postulacionFacade.listarTodas());
    }

    @GetMapping("/vacante/{vacanteId}")
    @PreAuthorize("hasAnyRole('EMPRESA_VINCULADA', 'ADMINISTRADOR', 'COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<PostulacionResponseDto>> listarPorVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(postulacionFacade.listarPorVacante(vacanteId));
    }

    @GetMapping("/estudiante/{estudianteId}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'ADMINISTRADOR', 'COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<PostulacionResponseDto>> listarPorEstudiante(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(postulacionFacade.listarPorEstudiante(estudianteId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarPostulacion(@PathVariable Long id) {
        postulacionFacade.eliminarPostulacion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mis-postulaciones")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<List<PostulacionResponseDto>> misPostulaciones(
            @org.springframework.security.core.annotation.AuthenticationPrincipal
            org.springframework.security.core.userdetails.UserDetails userDetails) {
        // Obtener estudianteId desde email del usuario autenticado
        return ResponseEntity.ok(postulacionFacade.listarPorEstudianteEmail(userDetails.getUsername()));
    }
}