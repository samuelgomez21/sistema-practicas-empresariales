package co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.util.List;

public class CreditosMinimosStrategy implements RequisitoValidationStrategy {

    @Override
    public boolean validar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial) {
        if (requisito == null) return true;
        return estudiante.getCreditosAprobados() >= requisito.getCreditosMinimos();
    }

    @Override
    public String getMensajeError(Estudiante estudiante, ProgramaRequisito requisito) {
        return String.format("Créditos insuficientes: tiene %d y se requieren %d.",
                estudiante.getCreditosAprobados(), requisito.getCreditosMinimos());
    }
}
