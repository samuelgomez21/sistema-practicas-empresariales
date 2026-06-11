package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaRequest {
    private String nombre;
    private Long facultadId;
}
