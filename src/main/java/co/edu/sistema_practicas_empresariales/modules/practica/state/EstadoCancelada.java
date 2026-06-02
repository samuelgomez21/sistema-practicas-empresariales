package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoCancelada implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra cancelada.");
    }

    @Override
    public void registrarConvenio(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra cancelada.");
    }

    @Override
    public void activarPractica(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra cancelada.");
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        throw new IllegalStateException("La práctica ya se encuentra cancelada.");
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        throw new IllegalStateException("La práctica ya se encuentra cancelada.");
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.CANCELADA;
    }
}
