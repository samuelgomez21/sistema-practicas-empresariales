package co.edu.sistema_practicas_empresariales.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private Long id;
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String email;
    private String nombre;
    private String rol;
}
