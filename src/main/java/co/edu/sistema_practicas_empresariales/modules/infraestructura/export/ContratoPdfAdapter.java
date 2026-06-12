package co.edu.sistema_practicas_empresariales.modules.infraestructura.export;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.Map;

/**
 * Adaptador para la generación de Contratos en PDF usando iText.
 * NOTA: Cuando se tenga la plantilla final en AcroForm, se usará PdfAcroForm para rellenar campos.
 */
@Component
public class ContratoPdfAdapter implements GeneradorDocumentoPlantilla {

    @Override
    public byte[] generarDesdePlantilla(String rutaPlantilla, Map<String, Object> variables) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document doc = new Document(pdf);

            // Generación de un Contrato Provisional.
            // Esto reemplazará las variables sobre un diseño en código por ahora.
            doc.add(new Paragraph("CONTRATO DE PRÁCTICA EMPRESARIAL")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));
            
            doc.add(new Paragraph("\n"));

            doc.add(new Paragraph("Entre los suscritos a saber, de una parte la Universidad, y por la otra la empresa " 
                    + getString(variables, "empresa_nombre") + ", representada por " + getString(variables, "tutor_nombre") 
                    + ", acuerdan celebrar el presente contrato de práctica para el estudiante " 
                    + getString(variables, "estudiante_nombre") + ".\n")
                    .setTextAlignment(TextAlignment.JUSTIFIED));

            doc.add(new Paragraph("CLÁUSULAS")
                    .setFontSize(14)
                    .setBold());

            doc.add(new Paragraph("PRIMERA: El estudiante se desempeñará en el área de " 
                    + getString(variables, "vacante_area") + " bajo la modalidad " + getString(variables, "modalidad") + ".\n"
                    + "SEGUNDA: La fecha de inicio establecida es " + getString(variables, "fecha_inicio") + ".\n"
                    + "TERCERA: El salario / apoyo económico será de " + getString(variables, "salario") + ".\n")
                    .setTextAlignment(TextAlignment.JUSTIFIED));

            doc.add(new Paragraph("\n\n\n\n"));
            
            doc.add(new Paragraph("___________________________\nFirma Estudiante\n" + getString(variables, "estudiante_nombre")));
            doc.add(new Paragraph("\n\n"));
            doc.add(new Paragraph("___________________________\nFirma Tutor Empresarial\n" + getString(variables, "tutor_nombre")));

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Error al generar el contrato PDF: " + e.getMessage(), e);
        }
    }

    private String getString(Map<String, Object> variables, String key) {
        Object val = variables.get(key);
        return val != null ? val.toString() : "[No Definido]";
    }
}
