package co.edu.sistema_practicas_empresariales.modules.cierre.dto;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.ChecklistDto;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CierreDto {
    private Long               practicaId;
    private EstadoPracticaTipo estadoAnterior;
    private EstadoPracticaTipo estadoNuevo;
    private LocalDateTime      fechaCierre;
    private List<ChecklistDto> checklist;
    private Boolean            exitoso;
    private String             mensaje;
}