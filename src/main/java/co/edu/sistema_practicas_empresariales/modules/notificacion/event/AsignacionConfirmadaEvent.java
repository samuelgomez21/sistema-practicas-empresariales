package co.edu.sistema_practicas_empresariales.modules.notificacion.event;

import org.springframework.context.ApplicationEvent;

/**
 * Patrn Observer: Evento de confirmacin de asignacin.
 */
public class AsignacionConfirmadaEvent extends ApplicationEvent {
    public AsignacionConfirmadaEvent(Object source) {
        super(source);
    }
}
