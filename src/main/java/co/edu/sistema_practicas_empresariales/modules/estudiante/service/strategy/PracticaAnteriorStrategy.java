package co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import java.util.List;

public class PracticaAnteriorStrategy implements RequisitoValidationStrategy {

    @Override
    public boolean validar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial) {
        if (requisito == null || !requisito.isRequierePracticaAnterior() || requisito.getNumeroPractica() <= 1) {
            return true;
        }
        int practicaAnteriorNum = requisito.getNumeroPractica() - 1;
        return historial.stream()
                .anyMatch(p -> p.getNumeroPractica() == practicaAnteriorNum && p.getEstado() == EstadoPracticaTipo.COMPLETADA);
    }

    @Override
    public String getMensajeError(Estudiante estudiante, ProgramaRequisito requisito) {
        return String.format("La práctica anterior (%d) no está marcada como COMPLETADA en el expediente.",
                requisito.getNumeroPractica() - 1);
    }
}
