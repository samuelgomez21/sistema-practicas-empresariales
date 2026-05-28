package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import org.springframework.stereotype.Component;

/**
 * Configuración global del sistema siguiendo el patrón Singleton.
 * Se declara como @Component para que Spring lo gestione como bean único.
 */
@Component
public class ConfiguracionSistema {

    private static ConfiguracionSistema instance;

    // Ejemplo de parámetros de configuración
    private String nombreAplicacion = "Sistema de Prácticas Empresariales";
    private String version = "1.0.0";

    private ConfiguracionSistema() {
        // Constructor privado para evitar instanciación externa
    }

    public static synchronized ConfiguracionSistema getInstance() {
        if (instance == null) {
            instance = new ConfiguracionSistema();
        }
        return instance;
    }

    // Getters y setters para los parámetros
    public String getNombreAplicacion() {
        return nombreAplicacion;
    }

    public void setNombreAplicacion(String nombreAplicacion) {
        this.nombreAplicacion = nombreAplicacion;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
