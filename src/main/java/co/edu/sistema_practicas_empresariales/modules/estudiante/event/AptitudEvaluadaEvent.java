package co.edu.sistema_practicas_empresariales.modules.estudiante.event;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.context.ApplicationEvent;

/**
 * Evento publicado cuando la Coordinación Académica evalúa la aptitud de un estudiante.
 * Patrón Observer: desacopla el servicio de aptitud de los observadores de auditoría y notificación.
 */
public class AptitudEvaluadaEvent extends ApplicationEvent {
    private final Estudiante estudiante;
    private final boolean apto;
    private final String motivo;

    public AptitudEvaluadaEvent(Object source, Estudiante estudiante, boolean apto, String motivo) {
        super(source);
        this.estudiante = estudiante;
        this.apto = apto;
        this.motivo = motivo;
    }

    public Estudiante getEstudiante() { return estudiante; }
    public boolean isApto() { return apto; }
    public String getMotivo() { return motivo; }
}
