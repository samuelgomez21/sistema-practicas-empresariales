package co.edu.sistema_practicas_empresariales.modules.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que consolida las estadísticas generales para el panel de inicio (Dashboard).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardEstadisticasDto {
    private long totalVacantes;
    private long vacantesAprobadas;
    private long totalUsuarios;
    private long totalVinculaciones;
}
