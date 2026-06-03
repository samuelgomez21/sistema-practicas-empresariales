package co.edu.sistema_practicas_empresariales.modules.practica.request;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AsignarDocenteRequest {

    @NotNull(message = "El docente es obligatorio")
    private Long docenteId;
}
