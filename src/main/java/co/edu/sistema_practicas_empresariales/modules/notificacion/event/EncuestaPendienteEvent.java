package co.edu.sistema_practicas_empresariales.modules.notificacion.event;

import org.springframework.context.ApplicationEvent;

/**
 * Patrn Observer: Evento de encuesta pendiente.
 */
public class EncuestaPendienteEvent extends ApplicationEvent {
    public EncuestaPendienteEvent(Object source) {
        super(source);
    }
}
