package co.edu.sistema_practicas_empresariales.modules.empresa.event;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import org.springframework.context.ApplicationEvent;

/**
 * Evento publicado cuando una empresa es registrada en el sistema.
 * Patrón Observer.
 */
public class EmpresaRegistradaEvent extends ApplicationEvent {
    private final Empresa empresa;
    private final String passwordTemporal;

    public EmpresaRegistradaEvent(Object source, Empresa empresa, String passwordTemporal) {
        super(source);
        this.empresa = empresa;
        this.passwordTemporal = passwordTemporal;
    }

    public Empresa getEmpresa() { return empresa; }
    public String getPasswordTemporal() { return passwordTemporal; }
}
