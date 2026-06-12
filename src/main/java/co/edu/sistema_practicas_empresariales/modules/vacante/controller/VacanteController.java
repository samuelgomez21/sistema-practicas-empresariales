package co.edu.sistema_practicas_empresariales.modules.vacante.controller;

import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.service.VacanteFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el módulo de Vacantes.
 * <p>
 * Facilita la creación, aprobación, rechazo y cierre de vacantes publicadas por
 * las empresas. Implementa reglas estrictas basadas en roles.
 * <p>
 * <b>Roles y Permisos:</b> Las empresas crean vacantes, la coordinación las
 * aprueba/rechaza.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link VacanteFacade}).
 * Este controlador recibe las peticiones, valida roles y delega la ejecución,
 * ocultando la complejidad del patrón State que opera bajo el capó.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/vacantes")
@RequiredArgsConstructor
public class VacanteController {

    private final VacanteFacade vacanteFacade;

    /**
     * Permite a una empresa registrar una nueva vacante para estudiantes.
     * 
     * @param request Datos de la vacante.
     * @return VacanteResponse con estado 201 Created.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('EMPRESA_VINCULADA', 'ADMINISTRADOR')")
    public ResponseEntity<VacanteResponse> crearVacante(@RequestBody VacanteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vacanteFacade.crearVacante(request));
    }

    /**
     * Lista todas las vacantes publicadas por una empresa específica.
     * 
     * @param empresaId ID de la empresa.
     * @return Lista de vacantes de la empresa.
     */
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('EMPRESA_VINCULADA', 'ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<VacanteResponse>> listarVacantesPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(vacanteFacade.listarVacantesPorEmpresa(empresaId));
    }

    /**
     * Lista todas las vacantes que están en estado PENDIENTE, para ser revisadas.
     * 
     * @return Lista de vacantes pendientes de aprobación.
     */
    @GetMapping("/pendientes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<VacanteResponse>> listarVacantesPendientes() {
        return ResponseEntity.ok(vacanteFacade.listarVacantesPendientes());
    }

    /**
     * Aprueba una vacante, permitiendo que reciba postulaciones (Patrón State).
     * 
     * @param vacanteId ID de la vacante.
     * @return VacanteResponse con el nuevo estado APROBADA.
     */
    @PutMapping("/{vacanteId}/aprobar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<VacanteResponse> aprobarVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(vacanteFacade.aprobarVacante(vacanteId));
    }

    /**
     * Rechaza una vacante, indicando un motivo.
     * 
     * @param vacanteId ID de la vacante.
     * @param body      Mapa que contiene el motivo de rechazo.
     * @return VacanteResponse con el nuevo estado RECHAZADA.
     */
    @PutMapping("/{vacanteId}/rechazar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<VacanteResponse> rechazarVacante(
            @PathVariable Long vacanteId,
            @RequestBody Map<String, String> body) {

        String motivo = body.getOrDefault("motivo", "No especificado");
        return ResponseEntity.ok(vacanteFacade.rechazarVacante(vacanteId, motivo));
    }

    /**
     * Cierra una vacante, bloqueando la recepción de nuevas postulaciones (Patrón
     * State).
     * 
     * @param vacanteId ID de la vacante.
     * @return VacanteResponse con el nuevo estado CERRADA.
     */
    @PutMapping("/{vacanteId}/cerrar")
    @PreAuthorize("hasAnyRole('EMPRESA_VINCULADA', 'ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<VacanteResponse> cerrarVacante(@PathVariable Long vacanteId) {
        return ResponseEntity.ok(vacanteFacade.cerrarVacante(vacanteId));
    }
}
