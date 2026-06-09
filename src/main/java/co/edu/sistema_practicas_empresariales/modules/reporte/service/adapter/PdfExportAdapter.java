package co.edu.sistema_practicas_empresariales.modules.reporte.service.adapter;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.Reporte;
import org.springframework.stereotype.Component;

@Component
public class PdfExportAdapter implements ExportAdapter {

    @Override
    public byte[] exportar(Reporte reporte) {
        // En una implementación real se usaría iText, Apache FOP o similar.
        // Simulamos la generación del PDF.
        String content = "PDF REPORT\nTitle: " + reporte.getTitulo() + "\n";
        return content.getBytes();
    }

    @Override
    public String getExtension() {
        return ".pdf";
    }

    @Override
    public String getContentType() {
        return "application/pdf";
    }
}
