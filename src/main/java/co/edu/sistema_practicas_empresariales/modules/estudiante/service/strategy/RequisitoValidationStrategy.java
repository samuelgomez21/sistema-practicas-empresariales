package co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.util.List;

public interface RequisitoValidationStrategy {
    boolean validar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial);
    String getMensajeError(Estudiante estudiante, ProgramaRequisito requisito);
}
