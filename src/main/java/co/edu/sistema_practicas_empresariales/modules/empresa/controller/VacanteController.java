package co.edu.sistema_practicas_empresariales.modules.empresa.controller;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.VacanteResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.service.EmpresaFacade;
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

    private final EmpresaFacade empresaFacade;

    @PostMapping
    public ResponseEntity<VacanteResponse> crearVacante(@RequestBody VacanteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaFacade.crearVacante(request));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<VacanteResponse>> listarVacantesPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaFacade.listarVacantesPorEmpresa(empresaId));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<VacanteResponse>> listarVacantesPendientes() {
        return ResponseEntity.ok(empresaFacade.listarVacantesPendientes());
    }

    @PutMapping("/{vacanteId}/aprobar")
    public ResponseEntity<VacanteResponse> aprobarVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(empresaFacade.aprobarVacante(vacanteId));
    }

    @PutMapping("/{vacanteId}/rechazar")
    public ResponseEntity<VacanteResponse> rechazarVacante(
            @PathVariable Long vacanteId, 
            @RequestBody Map<String, String> body) {
        
        String motivo = body.getOrDefault("motivo", "No especificado");
        return ResponseEntity.ok(empresaFacade.rechazarVacante(vacanteId, motivo));
    }

    @PutMapping("/{vacanteId}/cerrar")
    public ResponseEntity<VacanteResponse> cerrarVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(empresaFacade.cerrarVacante(vacanteId));
    }
}
