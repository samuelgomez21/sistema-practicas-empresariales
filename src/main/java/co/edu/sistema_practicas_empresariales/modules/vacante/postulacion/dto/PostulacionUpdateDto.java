package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion.EstadoPostulacionTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar una postulación existente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulacionUpdateDto {
    private EstadoPostulacionTipo estado;
}
