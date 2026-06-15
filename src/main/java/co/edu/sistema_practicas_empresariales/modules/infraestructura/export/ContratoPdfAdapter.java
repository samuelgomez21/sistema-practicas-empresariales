package co.edu.sistema_practicas_empresariales.modules.infraestructura.export;

import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

/**
 * Adaptador para la generación de Contratos en PDF usando iText y plantillas HTML.
 */
@Component
public class ContratoPdfAdapter implements GeneradorDocumentoPlantilla {

    @Override
    public byte[] generarDesdePlantilla(String rutaPlantilla, Map<String, Object> variables) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            String htmlTemplate = buildHtmlTemplate(variables);
            HtmlConverter.convertToPdf(htmlTemplate, out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Error al generar el contrato PDF: " + e.getMessage(), e);
        }
    }

    private String buildHtmlTemplate(Map<String, Object> vars) {
        String empresa = getString(vars, "empresa_nombre");
        String tutor = getString(vars, "tutor_nombre");
        String estudiante = getString(vars, "estudiante_nombre");
        String semestre = getString(vars, "semestre_estudiante", "último");
        String programa = getString(vars, "programa_academico", "Programa Académico");
        String nitEmpresa = getString(vars, "empresa_nit", "NIT Desconocido");
        String cedulaTutor = getString(vars, "tutor_cedula", "Cédula Desconocida");
        String cedulaEstudiante = getString(vars, "estudiante_cedula", "Cédula Desconocida");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'de' MMMM 'del año' yyyy", Locale.of("es", "ES"));
        String fechaActual = LocalDate.now().format(formatter);

        return "<html><body style='font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; text-align: justify; margin: 40px;'>" +
            "<h2 style='text-align: center;'>CONVENIO ESPECÍFICO PARA LA PRÁCTICA<br/>" +
            "SUSCRITO ENTRE LA CORPORACIÓN UNIVERSITARIA EMPRESARIAL ALEXANDER VON HUMBOLDT, " +
            "LA EMPRESA " + empresa + " Y LA ESTUDIANTE " + estudiante + "</h2>" +
            "<p>Entre la <b>CORPORACIÓN UNIVERSITARIA EMPRESARIAL ALEXANDER VON HUMBOLDT</b>, Institución Universitaria sin ánimo de lucro, de derecho privado, de utilidad común, de carácter académico, con personería jurídica otorgada por el Ministerio de Educación Nacional mediante Resolución 439 del 14 de marzo de 2001, registrada en el Instituto Colombiano para el Fomento de la Educación Superior, ICFES, bajo el número 2840, con NIT 801.003.135-5, domiciliada en la ciudad de Armenia, representada legalmente por su Rector, el Señor <b>DIEGO FERNANDO JARAMILLO LOPEZ</b>, mayor de edad, domiciliado en la misma ciudad e identificado con la cédula de ciudadanía Número 7,503,178 expedida en Armenia, Quindío, que en adelante se denominará <b>LA CORPORACIÓN</b>, de una parte y la empresa <b>" + empresa + "</b>, identificada con el Nit <b>" + nitEmpresa + "</b> representada legalmente por el señor(a) <b>" + tutor + "</b>, mayor de edad, identificado(a) con la cédula de ciudadanía No. <b>" + cedulaTutor + "</b>; que en adelante se denominará <b>LA EMPRESA FORMADORA</b>; y <b>" + estudiante + "</b> estudiante matriculado en el <b>" + semestre + " semestre</b>, del programa de <b>" + programa + "</b>, identificado con cédula de ciudadanía número <b>" + cedulaEstudiante + "</b>, quien en adelante se denominará <b>EL ESTUDIANTE</b>, hemos decidido acordar el presente Convenio Específico para el desarrollo de la práctica.</p>" +
            "<h3>CLÁUSULAS</h3>" +
            "<p><b>CLÁUSULA PRIMERA: Objeto.</b> El presente convenio, tiene como objeto, permitir la realización de las práctica al <b>ESTUDIANTE</b>, de <b>LA CORPORACIÓN</b>, la cual se llevará a cabo en las instalaciones de <b>LA EMPRESA FORMADORA</b>, durante los semestres académicos que dure éste convenio; la formación de la práctica es requisito indispensable para la aprobación del programa académico del estudiante y durante ella, desarrollará funciones concretas relacionadas con el área de formación y que demanden el ejercicio de la capacidad teórica y práctica en el programa de estudio, en las distintas áreas de su formación.</p>" +
            "<p><b>CLÁUSULA SEGUNDA: Valor.</b> <b>LA EMPRESA FORMADORA</b> reconocerá <b>AL ESTUDIANTE</b> bajo total voluntad un apoyo de sostenimiento económico por valor de <b>" + getString(vars, "salario", "$0") + "</b> mensuales, el cual no constituye salario, ni puede ser regulado a través de convenios, contratos colectivos o fallos arbitrales y no genera vínculo laboral alguno, ni obligación de continuidad para <b>LA EMPRESA FORMADORA</b> con respecto al estudiante.</p>" +
            "<p><b>CLÁUSULA QUINTA: Duración del convenio.</b> Este Convenio específico para la práctica, inicia a partir del <b>" + getString(vars, "fecha_inicio", "[Fecha Inicio]") + "</b> y finaliza el <b>" + getString(vars, "fecha_fin", "[Fecha Fin]") + "</b>.</p>" +
            "<br/><br/><p>Para constancia de lo anterior se firma a los " + fechaActual + ".</p>" +
            "<br/><br/><br/><br/>" +
            "<table style='width: 100%; text-align: left;'>" +
            "<tr>" +
            "<td>_______________________________<br/><b>LA CORPORACIÓN</b></td>" +
            "<td>_______________________________<br/><b>LA EMPRESA FORMADORA</b></td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='2'><br/><br/><br/>_______________________________<br/><b>EL ESTUDIANTE</b></td>" +
            "</tr>" +
            "</table>" +
            "</body></html>";
    }

    private String getString(Map<String, Object> variables, String key) {
        Object val = variables.get(key);
        return val != null ? val.toString() : "[No Definido]";
    }

    private String getString(Map<String, Object> variables, String key, String def) {
        Object val = variables.get(key);
        return val != null ? val.toString() : def;
    }
}
