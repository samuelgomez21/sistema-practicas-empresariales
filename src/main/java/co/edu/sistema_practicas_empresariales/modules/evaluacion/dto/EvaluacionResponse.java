package co.edu.sistema_practicas_empresariales.modules.evaluacion.dto;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.TipoEvaluacion;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class EvaluacionResponse {
    private Long id;
    private Long practicaId;
    private Long evaluadorId;
    private String nombreEvaluador;
    private TipoEvaluacion tipo;
    private String criteriosJson;
    private BigDecimal puntajeFinal;
    private String comentarios;
    private LocalDateTime fechaCreacion;
}
