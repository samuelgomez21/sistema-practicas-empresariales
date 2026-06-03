package co.edu.sistema_practicas_empresariales.modules.documento.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear un nuevo documento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoCreateDto {
    private String titulo;
    private String descripcion;
}
