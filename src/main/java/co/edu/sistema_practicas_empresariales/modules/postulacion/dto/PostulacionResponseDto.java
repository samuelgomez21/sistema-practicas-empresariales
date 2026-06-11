package co.edu.sistema_practicas_empresariales.modules.postulacion.dto;

import co.edu.sistema_practicas_empresariales.modules.postulacion.model.EstadoPostulacionTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostulacionResponseDto {
    private Long id;
    private Long vacanteId;
    private String tituloVacante;
    private Long estudianteId;
    private String nombreEstudiante;
    private EstadoPostulacionTipo estado;
    private LocalDateTime fechaPostulacion;
    private String observaciones;
}
