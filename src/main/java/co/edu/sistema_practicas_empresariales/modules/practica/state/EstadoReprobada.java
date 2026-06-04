package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoReprobada implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra reprobada.");
    }

    @Override
    public void registrarConvenio(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra reprobada.");
    }

    @Override
    public void activarPractica(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra reprobada.");
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        throw new IllegalStateException("La práctica ya está cerrada y reprobada, no se puede cambiar la nota.");
    }

    @Override
    public void ejecutarCierre(Practica practica, BigDecimal notaMinima) {
        throw new IllegalStateException("La práctica ya se encuentra cerrada y reprobada.");
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        throw new IllegalStateException("No se puede cancelar una práctica reprobada.");
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.REPROBADA;
    }
}
