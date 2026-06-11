package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaDto {
    private Long id;
    private String nombre;
    private Long facultadId;
    private String nombreFacultad;
    private boolean activo;
}
