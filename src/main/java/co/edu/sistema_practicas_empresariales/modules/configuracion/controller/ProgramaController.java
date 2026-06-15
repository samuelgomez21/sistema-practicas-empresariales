package co.edu.sistema_practicas_empresariales.modules.configuracion.controller;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.ProgramaRequest;
import co.edu.sistema_practicas_empresariales.modules.configuracion.service.ConfiguracionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con la entidad Programa.
 * Maneja las peticiones HTTP y orquesta la respuesta delegando la lógica de negocio al servicio o facade correspondiente.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/programas")
@RequiredArgsConstructor
public class ProgramaController {

    private final ConfiguracionFacade configuracionFacade;

    @GetMapping
    public ResponseEntity<?> listarProgramas() {
        return ResponseEntity.ok(configuracionFacade.listarProgramas());
    }

    @PostMapping
    public ResponseEntity<?> crearPrograma(@RequestBody ProgramaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(configuracionFacade.crearPrograma(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPrograma(@PathVariable Long id, @RequestBody ProgramaRequest request) {
        return ResponseEntity.ok(configuracionFacade.actualizarPrograma(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPrograma(@PathVariable Long id) {
        configuracionFacade.eliminarPrograma(id);
        return ResponseEntity.noContent().build();
    }
}
