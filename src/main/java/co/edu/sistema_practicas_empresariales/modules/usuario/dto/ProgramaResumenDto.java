package co.edu.sistema_practicas_empresariales.modules.usuario.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgramaResumenDto {
    private Long id;
    private String nombre;
}