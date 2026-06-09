package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

/**
 * Patrón Singleton (Spring DI) + Interface Segregation (SOLID).
 * Esta interfaz abstrae el acceso a la configuración global del backend,
 * permitiendo que otros servicios obtengan parámetros generales (plantillas,
 * reglas por defecto) sin acoplarse a una implementación concreta.
 */
public interface ConfiguracionProvider {
    
    /**
     * Obtiene el nombre global de la aplicación.
     * @return Nombre de la aplicación.
     */
    String getNombreAplicacion();

    /**
     * Obtiene la versión actual del backend.
     * @return Versión de la aplicación.
     */
    String getVersion();
    
    /**
     * Permite actualizar la versión en tiempo de ejecución.
     * @param version Nueva versión.
     */
    void setVersion(String version);

    /**
     * Permite actualizar el nombre de la aplicación.
     * @param nombreAplicacion Nuevo nombre.
     */
    void setNombreAplicacion(String nombreAplicacion);
}
