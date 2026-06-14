package co.edu.sistema_practicas_empresariales.modules.visita.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RegistrarVisitaRequest {

    @NotNull(message = "La empresa es obligatoria")
    private Long empresaId;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    private LocalTime horaInicio;
    private LocalTime horaFin;

    @NotBlank(message = "El motivo es obligatorio")
    @Size(max = 200, message = "El motivo no puede superar 200 caracteres")
    private String motivo;

    private String observaciones;
}