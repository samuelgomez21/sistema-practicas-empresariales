package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProgramaParametroRequest {
    private Integer numeroPracticas;
    private Integer corteseguimiento;
    private BigDecimal notaMinima;
    private Integer maxAsignacionesSimultaneas;
    private Integer umbralInactividadDias;
    private String documentosRequeridos;
}