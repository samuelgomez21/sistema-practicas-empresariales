package co.edu.sistema_practicas_empresariales.modules.vinculacion.dto;

import co.edu.sistema_practicas_empresariales.modules.vinculacion.model.Vinculacion.EstadoVinculacionTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO que representa la respuesta de una Vinculación.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VinculacionResponse {
    private Long id;
    private Long vacanteId;
    private String cargo;
    private String descripcion;
    private String requisitosEstudiante;
    private int numeroCupos;
    private int cuposDisponibles;
    private String area;
    private String modalidad;
    private EstadoVinculacionTipo estado;
    private LocalDateTime fechaCreacion;
}
