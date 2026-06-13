package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.*;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;

import java.util.List;

public interface ConfiguracionFacade {
    List<CatalogoPracticaDto> listarCatalogosPorPrograma(Long programaId);
    CatalogoPractica crearCatalogo(CatalogoPracticaRequest request);
    void activarDesactivarCatalogo(Long catalogoId, boolean activo);

    List<FacultadDto> listarFacultades();
    FacultadDto crearFacultad(FacultadRequest request);
    FacultadDto actualizarFacultad(Long id, FacultadRequest request);
    void eliminarFacultad(Long id);

    List<ProgramaDto> listarProgramas();
    ProgramaDto crearPrograma(ProgramaRequest request);
    ProgramaDto actualizarPrograma(Long id, ProgramaRequest request);
    void eliminarPrograma(Long id);
    
    // Métodos delegados a ConfiguracionSistema
    String getNombreAplicacion();
    String getVersion();

    ProgramaParametroDto obtenerParametrosPrograma(Long programaId);
    ProgramaParametroDto actualizarParametrosPrograma(Long programaId, ProgramaParametroRequest request);

    CatalogoPractica actualizarCatalogo(Long id, CatalogoPracticaRequest request);
    List<CatalogoPracticaConConteoDto> listarCatalogosPorProgramaConConteo(Long programaId);

}
