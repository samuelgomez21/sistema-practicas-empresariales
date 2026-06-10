package co.edu.sistema_practicas_empresariales.modules.documento.builder;

import lombok.Getter;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Producto complejo que representa un Acta de Cierre de Práctica
 */
@Getter
public class ActaCierre {
    private final String codigoEstudiante;
    private final String nombreEmpresa;
    private final Double calificacionFinal;
    private final List<String> firmasElectronicas;
    private final LocalDate fechaEmision;
    private final String resolucion;

    protected ActaCierre(String codigoEstudiante, String nombreEmpresa, Double calificacionFinal, List<String> firmasElectronicas, LocalDate fechaEmision, String resolucion) {
        this.codigoEstudiante = codigoEstudiante;
        this.nombreEmpresa = nombreEmpresa;
        this.calificacionFinal = calificacionFinal;
        this.firmasElectronicas = firmasElectronicas;
        this.fechaEmision = fechaEmision;
        this.resolucion = resolucion;
    }
}
