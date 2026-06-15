package co.edu.sistema_practicas_empresariales.modules.bitacora.controller;

import co.edu.sistema_practicas_empresariales.modules.bitacora.model.Bitacora;
import co.edu.sistema_practicas_empresariales.modules.bitacora.repository.BitacoraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con la entidad Bitacora.
 * Maneja las peticiones HTTP y orquesta la respuesta delegando la lógica de negocio al servicio o facade correspondiente.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/bitacora")
@RequiredArgsConstructor
public class BitacoraController {

    private final BitacoraRepository bitacoraRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Bitacora>> getBitacora() {
        return ResponseEntity.ok(bitacoraRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaRegistro")));
    }
}
