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

@Service
@RequiredArgsConstructor
public class ConfiguracionFacadeImpl implements ConfiguracionFacade {

    private final CatalogoPracticaRepository catalogoRepository;
    private final ProgramaRepository programaRepository;
    
    // Obtenemos el singleton de configuración
    private final ConfiguracionSistema configuracionSistema = ConfiguracionSistema.getInstance();

    @Override
    @Transactional(readOnly = true)
    public List<CatalogoPractica> listarCatalogosPorPrograma(Long programaId) {
        return catalogoRepository.findByProgramaIdAndActivoTrue(programaId);
    }

    @Override
    @Transactional
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
                
        return catalogoRepository.save(catalogo);
    }

    @Override
    @Transactional
    public void activarDesactivarCatalogo(Long catalogoId, boolean activo) {
        CatalogoPractica catalogo = catalogoRepository.findById(catalogoId)
                .orElseThrow(() -> new IllegalArgumentException("Catálogo no encontrado"));
        catalogo.setActivo(activo);
        catalogoRepository.save(catalogo);
    }

    @Override
    public String getNombreAplicacion() {
        return configuracionSistema.getNombreAplicacion();
    }

    @Override
    public String getVersion() {
        return configuracionSistema.getVersion();
    }
}
