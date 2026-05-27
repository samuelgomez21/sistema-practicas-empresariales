package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoVinculada implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        throw new IllegalStateException("La práctica ya pasó por el proceso de vinculación.");
    }

    @Override
    public void registrarConvenio(Practica practica) {
        throw new IllegalStateException("El convenio ya está registrado y firmado.");
    }

    @Override
    public void activarPractica(Practica practica) {
        practica.setEstado(EstadoPracticaTipo.EN_PRACTICA);
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        throw new IllegalStateException("No se puede registrar nota final. La práctica aún no se ha activado ('En práctica').");
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        // Según RF-05-03: "Una asignación en estado 'Vinculada' no puede volver a estados anteriores."
        // Sin embargo, si se puede cancelar/abortar, depende de la regla de negocio. La regla RF-05-02 dice:
        // "Una asignación no puede cancelarse una vez iniciado formalmente el proceso de vinculación (RF-06-01)."
        throw new IllegalStateException("No se puede cancelar la práctica una vez formalizada la vinculación.");
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.VINCULADA;
    }
}
