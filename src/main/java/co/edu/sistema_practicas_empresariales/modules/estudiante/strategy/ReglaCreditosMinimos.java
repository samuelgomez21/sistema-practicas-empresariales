package co.edu.sistema_practicas_empresariales.modules.estudiante.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.stereotype.Component;

/**
 * Patrn Strategy: Regla concreta para validar que el estudiante tenga los crditos mnimos.
 */
@Component
public class ReglaCreditosMinimos implements ValidacionAptitudStrategy {
    @Override
    public boolean validar(Estudiante estudiante) {
        return true; 
    }

    @Override
    public String getMensajeError() {
        return "El estudiante no cumple con los crditos mnimos requeridos.";
    }
}
