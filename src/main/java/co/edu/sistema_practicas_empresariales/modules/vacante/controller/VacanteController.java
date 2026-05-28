package co.edu.sistema_practicas_empresariales.modules.vacante.controller;

import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.service.VacanteFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vacantes")
@RequiredArgsConstructor
public class VacanteController {

    private final VacanteFacade vacanteFacade;

    @PostMapping
    public ResponseEntity<VacanteResponse> crearVacante(@RequestBody VacanteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vacanteFacade.crearVacante(request));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<VacanteResponse>> listarVacantesPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(vacanteFacade.listarVacantesPorEmpresa(empresaId));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<VacanteResponse>> listarVacantesPendientes() {
        return ResponseEntity.ok(vacanteFacade.listarVacantesPendientes());
    }

    @PutMapping("/{vacanteId}/aprobar")
    public ResponseEntity<VacanteResponse> aprobarVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(vacanteFacade.aprobarVacante(vacanteId));
    }

    @PutMapping("/{vacanteId}/rechazar")
    public ResponseEntity<VacanteResponse> rechazarVacante(
            @PathVariable Long vacanteId, 
            @RequestBody Map<String, String> body) {
        
        String motivo = body.getOrDefault("motivo", "No especificado");
        return ResponseEntity.ok(vacanteFacade.rechazarVacante(vacanteId, motivo));
    }

    @PutMapping("/{vacanteId}/cerrar")
    public ResponseEntity<VacanteResponse> cerrarVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(vacanteFacade.cerrarVacante(vacanteId));
    }
}
