package co.edu.sistema_practicas_empresariales.modules.reporte.controller;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.ReportesIndicadoresFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReportesIndicadoresFacade reportesIndicadoresFacade;

    @GetMapping("/estado-proceso")
    public ResponseEntity<byte[]> descargarReporteEstadoProceso(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo,
            @RequestParam(defaultValue = "excel") String format) {

        byte[] data = reportesIndicadoresFacade.generarReporteEstadoProceso(programaId, periodo, format);
        String filename = "EstadoProceso_" + (periodo != null ? periodo : "General") + "_" + getFechaActualStr();
        
        return construirFileResponse(data, format, filename);
    }

    @GetMapping("/notas")
    public ResponseEntity<byte[]> descargarReporteNotas(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo,
            @RequestParam(defaultValue = "excel") String format) {

        byte[] data = reportesIndicadoresFacade.generarReporteNotas(programaId, periodo, format);
        String filename = "ReporteNotas_" + (periodo != null ? periodo : "General") + "_" + getFechaActualStr();

        return construirFileResponse(data, format, filename);
    }

    @GetMapping("/empresas-vacantes")
    public ResponseEntity<byte[]> descargarReporteEmpresasVacantes(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo) {

        byte[] data = reportesIndicadoresFacade.generarReporteEmpresasVacantes(programaId, periodo);
        String filename = "EmpresasVacantes_" + (periodo != null ? periodo : "General") + "_" + getFechaActualStr();

        return construirFileResponse(data, "excel", filename);
    }

    @GetMapping("/encuestas")
    public ResponseEntity<byte[]> descargarReporteEncuestas(
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) String periodo) {

        byte[] data = reportesIndicadoresFacade.generarReporteEncuestas(programaId, periodo);
        String filename = "ReporteEncuestas_" + (periodo != null ? periodo : "General") + "_" + getFechaActualStr();

        return construirFileResponse(data, "excel", filename);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> obtenerDashboard(
            @RequestParam(required = false) String periodo,
            Principal principal) {
        
        Map<String, Object> data = reportesIndicadoresFacade.obtenerDashboardGerencial(periodo, null, principal.getName());
        return ResponseEntity.ok(data);
    }

    private ResponseEntity<byte[]> construirFileResponse(byte[] data, String format, String filename) {
        HttpHeaders headers = new HttpHeaders();
        if ("pdf".equalsIgnoreCase(format)) {
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename + ".pdf");
        } else {
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", filename + ".xlsx");
        }
        
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return ResponseEntity.ok().headers(headers).body(data);
    }

    private String getFechaActualStr() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    }
}
