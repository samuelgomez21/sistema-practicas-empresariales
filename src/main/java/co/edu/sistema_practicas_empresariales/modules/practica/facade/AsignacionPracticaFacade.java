package co.edu.sistema_practicas_empresariales.modules.practica.facade;

/**
 * Patrn Facade: Coordina la asignacin de estudiantes a vacantes o prǭcticas.
 */
public interface AsignacionPracticaFacade {
    void asignarEstudiante(Long estudianteId, Long vacanteId);
}
