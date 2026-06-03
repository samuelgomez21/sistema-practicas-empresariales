package co.edu.sistema_practicas_empresariales.modules.documento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar los campos de un documento existente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoUpdateDto {
    private String titulo;
    private String descripcion;
}
