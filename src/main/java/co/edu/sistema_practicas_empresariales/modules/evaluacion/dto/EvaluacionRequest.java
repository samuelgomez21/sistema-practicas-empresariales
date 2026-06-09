package co.edu.sistema_practicas_empresariales.modules.evaluacion.dto;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.TipoEvaluacion;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EvaluacionRequest {
    @NotNull
    private Long practicaId;
    
    @NotNull
    private Long evaluadorId;
    
    @NotNull
    private TipoEvaluacion tipo;
    
    private String criteriosJson;
    
    @NotNull
    private BigDecimal puntajeFinal;
    
    private String comentarios;
}
