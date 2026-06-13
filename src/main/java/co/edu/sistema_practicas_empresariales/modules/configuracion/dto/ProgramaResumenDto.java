package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO ligero que representa un programa académico,
 * usado para exponer los programas asignados a un
 * coordinador académico sin traer toda la entidad Programa.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramaResumenDto {
    private Long id;
    private String nombre;
}
