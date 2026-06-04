package co.edu.sistema_practicas_empresariales.modules.configuracion.controller;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.CatalogoPracticaRequest;
import co.edu.sistema_practicas_empresariales.modules.configuracion.service.ConfiguracionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionFacade configuracionFacade;

    @GetMapping("/info")
    public ResponseEntity<?> obtenerInfoSistema() {
        return ResponseEntity.ok(
            java.util.Map.of(
                "nombre", configuracionFacade.getNombreAplicacion(),
                "version", configuracionFacade.getVersion()
            )
        );
    }

    @GetMapping("/programas/{programaId}/catalogos")
    public ResponseEntity<?> listarCatalogos(@PathVariable Long programaId) {
        return ResponseEntity.ok(configuracionFacade.listarCatalogosPorPrograma(programaId));
    }

    @PostMapping("/catalogos")
    public ResponseEntity<?> crearCatalogo(@RequestBody CatalogoPracticaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(configuracionFacade.crearCatalogo(request));
    }

    @PatchMapping("/catalogos/{id}/estado")
    public ResponseEntity<?> cambiarEstadoCatalogo(@PathVariable Long id, @RequestParam boolean activo) {
        configuracionFacade.activarDesactivarCatalogo(id, activo);
        return ResponseEntity.ok("Estado actualizado exitosamente");
    }
}
