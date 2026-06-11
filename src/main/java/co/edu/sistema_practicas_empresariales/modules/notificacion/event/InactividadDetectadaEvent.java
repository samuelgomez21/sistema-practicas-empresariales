package co.edu.sistema_practicas_empresariales.modules.notificacion.event;

import org.springframework.context.ApplicationEvent;

/**
 * Patrn Observer: Evento de inactividad detectada.
 */
public class InactividadDetectadaEvent extends ApplicationEvent {
    public InactividadDetectadaEvent(Object source) {
        super(source);
    }
}
