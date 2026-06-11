package co.edu.sistema_practicas_empresariales.modules.encuesta.request;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrearPlantillaRequest {

    @NotNull(message = "El tipo es obligatorio")
    private TipoEncuesta tipo;

    @NotBlank(message = "La versión es obligatoria")
    private String version;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
}