package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.CatalogoPracticaRequest;
import java.util.List;

public interface ConfiguracionFacade {
    List<CatalogoPractica> listarCatalogosPorPrograma(Long programaId);
    CatalogoPractica crearCatalogo(CatalogoPracticaRequest request);
    void activarDesactivarCatalogo(Long catalogoId, boolean activo);
    
    // Métodos delegados a ConfiguracionSistema
    String getNombreAplicacion();
    String getVersion();
}
