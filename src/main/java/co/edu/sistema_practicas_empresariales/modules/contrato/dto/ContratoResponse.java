// ContratoResponse.java
package co.edu.sistema_practicas_empresariales.modules.contrato.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ContratoResponse {
    private Long          id;
    private Long          practicaId;
    private Long          estudianteId;
    private String        estudianteNombre;
    private Long          empresaId;
    private String        empresaNombre;
    private String        tipoContrato;
    private LocalDate     fechaInicio;
    private LocalDate     fechaFin;
    private BigDecimal    valorMensual;
    private String        pdfUrl;
    private String        estado;
    private LocalDateTime fechaGeneracion;
}