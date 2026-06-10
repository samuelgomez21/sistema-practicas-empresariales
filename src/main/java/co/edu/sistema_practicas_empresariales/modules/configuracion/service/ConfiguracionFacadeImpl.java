package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.CatalogoPracticaRequest;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.CatalogoPracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de la fachada de configuración del sistema.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade.
 * Esta clase orquesta la lógica de negocio para interactuar con repositorios de
 * catálogos, programas y el proveedor del Singleton global de configuración.
 * Oculta la complejidad de la inicialización de proxies de Hibernate y las
 * búsquedas compuestas al controlador.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class ConfiguracionFacadeImpl implements ConfiguracionFacade {

    private final ProgramaRepository programaRepository;
    private final CatalogoPracticaRepository catalogoRepository;
    
    // Obtenemos el singleton de configuración a través del contenedor (Patrón Singleton/DI)
    private final ConfiguracionProvider configuracionSistema;

    @Override
    @Transactional(readOnly = true)
    /**
     * Lista los catálogos de práctica activos para un programa específico.
     * @param programaId ID del programa.
     * @return Lista de catálogos activos.
     */
    public List<CatalogoPractica> listarCatalogosPorPrograma(Long programaId) {
        return catalogoRepository.findByProgramaIdAndActivoTrue(programaId);
    }

    @Override
    @Transactional
    /**
     * Crea un nuevo catálogo de práctica con base en la información suministrada.
     * @param request Datos del catálogo.
     * @return El catálogo creado.
     * @throws IllegalArgumentException Si el programa no existe.
     */
    public CatalogoPractica crearCatalogo(CatalogoPracticaRequest request) {
        Programa programa = programaRepository.findById(request.getProgramaId())
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
                
        CatalogoPractica catalogo = CatalogoPractica.builder()
                .numeroPractica(request.getNumeroPractica())
                .nombre(request.getNombre())
                .materiaNucleo(request.getMateriaNucleo())
                .materiaNucleoCodigo(request.getMateriaNucleoCodigo())
                .programa(programa)
                .cortesPorPractica(request.getCortesPorPractica())
                .duracionSemanas(request.getDuracionSemanas())
                .documentosRequeridos(request.getDocumentosRequeridos())
                .activo(true)
                .build();
                
        catalogo = catalogoRepository.save(catalogo);
        // FORZAR LA INICIALIZACION PARA QUE JACKSON NO FALLE
        org.hibernate.Hibernate.initialize(catalogo.getPrograma().getFacultad());
        return catalogo;
    }

    @Override
    @Transactional
    /**
     * Cambia el estado (activo/inactivo) de un catálogo de práctica.
     * @param catalogoId ID del catálogo a modificar.
     * @param activo Nuevo estado booleano.
     * @throws IllegalArgumentException Si el catálogo no existe.
     */
    public void activarDesactivarCatalogo(Long catalogoId, boolean activo) {
        CatalogoPractica catalogo = catalogoRepository.findById(catalogoId)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado"));
        catalogo.setActivo(activo);
        catalogoRepository.save(catalogo);
    }

    @Override
    /**
     * @return El nombre global de la aplicación (Patrón Singleton).
     */
    public String getNombreAplicacion() {
        return configuracionSistema.getNombreAplicacion();
    }

    @Override
    /**
     * @return La versión global del sistema (Patrón Singleton).
     */
    public String getVersion() {
        return configuracionSistema.getVersion();
    }
}
