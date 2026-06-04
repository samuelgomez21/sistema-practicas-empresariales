package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EncuestaRespuestaDto {
    private Long          id;
    private Long          practicaId;
    private TipoEncuesta  tipo;
    private String        respondidoPor;
    private LocalDateTime fechaEnvio;
    private String        observaciones;
    private String        nombreProyecto;
    private Boolean       postularProyecto;
    private List<ItemRespuestaDto> items;
}