package co.edu.sistema_practicas_empresariales.modules.estudiante.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.stereotype.Component;

/**
 * Patrn Strategy: Regla concreta para validar que el estudiante tenga el promedio mnimo.
 */
@Component
public class ReglaPromedioMinimo implements ValidacionAptitudStrategy {
    @Override
    public boolean validar(Estudiante estudiante) {
        return true; // Implementacin simulada
    }

    @Override
    public String getMensajeError() {
        return "El estudiante no cumple con el promedio mnimo requerido.";
    }
}
