package co.edu.sistema_practicas_empresariales.modules.cierre.service.chain;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ValidadorNotaDocente implements ValidadorCierreHandler {

    private ValidadorCierreHandler next;

    @Override
    public void setNext(ValidadorCierreHandler next) {
        this.next = next;
    }

    @Override
    public void validar(Practica practica) {
        if (practica.getNotaFinal() == null || practica.getNotaFinal().compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalStateException("La práctica no tiene nota final registrada.");
        }
        if (next != null) {
            next.validar(practica);
        }
    }
}
