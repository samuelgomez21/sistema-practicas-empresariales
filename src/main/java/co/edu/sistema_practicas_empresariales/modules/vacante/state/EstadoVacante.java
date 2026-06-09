package co.edu.sistema_practicas_empresariales.modules.vacante.state;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;

public interface EstadoVacante {
    
    EstadoVacanteTipo getTipo();
    
    void aprobar(Vacante vacante);
    
    void rechazar(Vacante vacante, String motivo);
    
    void cerrar(Vacante vacante);

    /**
     * Valida si el estado actual permite que un estudiante sea asignado a la vacante.
     * @return true si permite asignaciones, false en caso contrario.
     */
    boolean permiteAsignaciones();

    /**
     * Intenta asignar un estudiante (o recibir una postulación) a la vacante.
     * Si el estado no lo permite, arrojará una excepción.
     *
     * @param vacante La vacante sobre la que se realiza la acción.
     */
    void asignarEstudiante(Vacante vacante);
}
