package co.edu.sistema_practicas_empresariales.modules.reporte.controller;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.ReportesIndicadoresFacade;
import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.Reporte;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el módulo de Reportes e Indicadores.
 * <p>
 * Facilita la generación y exportación de reportes dinámicos del sistema.
 * <p>
 * <b>Roles y Permisos:</b> Sólo Administradores, Coordinadores de Práctica y
 * Dirección tienen acceso a estos reportes confidenciales.
 * <p>
 * <b>Patrones de Diseño aplicados:</b>
 * - Facade: {@link ReportesIndicadoresFacade}
 * - Builder: Para construir la estructura del reporte.
 * - Adapter: Para exportar en diferentes formatos (PDF, Excel).
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReportesIndicadoresFacade reportesFacade;

    /**
     * Genera y exporta un reporte general de prácticas.
     * @param formato "pdf" o "xlsx"
     */
    @GetMapping("/practicas/exportar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<byte[]> exportarReportePracticas(@RequestParam(defaultValue = "pdf") String formato) {
        Reporte reporte = reportesFacade.generarReportePracticas(formato);
        byte[] data = reportesFacade.exportarReporte(reporte, formato);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_practicas." + formato.toLowerCase())
                .contentType(MediaType.parseMediaType(reportesFacade.getContentType(formato)))
                .body(data);
    }
}
