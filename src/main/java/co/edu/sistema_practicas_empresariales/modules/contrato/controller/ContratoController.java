package co.edu.sistema_practicas_empresariales.modules.contrato.controller;

import co.edu.sistema_practicas_empresariales.modules.contrato.dto.*;
import co.edu.sistema_practicas_empresariales.modules.contrato.service.ContratoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con la entidad Contrato.
 * Maneja las peticiones HTTP y orquesta la respuesta delegando la lógica de negocio al servicio o facade correspondiente.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/contratos")
@RequiredArgsConstructor
public class ContratoController {

    private final ContratoService contratoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<ContratoResponse>> listarTodos() {
        return ResponseEntity.ok(contratoService.listarTodos());
    }

    @PostMapping("/generar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<ContratoResponse> generar(@RequestBody ContratoRequest request) {
        return ResponseEntity.ok(contratoService.generarContrato(request));
    }

    @GetMapping("/empresas-disponibles")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<Map<String, Object>>> empresasConSeleccionados() {
        return ResponseEntity.ok(contratoService.getEmpresasConSeleccionados());
    }
}