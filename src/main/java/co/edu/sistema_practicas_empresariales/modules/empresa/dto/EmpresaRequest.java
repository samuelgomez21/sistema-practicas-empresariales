package co.edu.sistema_practicas_empresariales.modules.empresa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaRequest {
    private String nit;
    private String razonSocial;
    private String sectorEconomico;
    private String direccion;
    private String municipio;
    private String telefono;
    private String contactoPrincipalNombre;
    private String contactoPrincipalEmail;

}
