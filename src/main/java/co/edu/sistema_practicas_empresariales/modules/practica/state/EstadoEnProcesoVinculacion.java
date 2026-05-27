package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public class EstadoEnProcesoVinculacion implements EstadoPractica {

    @Override
    public void iniciarVinculacion(Practica practica) {
        throw new IllegalStateException("La práctica ya está en proceso de vinculación.");
    }

    @Override
    public void registrarConvenio(Practica practica) {
        practica.setEstado(EstadoPracticaTipo.VINCULADA);
    }

    @Override
    public void activarPractica(Practica practica) {
        throw new IllegalStateException("No se puede activar la práctica sin registrar y firmar el convenio primero.");
    }

    @Override
    public void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima) {
        throw new IllegalStateException("No se puede registrar nota final en estado de vinculación.");
    }

    @Override
    public void cancelar(Practica practica, String motivo) {
        practica.setEstado(EstadoPracticaTipo.CANCELADA);
    }

    @Override
    public EstadoPracticaTipo getTipo() {
        return EstadoPracticaTipo.EN_PROCESO_VINCULACION;
    }
}
