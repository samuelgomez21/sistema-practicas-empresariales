package co.edu.sistema_practicas_empresariales.modules.infraestructura.export;

import co.edu.sistema_practicas_empresariales.modules.reporte.builder.ReporteBuilder.Reporte;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Component
public class PdfExportAdapter implements ExportadorReporte {

    @Override
    public byte[] exportar(Reporte reporte) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document doc = new Document(pdf);

            // Título
            doc.add(new Paragraph(reporte.getTitulo()).setFontSize(18).setBold());
            doc.add(new Paragraph(" "));

            // Filtros
            if (reporte.getFiltros() != null && !reporte.getFiltros().isEmpty()) {
                doc.add(new Paragraph("Filtros Aplicados:").setBold().setItalic());
                for (Map.Entry<String, String> entry : reporte.getFiltros().entrySet()) {
                    doc.add(new Paragraph(entry.getKey() + ": " + entry.getValue()));
                }
                doc.add(new Paragraph(" "));
            }

            // Crear tabla con anchos proporcionales
            List<String> headers = reporte.getHeaders();
            int numColumns = headers.size();
            float[] columnWidths = new float[numColumns];
            for (int i = 0; i < numColumns; i++) {
                columnWidths[i] = 1f; // Todos de ancho proporcional igual
            }
            
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Cabeceras
            for (String header : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
            }

            // Filas
            for (List<Object> fila : reporte.getFilas()) {
                for (Object val : fila) {
                    table.addCell(new Cell().add(new Paragraph(val != null ? val.toString() : "")));
                }
            }

            // Totales
            if (reporte.getTotales() != null && !reporte.getTotales().isEmpty()) {
                for (Object total : reporte.getTotales()) {
                    table.addCell(new Cell().add(new Paragraph(total != null ? total.toString() : "").setBold()));
                }
            }

            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Error al exportar reporte a PDF: " + e.getMessage(), e);
        }
    }
}
