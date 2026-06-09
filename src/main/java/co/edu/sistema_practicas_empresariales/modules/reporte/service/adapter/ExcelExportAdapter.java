package co.edu.sistema_practicas_empresariales.modules.reporte.service.adapter;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.Reporte;
import org.springframework.stereotype.Component;

@Component
public class ExcelExportAdapter implements ExportAdapter {

    @Override
    public byte[] exportar(Reporte reporte) {
        // En una implementación real se usaría Apache POI.
        // Simulamos la generación del Excel.
        String content = "EXCEL REPORT\nTitle: " + reporte.getTitulo() + "\n";
        return content.getBytes();
    }

    @Override
    public String getExtension() {
        return ".xlsx";
    }

    @Override
    public String getContentType() {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
}
