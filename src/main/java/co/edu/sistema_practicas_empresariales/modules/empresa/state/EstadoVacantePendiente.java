package co.edu.sistema_practicas_empresariales.modules.empresa.state;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Vacante;
import org.springframework.stereotype.Component;

@Component
public class EstadoVacantePendiente implements EstadoVacante {

    @Override
    public EstadoVacanteTipo getTipo() {
        return EstadoVacanteTipo.PENDIENTE;
    }

    @Override
    public void aprobar(Vacante vacante) {
        vacante.setEstado(EstadoVacanteTipo.APROBADA);
    }

    @Override
    public void rechazar(Vacante vacante, String motivo) {
        vacante.setEstado(EstadoVacanteTipo.RECHAZADA);
        vacante.setMotivoRechazo(motivo);
    }

    @Override
    public void cerrar(Vacante vacante) {
        throw new IllegalStateException("No se puede cerrar una vacante que aún está pendiente de aprobación");
    }
}
