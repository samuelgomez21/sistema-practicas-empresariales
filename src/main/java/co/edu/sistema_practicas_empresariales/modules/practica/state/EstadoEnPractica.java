package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoEnPractica implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        throw new IllegalStateException("La práctica ya está activa.");
    }

    @Override
    public void registrarConvenio(Practica practica) {
        throw new IllegalStateException("El convenio ya fue registrado.");
    }

    @Override
    public void activarPractica(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra activa.");
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        practica.setNotaFinal(nota);
    }

    @Override
    public void ejecutarCierre(Practica practica, BigDecimal notaMinima) {
        if (practica.getNotaFinal() == null) {
            throw new IllegalStateException("No se puede realizar el cierre formal sin registrar previamente la nota final.");
        }
        if (practica.getNotaFinal().compareTo(notaMinima) >= 0) {
            practica.setEstado(EstadoPracticaTipo.COMPLETADA);
            practica.setResultado("APROBADO");
        } else {
            practica.setEstado(EstadoPracticaTipo.REPROBADA);
            practica.setResultado("REPROBADO");
        }
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        throw new IllegalStateException("No se puede cancelar una práctica que ya está en curso.");
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.EN_PRACTICA;
    }
}
