package co.edu.sistema_practicas_empresariales.modules.configuracion.controller;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.FacultadDto;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.FacultadRequest;
import co.edu.sistema_practicas_empresariales.modules.configuracion.service.ConfiguracionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/facultades")
@RequiredArgsConstructor
public class FacultadController {

    private final ConfiguracionFacade configuracionFacade;

    @GetMapping
    public ResponseEntity<?> listarFacultades() {
        return ResponseEntity.ok(configuracionFacade.listarFacultades());
    }

    @PostMapping
    public ResponseEntity<?> crearFacultad(@RequestBody FacultadRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(configuracionFacade.crearFacultad(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarFacultad(@PathVariable Long id, @RequestBody FacultadRequest request) {
        return ResponseEntity.ok(configuracionFacade.actualizarFacultad(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarFacultad(@PathVariable Long id) {
        configuracionFacade.eliminarFacultad(id);
        return ResponseEntity.noContent().build();
    }
}
