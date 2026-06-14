package co.edu.sistema_practicas_empresariales.modules.reporte.controller;

import co.edu.sistema_practicas_empresariales.modules.reporte.dto.*;
import co.edu.sistema_practicas_empresariales.modules.reporte.service.ReporteFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para los reportes del sistema.
 * Patrón Facade: delega toda la lógica a ReporteService.
 */
@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteFacade reporteFacade;

    /**
     * Reporte de estado del proceso por programa y periodo.
     * Filtros opcionales: programaId, facultadId, periodo, numeroPractica
     */
    @GetMapping("/estado-proceso")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<ReporteEstadoProcesoDto>> estadoProceso(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) Long facultadId,
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) Integer numeroPractica) {
        return ResponseEntity.ok(
                reporteFacade.reporteEstadoProceso(programaId, facultadId, periodo, numeroPractica)
        );
    }

    /**
     * Reporte de notas registradas.
     * Filtros: programaId, periodo, docenteId, empresaId, resultado
     */
    @GetMapping("/notas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<ReporteNotasDto>> notas(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) Long docenteId,
            @RequestParam(required = false) Long empresaId,
            @RequestParam(required = false) String resultado) {
        return ResponseEntity.ok(
                reporteFacade.reporteNotas(programaId, periodo, docenteId, empresaId, resultado)
        );
    }

    /**
     * Reporte de empresas y vacantes.
     * Filtros: sector, programaId, periodo
     */
    @GetMapping("/empresas-vacantes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<ReporteEmpresaVacanteDto>> empresasVacantes(
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo) {
        return ResponseEntity.ok(
                reporteFacade.reporteEmpresasVacantes(sector, programaId, periodo)
        );
    }

    /**
     * Reporte consolidado de encuestas de satisfacción.
     * Filtros: programaId, periodo, tipo (ESTUDIANTE | TUTOR)
     */
    @GetMapping("/encuestas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','COORDINADOR_ACADEMICO')")
    public ResponseEntity<ReporteEncuestasDto> encuestas(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) String tipo) {
        return ResponseEntity.ok(
                reporteFacade.reporteEncuestas(programaId, periodo, tipo)
        );
    }
}