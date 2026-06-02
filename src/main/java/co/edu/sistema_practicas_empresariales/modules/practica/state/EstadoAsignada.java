package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoAsignada implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        practica.setEstado(EstadoPracticaTipo.EN_PROCESO_VINCULACION);
    }

    @Override
    public void registrarConvenio(Practica practica) {
        throw new IllegalStateException("No se puede registrar el convenio en estado ASIGNADA. Debe iniciar vinculación primero.");
    }

    @Override
    public void activarPractica(Practica practica) {
        throw new IllegalStateException("No se puede activar la práctica en estado ASIGNADA.");
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        throw new IllegalStateException("No se puede registrar nota final en estado ASIGNADA.");
    }

    @Override
    public void ejecutarCierre(Practica practica, BigDecimal notaMinima) {
        throw new IllegalStateException("No se puede realizar el cierre formal en estado ASIGNADA.");
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        practica.setEstado(EstadoPracticaTipo.CANCELADA);
        // Opcional: guardar motivo de cancelación en la práctica o auditoría
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.ASIGNADA_PENDIENTE_INICIO;
    }
}
