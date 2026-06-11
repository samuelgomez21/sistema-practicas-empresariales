package co.edu.sistema_practicas_empresariales.modules.vacante.dto;

import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacanteResponse {
    private Long id;
    private Long empresaId;
    private String nombreEmpresa;
    private String titulo;
    private String descripcion;
    private String perfilRequerido;
    private String requisitos;
    private int cuposTotales;
    private int cuposDisponibles;
    private EstadoVacanteTipo estado;
    private String motivoRechazo;
    private LocalDateTime fechaCreacion;
    private Long programaId;
    private String nombrePrograma;
    private String modalidad;
    private java.math.BigDecimal salario;
    private String tipoContrato;
    private String horario;
}
