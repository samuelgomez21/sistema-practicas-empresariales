package co.edu.sistema_practicas_empresariales.modules.documento.builder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Patrón Builder: Ensambla el acta de cierre con notas, firmas y resoluciones.
 */
public class ActaCierreBuilder {
    private String codigoEstudiante;
    private String nombreEmpresa;
    private Double calificacionFinal;
    private List<String> firmasElectronicas = new ArrayList<>();
    private LocalDate fechaEmision;
    private String resolucion;

    public ActaCierreBuilder paraEstudiante(String codigoEstudiante) {
        this.codigoEstudiante = codigoEstudiante;
        return this;
    }

    public ActaCierreBuilder enEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
        return this;
    }

    public ActaCierreBuilder conCalificacion(Double nota) {
        this.calificacionFinal = nota;
        return this;
    }

    public ActaCierreBuilder agregarFirma(String firmaUsuario) {
        this.firmasElectronicas.add(firmaUsuario);
        return this;
    }

    public ActaCierreBuilder establecerResolucion(String resolucion) {
        this.resolucion = resolucion;
        return this;
    }

    public ActaCierre construir() {
        if (codigoEstudiante == null || calificacionFinal == null) {
            throw new IllegalStateException("Faltan datos obligatorios para emitir el acta");
        }
        this.fechaEmision = LocalDate.now();
        return new ActaCierre(codigoEstudiante, nombreEmpresa, calificacionFinal, firmasElectronicas, fechaEmision, resolucion);
    }
}
