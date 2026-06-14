package co.edu.sistema_practicas_empresariales.modules.estudiante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteResponse {
    private Long id;
    private String nombre;
    private String email;
    private String tipoIdentificacion;
    private String identificacion;
    private String telefono;
    private String contactoEmergencia;
    private Long programaId;
    private String nombrePrograma;
    private String nombreFacultad;
    private int semestre;
    private int creditosAprobados;
    private BigDecimal promedioAcumulado;
    private String estadoAptitud;
    private String estadoPractica;
    private boolean activo;
    private LocalDateTime fechaCreacion;
    private String hojaVidaUrl;
}
