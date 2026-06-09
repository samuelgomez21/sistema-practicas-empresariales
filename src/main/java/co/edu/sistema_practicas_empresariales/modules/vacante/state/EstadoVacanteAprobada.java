package co.edu.sistema_practicas_empresariales.modules.vacante.state;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
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
        // Evento: Vacante cerrada
    }

    @Override
    public boolean permiteAsignaciones() {
        return true; // Una vacante aprobada sí permite asignar estudiantes
    }

    @Override
    public void asignarEstudiante(Vacante vacante) {
        // La lógica incrementará los cupos usados y validará
        // Si cupos_disponibles == 0, podría transicionar a CERRADA, pero la acción es permitida inicialmente.
    }
}
