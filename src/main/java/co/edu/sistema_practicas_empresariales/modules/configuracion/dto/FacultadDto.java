package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultadDto {
    private Long id;
    private String nombre;
    private boolean activo;
}
