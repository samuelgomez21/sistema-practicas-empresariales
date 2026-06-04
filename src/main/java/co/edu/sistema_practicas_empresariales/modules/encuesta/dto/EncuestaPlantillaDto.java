package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EncuestaPlantillaDto {
    private Long          id;
    private TipoEncuesta  tipo;
    private String        version;
    private String        nombre;
    private List<SeccionDto> secciones;
}