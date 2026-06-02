package co.edu.sistema_practicas_empresariales.modules.practica.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComentarioDocenteRequest {

    @NotBlank(message = "El comentario no puede estar vacío")
    private String comentario;
}