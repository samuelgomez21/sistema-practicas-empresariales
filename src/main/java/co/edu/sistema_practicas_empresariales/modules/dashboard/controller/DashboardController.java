package co.edu.sistema_practicas_empresariales.modules.dashboard.controller;

import co.edu.sistema_practicas_empresariales.modules.dashboard.dto.DashboardEstadisticasDto;
import co.edu.sistema_practicas_empresariales.modules.dashboard.service.DashboardFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el panel de inicio (Dashboard).
 * <p>
 * <b>Roles y Permisos:</b> Las estadísticas generales están disponibles para roles 
 * administrativos y de coordinación.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link DashboardFacade}).
 * Delega la consolidación de métricas a la fachada, manteniendo el controlador limpio.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardFacade dashboardFacade;

    /**
     * Obtiene el consolidado de estadísticas principales del sistema.
     * Permitido para Administradores, Coordinadores y Directores.
     *
     * @return Objeto DashboardEstadisticasDto con contadores de entidades principales.
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<DashboardEstadisticasDto> obtenerEstadisticas() {
        return ResponseEntity.ok(dashboardFacade.obtenerEstadisticas());
    }
}
