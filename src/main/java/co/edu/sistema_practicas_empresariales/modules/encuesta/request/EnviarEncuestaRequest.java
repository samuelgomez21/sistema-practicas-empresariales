package co.edu.sistema_practicas_empresariales.modules.encuesta.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class EnviarEncuestaRequest {

    @NotNull(message = "El id de la plantilla es obligatorio")
    private Long plantillaId;

    @NotEmpty(message = "Debe responder al menos una pregunta")
    private List<ItemRespuestaRequest> respuestas;

    private String  observaciones;
    private String  nombreProyecto;
    private Boolean postularProyecto;
}
