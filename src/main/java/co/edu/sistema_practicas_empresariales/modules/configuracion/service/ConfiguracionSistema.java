package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import org.springframework.stereotype.Service;

/**
 * Patrón Singleton (Spring DI Framework).
 * Implementación de la configuración centralizada administrada por el contenedor de Spring.
 * Garantiza que exista una única instancia controlada que provee parámetros globales
 * (reglas por defecto, versiones, etc.) a los distintos servicios del sistema.
 */
@Service
public class ConfiguracionSistema implements ConfiguracionProvider {

    // Parámetros de configuración globales de la aplicación
    private String nombreAplicacion = "Sistema de Prácticas Empresariales";
    private String version = "1.0.0";

    @Override
    public String getNombreAplicacion() {
        return nombreAplicacion;
    }

    @Override
    public void setNombreAplicacion(String nombreAplicacion) {
        this.nombreAplicacion = nombreAplicacion;
    }

    @Override
    public String getVersion() {
        return version;
    }

    @Override
    public void setVersion(String version) {
        this.version = version;
    }
}
