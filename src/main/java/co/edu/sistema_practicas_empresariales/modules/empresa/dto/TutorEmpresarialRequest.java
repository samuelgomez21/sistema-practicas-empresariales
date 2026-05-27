package co.edu.sistema_practicas_empresariales.modules.empresa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorEmpresarialRequest {
    private String nombre;
    private String correo;
    private String telefono;
    private String cargo;
    private Long empresaId;
}
