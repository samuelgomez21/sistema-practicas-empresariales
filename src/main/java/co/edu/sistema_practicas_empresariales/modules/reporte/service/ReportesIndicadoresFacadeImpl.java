package co.edu.sistema_practicas_empresariales.modules.reporte.service;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.adapter.ExportAdapter;
import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.Reporte;
import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.ReporteBuilder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReportesIndicadoresFacadeImpl implements ReportesIndicadoresFacade {

    private final Map<String, ExportAdapter> exportAdapters;

    public ReportesIndicadoresFacadeImpl(List<ExportAdapter> adapters) {
        // Inyecta todos los adaptadores y los mapea por su extensión (ej: ".pdf", ".xlsx")
        this.exportAdapters = adapters.stream()
                .collect(Collectors.toMap(
                        adapter -> adapter.getExtension().replace(".", "").toLowerCase(),
                        Function.identity()
                ));
    }

    @Override
    public Reporte generarReportePracticas(String formato) {
        // En un caso real se consultarían datos complejos.
        // Usamos el patrón Builder para construir el objeto del reporte.
        return new ReporteBuilder()
                .conTitulo("Reporte General de Prácticas Empresariales")
                .generadoPor("Sistema Automatizado")
                .conColumnas(List.of("ID", "Estudiante", "Empresa", "Estado"))
                .conFilas(new ArrayList<>())
                .construir();
    }

    @Override
    public byte[] exportarReporte(Reporte reporte, String formato) {
        ExportAdapter adapter = exportAdapters.get(formato.toLowerCase());
        if (adapter == null) {
            throw new IllegalArgumentException("Formato no soportado: " + formato);
        }
        return adapter.exportar(reporte);
    }

    @Override
    public String getContentType(String formato) {
        ExportAdapter adapter = exportAdapters.get(formato.toLowerCase());
        return adapter != null ? adapter.getContentType() : "application/octet-stream";
    }
}
