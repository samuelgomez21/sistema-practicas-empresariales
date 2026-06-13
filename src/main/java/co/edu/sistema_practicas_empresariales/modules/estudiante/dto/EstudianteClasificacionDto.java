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
public class EstudianteClasificacionDto {
    private Long id;
    private String nombre;
    private String programa;
    private Long programaId;
    private int semestre;
    private int creditosAprobados;
    private BigDecimal promedioAcumulado;
    private String estadoAptitud;
    private Integer numeroPractica;
    private Long docenteId;
    private String docenteNombre;
    private String empresaNombre;
    private Long practicaId;
}