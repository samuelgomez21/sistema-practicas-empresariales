package co.edu.sistema_practicas_empresariales.modules.estudiante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogoPracticaRequest {
    private int numeroPractica;
    private String nombre;
    private String materiaNucleo;
    private String materiaNucleoCodigo;
    private Long programaId;
    private int cortesPorPractica;
    private int duracionSemanas;
    private String documentosRequeridos;
}
