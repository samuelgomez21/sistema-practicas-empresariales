package co.edu.sistema_practicas_empresariales.modules.vacante.state;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;

public interface EstadoVacante {
    
    EstadoVacanteTipo getTipo();
    
    void aprobar(Vacante vacante);
    
    void rechazar(Vacante vacante, String motivo);
    
    void cerrar(Vacante vacante);
}
