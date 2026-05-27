package co.edu.sistema_practicas_empresariales.modules.estudiante.event;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.context.ApplicationEvent;

/**
 * Evento publicado cuando un estudiante es registrado exitosamente.
 * Patrón Observer: permite que los listeners (auditoría, notificaciones)
 * reaccionen sin acoplar el servicio de negocio a ellos.
 */
public class EstudianteRegistradoEvent extends ApplicationEvent {
    private final Estudiante estudiante;

    public EstudianteRegistradoEvent(Object source, Estudiante estudiante) {
        super(source);
        this.estudiante = estudiante;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }
}
