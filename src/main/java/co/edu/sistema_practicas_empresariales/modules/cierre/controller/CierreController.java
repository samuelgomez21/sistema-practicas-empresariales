package co.edu.sistema_practicas_empresariales.modules.cierre.controller;

import co.edu.sistema_practicas_empresariales.modules.cierre.dto.CierreDto;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.CierreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cierre")
@RequiredArgsConstructor
public class CierreController {

    private final CierreService cierreService;

    /**
     * Verifica qué falta para poder cerrar — sin ejecutar el cierre.
     * El coordinador puede consultar esto antes de ejecutar.
     */
    @GetMapping("/practica/{practicaId}/verificar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA')")
    public ResponseEntity<CierreDto> verificar(@PathVariable Long practicaId) {
        return ResponseEntity.ok(cierreService.verificarEstadoCierre(practicaId));
    }

    /**
     * Ejecuta el cierre formal de la práctica.
     * Patrón Facade: un solo endpoint coordina todo el proceso.
     * Si falta algún requisito retorna 200 con exitoso=false
     * y el detalle de qué falta — no lanza excepción.
     */
    @PostMapping("/practica/{practicaId}/ejecutar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<CierreDto> ejecutar(@PathVariable Long practicaId) {
        return ResponseEntity.ok(cierreService.ejecutarCierre(practicaId));
    }
}