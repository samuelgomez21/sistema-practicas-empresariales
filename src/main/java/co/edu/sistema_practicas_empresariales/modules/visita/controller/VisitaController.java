package co.edu.sistema_practicas_empresariales.modules.visita.controller;

import co.edu.sistema_practicas_empresariales.modules.visita.dto.VisitaDto;
import co.edu.sistema_practicas_empresariales.modules.visita.request.RegistrarVisitaRequest;
import co.edu.sistema_practicas_empresariales.modules.visita.service.VisitaFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * Controlador REST para el módulo de Visitas a empresas.
 * Patrón Facade: delega toda la lógica a VisitaFacade.
 */
@RestController
@RequestMapping("/api/visitas")
@RequiredArgsConstructor
public class VisitaController {

    private final VisitaFacade visitaFacade;

    /**
     * Lista todas las visitas — para coordinador.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<List<VisitaDto>> listarTodas() {
        return ResponseEntity.ok(visitaFacade.listarTodas());
    }

    /**
     * Lista las visitas del usuario autenticado — docente o coordinador.
     */
    @GetMapping("/mis-visitas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR')")
    public ResponseEntity<List<VisitaDto>> misVisitas(Principal principal) {
        return ResponseEntity.ok(visitaFacade.listarMias(principal.getName()));
    }

    /**
     * Lista visitas por empresa.
     */
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR')")
    public ResponseEntity<List<VisitaDto>> porEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(visitaFacade.listarPorEmpresa(empresaId));
    }

    /**
     * Registra una nueva visita.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR')")
    public ResponseEntity<VisitaDto> registrar(
            @RequestBody @Valid RegistrarVisitaRequest request,
            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(visitaFacade.registrar(request, principal.getName()));
    }

    /**
     * Elimina (borrado lógico) una visita.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Principal principal) {
        visitaFacade.eliminar(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}