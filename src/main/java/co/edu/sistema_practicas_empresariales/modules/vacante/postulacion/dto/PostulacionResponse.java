package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion.EstadoPostulacionTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO que representa la respuesta de una postulación.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulacionResponse {
    private Long id;
    private Long vacanteId;
    private Long usuarioId;
    private EstadoPostulacionTipo estado;
    private LocalDateTime fechaPostulacion;
}
