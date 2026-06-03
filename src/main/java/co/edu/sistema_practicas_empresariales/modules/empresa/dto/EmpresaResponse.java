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
public class EmpresaResponse {
    private Long id;
    private String nit;
    private String razonSocial;
    private String sectorEconomico;
    private String direccion;
    private String municipio;
    private String telefono;
    private String contactoPrincipalNombre;
    private String contactoPrincipalEmail;
    private boolean activo;
    private LocalDateTime fechaCreacion;
}
