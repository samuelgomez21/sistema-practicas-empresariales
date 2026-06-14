package co.edu.sistema_practicas_empresariales.modules.visita.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VisitaDto {
    private Long          id;
    private Long          empresaId;
    private String        empresaNombre;
    private Long          registradoPorId;
    private String        registradoPorNombre;
    private String        tipoVisitante;     // DOCENTE_ASESOR | COORDINADOR
    private LocalDate     fecha;
    private LocalTime     horaInicio;
    private LocalTime     horaFin;
    private String        motivo;
    private String        observaciones;
    private LocalDateTime createdAt;
}