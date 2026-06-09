package co.edu.sistema_practicas_empresariales.modules.vinculacion.controller;

import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.service.VinculacionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Controlador REST para la gestión de Vinculaciones.
 * Exponer operaciones CRUD y soft‑delete siguiendo los principios SOLID.
 * <p>
 * <b>Roles y Permisos:</b> Solo Coordinadores o Administradores pueden crear o
 * modificar vinculaciones. Empresas y estudiantes pueden consultar.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link VinculacionFacade}).
 */
@RestController
@RequestMapping("/api/vinculaciones")
@RequiredArgsConstructor
public class VinculacionController {

    private final VinculacionFacade vinculacionFacade;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<VinculacionResponse> crear(@RequestBody VinculacionCreateDto dto) {
        VinculacionResponse resp = vinculacionFacade.crearVinculacion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'TUTOR_EMPRESARIAL', 'ESTUDIANTE')")
    public ResponseEntity<VinculacionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(vinculacionFacade.obtenerVinculacion(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<VinculacionResponse>> listarTodas() {
        return ResponseEntity.ok(vinculacionFacade.listarTodas());
    }

    @GetMapping("/vacante/{vacanteId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'TUTOR_EMPRESARIAL')")
    public ResponseEntity<List<VinculacionResponse>> listarPorVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(vinculacionFacade.listarPorVacante(vacanteId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<VinculacionResponse> actualizar(@PathVariable Long id, @RequestBody VinculacionUpdateDto dto) {
        return ResponseEntity.ok(vinculacionFacade.actualizarVinculacion(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        vinculacionFacade.softDeleteVinculacion(id);
        return ResponseEntity.noContent().build();
    }
}
