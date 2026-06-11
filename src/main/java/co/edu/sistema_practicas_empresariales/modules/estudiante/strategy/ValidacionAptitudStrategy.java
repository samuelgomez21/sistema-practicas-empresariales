package co.edu.sistema_practicas_empresariales.modules.estudiante.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;

/**
 * Patrn Strategy: Define una estrategia para validar la aptitud de un estudiante.
 */
public interface ValidacionAptitudStrategy {
    boolean validar(Estudiante estudiante);
    String getMensajeError();
}
