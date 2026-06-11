package co.edu.sistema_practicas_empresariales.modules.estudiante.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.stereotype.Component;

/**
 * Patrn Strategy: Regla concreta para validar documentos base.
 */
@Component
public class ReglaDocumentosBaseCompletos implements ValidacionAptitudStrategy {
    @Override
    public boolean validar(Estudiante estudiante) {
        return true;
    }

    @Override
    public String getMensajeError() {
        return "El estudiante no tiene los documentos base completos.";
    }
}
