package co.edu.sistema_practicas_empresariales.modules.practica.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FechaSustentacionRequest {
    @NotNull(message = "La fecha de sustentación es obligaotoria")
    private LocalDate fechaSustentacion;

}
