package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import java.util.Map;

/**
 * Servicio para obtener métricas del panel de inicio.
 * No se introduce ningún patrón nuevo; es simplemente una capa de servicio.
 */
public interface DashboardService {
    /**
     * Obtiene estadísticas resumidas del sistema.
     * @return mapa de nombre -> valor
     */
    Map<String, Object> obtenerEstadisticas();
}
