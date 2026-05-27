package co.edu.sistema_practicas_empresariales.modules.estudiante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaRequisitoRequest {
    private Long programaId;
    private int numeroPractica;
    private int creditosMinimos;
    private BigDecimal promedioMinimo;
    private boolean requierePracticaAnterior;
    private String documentosRequeridos;
}
