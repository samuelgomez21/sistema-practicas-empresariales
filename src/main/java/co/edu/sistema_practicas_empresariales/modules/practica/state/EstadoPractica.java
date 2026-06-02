package co.edu.sistema_practicas_empresariales.modules.practica.state;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import java.math.BigDecimal;

public interface EstadoPractica {
    void iniciarVinculacion(Practica practica);
    void registrarConvenio(Practica practica);
    void activarPractica(Practica practica);
    void registrarNotaFinal(Practica practica, BigDecimal nota, BigDecimal notaMinima);
    void ejecutarCierre(Practica practica, BigDecimal notaMinima);
    void cancelar(Practica practica, String motivo);
    EstadoPracticaTipo getTipo();
}
