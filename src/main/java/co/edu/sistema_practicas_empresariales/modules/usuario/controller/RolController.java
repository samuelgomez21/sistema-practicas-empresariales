package co.edu.sistema_practicas_empresariales.modules.usuario.controller;

import co.edu.sistema_practicas_empresariales.modules.usuario.dto.RolDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Expone los roles disponibles en el sistema para
 * poblar selectores en el frontend (ej. crear usuario).
 */
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolRepository rolRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<RolDto>> listar() {
        List<RolDto> roles = rolRepository.findAll().stream()
                .map(r -> RolDto.builder()
                        .id(r.getId())
                        .nombre(r.getNombre().name())
                        .build())
                .toList();
        return ResponseEntity.ok(roles);
    }
}