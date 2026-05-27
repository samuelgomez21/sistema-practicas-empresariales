package co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.util.List;

public class PromedioMinimoStrategy implements RequisitoValidationStrategy {

    @Override
    public boolean validar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial) {
        if (requisito == null) return true;
        return estudiante.getPromedioAcumulado().compareTo(requisito.getPromedioMinimo()) >= 0;
    }

    @Override
    public String getMensajeError(Estudiante estudiante, ProgramaRequisito requisito) {
        return String.format("Promedio acumulado insuficiente: tiene %s y se requiere %s.",
                estudiante.getPromedioAcumulado().toString(), requisito.getPromedioMinimo().toString());
    }
}
