package co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.util.List;

public class DocumentosCompletosStrategy implements RequisitoValidationStrategy {

    @Override
    public boolean validar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial) {
        if (requisito == null || requisito.getDocumentosRequeridos() == null || requisito.getDocumentosRequeridos().isBlank()) {
            return true;
        }
        String docs = requisito.getDocumentosRequeridos().toUpperCase();
        if (docs.contains("HOJA_DE_VIDA")) {
            if (estudiante.getDocumentoHojaVidaUrl() == null || estudiante.getDocumentoHojaVidaUrl().isBlank()) {
                return false;
            }
        }
        if (docs.contains("PAZ_Y_SALVO")) {
            if (estudiante.getDocumentoPazSalvoUrl() == null || estudiante.getDocumentoPazSalvoUrl().isBlank()) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String getMensajeError(Estudiante estudiante, ProgramaRequisito requisito) {
        StringBuilder sb = new StringBuilder("Faltan documentos base requeridos: ");
        String docs = requisito.getDocumentosRequeridos().toUpperCase();
        boolean first = true;
        if (docs.contains("HOJA_DE_VIDA") && (estudiante.getDocumentoHojaVidaUrl() == null || estudiante.getDocumentoHojaVidaUrl().isBlank())) {
            sb.append("Hoja de Vida");
            first = false;
        }
        if (docs.contains("PAZ_Y_SALVO") && (estudiante.getDocumentoPazSalvoUrl() == null || estudiante.getDocumentoPazSalvoUrl().isBlank())) {
            if (!first) sb.append(", ");
            sb.append("Paz y Salvo");
        }
        sb.append(".");
        return sb.toString();
    }
}
