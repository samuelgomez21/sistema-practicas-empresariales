package co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy.DocumentosCompletosStrategy;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.strategy.RequisitoValidationStrategy;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.util.List;

public class DocumentosHandler extends ValidadorAptitudHandler {
    private final RequisitoValidationStrategy strategy = new DocumentosCompletosStrategy();

    @Override
    public void procesar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial, List<String> errores) {
        if (!strategy.validar(estudiante, requisito, historial)) {
            errores.add(strategy.getMensajeError(estudiante, requisito));
        }
        procesarSiguiente(estudiante, requisito, historial, errores);
    }
}
