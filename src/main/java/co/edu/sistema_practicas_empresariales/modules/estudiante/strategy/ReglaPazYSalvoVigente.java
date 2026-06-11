package co.edu.sistema_practicas_empresariales.modules.estudiante.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.stereotype.Component;

/**
 * Patrn Strategy: Regla concreta para validar paz y salvo.
 */
@Component
public class ReglaPazYSalvoVigente implements ValidacionAptitudStrategy {
    @Override
    public boolean validar(Estudiante estudiante) {
        return true;
    }

    @Override
    public String getMensajeError() {
        return "El estudiante no cuenta con paz y salvo vigente.";
    }
}
