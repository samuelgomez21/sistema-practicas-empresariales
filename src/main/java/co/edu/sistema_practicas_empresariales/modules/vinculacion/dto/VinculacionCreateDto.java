package co.edu.sistema_practicas_empresariales.modules.vinculacion.dto;

import co.edu.sistema_practicas_empresariales.modules.vinculacion.model.Vinculacion.EstadoVinculacionTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva Vinculación.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VinculacionCreateDto {
    private Long vacanteId;
    private String cargo;
    private String descripcion;
    private String requisitosEstudiante;
    private Integer numeroCupos;
    private Integer cuposDisponibles;
    private String area;
    private String modalidad;
    private EstadoVinculacionTipo estado; // opcional, si no se envía se usará PENDIENTE
}
