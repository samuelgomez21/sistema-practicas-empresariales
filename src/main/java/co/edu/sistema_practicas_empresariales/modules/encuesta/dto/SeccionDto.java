package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SeccionDto {
    private Long   id;
    private String codigo;
    private String titulo;
    private Integer orden;
    private List<PreguntaDto> preguntas;
}