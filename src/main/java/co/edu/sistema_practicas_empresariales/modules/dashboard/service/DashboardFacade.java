package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import co.edu.sistema_practicas_empresariales.modules.dashboard.dto.DashboardEstadisticasDto;

/**
 * Fachada para el panel de inicio (Dashboard).
 */
public interface DashboardFacade {
    /**
     * Obtiene estadísticas resumidas del sistema.
     * @return objeto con las métricas del dashboard
     */
    DashboardEstadisticasDto obtenerEstadisticas();
}
