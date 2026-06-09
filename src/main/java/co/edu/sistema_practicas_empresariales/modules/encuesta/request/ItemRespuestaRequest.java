package co.edu.sistema_practicas_empresariales.modules.encuesta.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemRespuestaRequest {

    @NotNull(message = "El id de la pregunta es obligatorio")
    private Long preguntaId;

    private Integer valorEscala;
    private String  valorTexto;
    private Boolean valorBooleano;
}