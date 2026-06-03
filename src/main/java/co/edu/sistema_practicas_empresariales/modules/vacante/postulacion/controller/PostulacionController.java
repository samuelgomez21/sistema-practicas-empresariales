package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.controller;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.service.PostulacionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST para la gestión de postulaciones.
 * Todos los métodos utilizan operaciones de **soft‑delete**; nunca se elimina físicamente.
 */
@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
public class PostulacionController {

    private final PostulacionFacade postulacionFacade;

    /**
     * Crea una nueva postulación.
     */
    @PostMapping
    public ResponseEntity<PostulacionResponse> crear(@RequestBody PostulacionCreateDto dto) {
        PostulacionResponse resp = postulacionFacade.crearPostulacion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    /**
     * Obtiene una postulación por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostulacionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(postulacionFacade.obtenerPostulacion(id));
    }

    /**
     * Actualiza el estado de una postulación existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PostulacionResponse> actualizar(@PathVariable Long id,
                                                          @RequestBody PostulacionUpdateDto dto) {
        return ResponseEntity.ok(postulacionFacade.actualizarPostulacion(id, dto));
    }

    /**
     * Soft‑delete de una postulación.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        postulacionFacade.softDeletePostulacion(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista todas las postulaciones no eliminadas.
     */
    @GetMapping
    public ResponseEntity<List<PostulacionResponse>> listarTodas() {
        return ResponseEntity.ok(postulacionFacade.listarTodas());
    }

    /**
     * Lista las postulaciones de una vacante específica.
     */
    @GetMapping("/vacante/{vacanteId}")
    public ResponseEntity<List<PostulacionResponse>> listarPorVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(postulacionFacade.listarPorVacante(vacanteId));
    }
}
