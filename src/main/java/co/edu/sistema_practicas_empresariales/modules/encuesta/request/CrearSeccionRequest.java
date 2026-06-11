package co.edu.sistema_practicas_empresariales.modules.encuesta.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrearSeccionRequest {

    @NotNull(message = "El id de la plantilla es obligatorio")
    private Long plantillaId;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotNull(message = "El orden es obligatorio")
    private Integer orden;
}