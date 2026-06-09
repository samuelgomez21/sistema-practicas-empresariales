package co.edu.sistema_practicas_empresariales.config;

import java.util.HashMap;
import java.util.Map;

/**
 * Patrón Singleton: Garantiza que exista una única instancia controlada durante la ejecución.
 * Mantiene una fuente única de parámetros como reglas generales, valores de inactividad
 * y plantillas usadas por las validaciones en todo el sistema.
 */
public class ConfiguracionGlobalSingleton {

    private static volatile ConfiguracionGlobalSingleton instance;
    private final Map<String, Object> parametros;

    // Constructor privado para evitar instanciación externa
    private ConfiguracionGlobalSingleton() {
        parametros = new HashMap<>();
        // Cargar valores por defecto
        parametros.put("dias_inactividad_maximos", 30);
        parametros.put("max_estudiantes_por_tutor", 5);
        parametros.put("plantilla_correo_base", "<!DOCTYPE html><html><body>%s</body></html>");
        parametros.put("remitente_institucional", "practicas@universidad.edu.co");
    }

    /**
     * Obtiene la única instancia del Singleton (Thread-safe)
     */
    public static ConfiguracionGlobalSingleton getInstance() {
        if (instance == null) {
            synchronized (ConfiguracionGlobalSingleton.class) {
                if (instance == null) {
                    instance = new ConfiguracionGlobalSingleton();
                }
            }
        }
        return instance;
    }

    public Object getParametro(String clave) {
        return parametros.get(clave);
    }

    public void setParametro(String clave, Object valor) {
        parametros.put(clave, valor);
    }

    public int getDiasInactividadMaximos() {
        return (Integer) parametros.getOrDefault("dias_inactividad_maximos", 30);
    }

    public String getPlantillaCorreoBase() {
        return (String) parametros.getOrDefault("plantilla_correo_base", "%s");
    }
}
