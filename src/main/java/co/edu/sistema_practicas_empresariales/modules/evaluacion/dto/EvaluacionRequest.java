package co.edu.sistema_practicas_empresariales.modules.evaluacion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluacionRequest {
    private BigDecimal notaDocente;
    private String observacionesDocente;
    private BigDecimal notaTutor;
    private String observacionesTutor;
    private BigDecimal notaFinal;
    private String observacionesFinales;
}
