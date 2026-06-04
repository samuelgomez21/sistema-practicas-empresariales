package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemRespuestaDto {
    private Long         preguntaId;
    private String       textoPregunta;
    private TipoPregunta tipoPregunta;
    private Integer      valorEscala;
    private String       valorTexto;
    private Boolean      valorBooleano;
}