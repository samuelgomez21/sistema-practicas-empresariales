package co.edu.sistema_practicas_empresariales.modules.estudiante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteRequest {
    private String nombre;
    private String email;
    private String tipoIdentificacion;
    private String identificacion;
    private String telefono;
    private String contactoEmergencia;
    private Long programaId;
    private int semestre;
    private int creditosAprobados;
    private BigDecimal promedioAcumulado;
}
