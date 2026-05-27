package co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.util.List;

public abstract class ValidadorAptitudHandler {
    protected ValidadorAptitudHandler next;

    public ValidadorAptitudHandler setNext(ValidadorAptitudHandler next) {
        this.next = next;
        return next; // Retorna el siguiente para encadenamiento fluido (fluent builder style)
    }

    public abstract void procesar(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial, List<String> errores);

    protected void procesarSiguiente(Estudiante estudiante, ProgramaRequisito requisito, List<Practica> historial, List<String> errores) {
        if (this.next != null) {
            this.next.procesar(estudiante, requisito, historial, errores);
        }
    }
}
