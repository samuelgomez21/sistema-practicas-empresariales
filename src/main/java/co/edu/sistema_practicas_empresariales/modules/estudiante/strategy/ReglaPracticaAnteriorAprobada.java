package co.edu.sistema_practicas_empresariales.modules.estudiante.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.stereotype.Component;

/**
 * Patrn Strategy: Regla concreta para validar prctica anterior.
 */
@Component
public class ReglaPracticaAnteriorAprobada implements ValidacionAptitudStrategy {
    @Override
    public boolean validar(Estudiante estudiante) {
        return true;
    }

    @Override
    public String getMensajeError() {
        return "El estudiante reprob la prctica anterior.";
    }
}
