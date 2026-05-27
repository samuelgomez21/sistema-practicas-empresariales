package co.edu.sistema_practicas_empresariales.modules.empresa.state;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Vacante;
import org.springframework.stereotype.Component;

@Component
public class EstadoVacanteAprobada implements EstadoVacante {

    @Override
    public EstadoVacanteTipo getTipo() {
        return EstadoVacanteTipo.APROBADA;
    }

    @Override
    public void aprobar(Vacante vacante) {
        throw new IllegalStateException("La vacante ya se encuentra aprobada");
    }

    @Override
    public void rechazar(Vacante vacante, String motivo) {
        throw new IllegalStateException("No se puede rechazar una vacante que ya ha sido aprobada");
    }

    @Override
    public void cerrar(Vacante vacante) {
        vacante.setEstado(EstadoVacanteTipo.CERRADA);
    }
}
