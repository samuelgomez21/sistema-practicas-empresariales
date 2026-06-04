package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoCompletada implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra completada.");
    }

    @Override
    public void registrarConvenio(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra completada.");
    }

    @Override
    public void activarPractica(Practica practica) {
        throw new IllegalStateException("La práctica ya se encuentra completada.");
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        throw new IllegalStateException("La práctica ya está cerrada y completada, no se puede cambiar la nota.");
    }

    @Override
    public void ejecutarCierre(Practica practica, BigDecimal notaMinima) {
        throw new IllegalStateException("La práctica ya se encuentra cerrada y completada.");
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        throw new IllegalStateException("No se puede cancelar una práctica completada.");
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.COMPLETADA;
    }
}
