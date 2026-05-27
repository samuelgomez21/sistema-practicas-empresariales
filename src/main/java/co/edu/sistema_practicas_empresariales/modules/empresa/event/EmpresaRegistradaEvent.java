package co.edu.sistema_practicas_empresariales.modules.empresa.event;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import org.springframework.context.ApplicationEvent;

/**
 * Evento publicado cuando una empresa es registrada en el sistema.
 * Patrón Observer.
 */
public class EmpresaRegistradaEvent extends ApplicationEvent {
    private final Empresa empresa;

    public EmpresaRegistradaEvent(Object source, Empresa empresa) {
        super(source);
        this.empresa = empresa;
    }

    public Empresa getEmpresa() { return empresa; }
}
