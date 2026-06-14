// ContratoRequest.java
package co.edu.sistema_practicas_empresariales.modules.contrato.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ContratoRequest {
    private Long       practicaId;    // opcional — si se pasa, se autocompletan datos
    private Long       estudianteId;
    private String     estudianteNombre;
    private Long       empresaId;
    private String     empresaNombre;
    private String     tipoContrato;
    private String     fechaInicio;   // yyyy-MM-dd
    private String     fechaFin;
    private BigDecimal valorMensual;
}