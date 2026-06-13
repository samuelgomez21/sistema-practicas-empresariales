package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaParametroDto {
    private Long programaId;
    private int numeroPracticas;
    private int corteseguimiento;
    private BigDecimal notaMinima;
    private int maxAsignacionesSimultaneas;
    private int umbralInactividadDias;
    private String documentosRequeridos;
}