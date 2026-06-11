package co.edu.sistema_practicas_empresariales.modules.vacante.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacanteRequest {
    private Long empresaId;
    private String titulo;
    private String descripcion;
    private String perfilRequerido;
    private String requisitos;
    private int cuposTotales;
    private Long programaId;
    private String modalidad;
    private java.math.BigDecimal salario;
    private String tipoContrato;
    private String horario;
}
