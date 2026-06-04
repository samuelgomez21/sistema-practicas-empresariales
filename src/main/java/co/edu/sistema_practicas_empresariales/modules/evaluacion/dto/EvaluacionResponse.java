package co.edu.sistema_practicas_empresariales.modules.evaluacion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluacionResponse {
    private Long id;
    private Long practicaId;
    private BigDecimal notaDocente;
    private String observacionesDocente;
    private LocalDateTime fechaEvaluacionDocente;
    private BigDecimal notaTutor;
    private String observacionesTutor;
    private LocalDateTime fechaEvaluacionTutor;
    private BigDecimal notaFinal;
    private String observacionesFinales;
    private LocalDateTime fechaEvaluacionFinal;
    private String resultado;
    private boolean activo;
}
