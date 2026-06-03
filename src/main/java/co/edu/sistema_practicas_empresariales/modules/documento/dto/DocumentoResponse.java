package co.edu.sistema_practicas_empresariales.modules.documento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para la entidad Documento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoResponse {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
