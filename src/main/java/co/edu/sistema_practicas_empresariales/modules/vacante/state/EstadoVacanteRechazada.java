package co.edu.sistema_practicas_empresariales.modules.vacante.state;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import org.springframework.stereotype.Component;

@Component
public class EstadoVacanteRechazada implements EstadoVacante {

    @Override
    public EstadoVacanteTipo getTipo() {
        return EstadoVacanteTipo.RECHAZADA;
    }

    @Override
    public void aprobar(Vacante vacante) {
        throw new IllegalStateException("No se puede aprobar una vacante que ya ha sido rechazada");
    }

    @Override
    public void rechazar(Vacante vacante, String motivo) {
        throw new IllegalStateException("La vacante ya se encuentra rechazada");
    }

    @Override
    public void cerrar(Vacante vacante) {
        throw new IllegalStateException("Una vacante rechazada no se puede cerrar explícitamente.");
    }

    @Override
    public boolean permiteAsignaciones() {
        return false;
    }

    @Override
    public void asignarEstudiante(Vacante vacante) {
        throw new IllegalStateException("No se pueden asignar estudiantes a una vacante rechazada.");
    }
}
