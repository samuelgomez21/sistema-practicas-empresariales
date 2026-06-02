package co.edu.sistema_practicas_empresariales.modules.estudiante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PracticaResponse {
    private Long id;
    private int numeroPractica;
    private String nombre;
    private String materiaNucleo;
    private String materiaNucleoCodigo;
    private int duracionSemanas;
    private String estado;
    private String nombreEmpresa;
    private String nombreDocenteAsesor;
    private String nombreTutorEmpresarial;
    private BigDecimal notaFinal;
    private String resultado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
