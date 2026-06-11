package co.edu.sistema_practicas_empresariales.modules.encuesta.request;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrearPreguntaRequest {

    @NotBlank(message = "El texto es obligatorio")
    private String texto;

    private TipoPregunta tipo = TipoPregunta.ESCALA;
}