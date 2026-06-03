package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion.EstadoPostulacionTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva postulación.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulacionCreateDto {
    private Long vacanteId;
    private Long usuarioId;
    private EstadoPostulacionTipo estado; // opcional, por defecto PENDIENTE
}
