package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PreguntaDto {
    private Long         id;
    private Integer      orden;
    private String       texto;
    private TipoPregunta tipo;
}