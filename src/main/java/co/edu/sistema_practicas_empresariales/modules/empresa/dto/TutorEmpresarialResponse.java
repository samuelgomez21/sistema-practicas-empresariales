package co.edu.sistema_practicas_empresariales.modules.empresa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorEmpresarialResponse {
    private Long id;
    private String nombre;
    private String correo;
    private String telefono;
    private String cargo;
    private Long empresaId;
    private LocalDateTime fechaRegistro;
    private Boolean activo;
}
