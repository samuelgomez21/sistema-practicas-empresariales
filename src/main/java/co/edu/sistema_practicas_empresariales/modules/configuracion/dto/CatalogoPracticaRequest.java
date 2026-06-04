package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
