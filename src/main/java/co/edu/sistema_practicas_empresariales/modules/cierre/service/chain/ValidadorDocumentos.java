package co.edu.sistema_practicas_empresariales.modules.cierre.service.chain;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValidadorDocumentos implements ValidadorCierreHandler {

    private final PracticaFacade practicaFacade;
    private ValidadorCierreHandler next;

    @Override
    public void setNext(ValidadorCierreHandler next) {
        this.next = next;
    }

    @Override
    public void validar(Practica practica) {
        if (!practicaFacade.tienePazYSalvo(practica.getId())) {
            throw new IllegalStateException("La práctica no tiene el Paz y Salvo (Checklist incompleto).");
        }
        if (next != null) {
            next.validar(practica);
        }
    }
}
