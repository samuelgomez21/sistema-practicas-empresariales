package co.edu.sistema_practicas_empresariales.modules.practica.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrearAvanceRequest {

    private Long corteId;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    private String descripcion;
}