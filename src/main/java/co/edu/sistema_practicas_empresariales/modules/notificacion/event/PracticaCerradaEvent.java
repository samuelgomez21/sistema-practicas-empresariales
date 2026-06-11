package co.edu.sistema_practicas_empresariales.modules.notificacion.event;

import org.springframework.context.ApplicationEvent;

/**
 * Patrn Observer: Evento de prctica cerrada.
 */
public class PracticaCerradaEvent extends ApplicationEvent {
    public PracticaCerradaEvent(Object source) {
        super(source);
    }
}
