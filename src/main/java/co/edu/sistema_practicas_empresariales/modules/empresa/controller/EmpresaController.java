package co.edu.sistema_practicas_empresariales.modules.empresa.controller;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.service.EmpresaFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaFacade empresaFacade;

    @PostMapping
    @PreAuthorize("hasRole('COORDINADOR_EMPRESARIAL')")
    public ResponseEntity<EmpresaResponse> registrarEmpresa(@RequestBody EmpresaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaFacade.registrarEmpresa(request));
    }

    @PostMapping("/{empresaId}/tutores")
    public ResponseEntity<TutorEmpresarialResponse> registrarTutor(
            @PathVariable Long empresaId,
            @RequestBody TutorEmpresarialRequest request) {
        
        request.setEmpresaId(empresaId);
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaFacade.registrarTutor(request));
    }
}
