package co.edu.sistema_practicas_empresariales.modules.configuracion.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.CatalogoPracticaDto;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.CatalogoPracticaRequest;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.CatalogoPracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ConfiguracionFacadeImplTest {

    @Mock
    private CatalogoPracticaRepository catalogoRepository;

    @Mock
    private ProgramaRepository programaRepository;

    @Mock
    private PracticaRepository practicaRepository;

    @InjectMocks
    private ConfiguracionFacadeImpl configuracionFacade;

    @Test
    void listarCatalogosPorPrograma_ShouldReturnList() {
        CatalogoPractica catalogo = new CatalogoPractica();
        Programa p = new Programa();
        p.setId(1L);
        catalogo.setPrograma(p);

        when(catalogoRepository.findByProgramaIdAndActivoTrue(1L))
                .thenReturn(List.of(catalogo));

        List<CatalogoPracticaDto> result = configuracionFacade.listarCatalogosPorPrograma(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(catalogoRepository).findByProgramaIdAndActivoTrue(1L);
    }

    @Test
    void crearCatalogo_ShouldSaveAndReturnCatalogo() {
        CatalogoPracticaRequest request = new CatalogoPracticaRequest();
        request.setProgramaId(1L);
        request.setNombre("Practica I");

        Programa programa = new Programa();
        programa.setId(1L);

        when(programaRepository.findById(1L)).thenReturn(Optional.of(programa));
        when(catalogoRepository.save(any(CatalogoPractica.class))).thenAnswer(i -> i.getArguments()[0]);

        CatalogoPractica result = configuracionFacade.crearCatalogo(request);

        assertNotNull(result);
        assertEquals("Practica I", result.getNombre());
        assertTrue(result.isActivo());
        verify(programaRepository).findById(1L);
        verify(catalogoRepository).save(any(CatalogoPractica.class));
    }

    @Test
    void activarDesactivarCatalogo_ShouldUpdateEstado() {
        CatalogoPractica catalogo = new CatalogoPractica();
        catalogo.setId(1L);
        catalogo.setActivo(true);

        when(catalogoRepository.findById(1L)).thenReturn(Optional.of(catalogo));
        when(practicaRepository.countActivasByCatalogoPracticaId(1L)).thenReturn(0L);

        configuracionFacade.activarDesactivarCatalogo(1L, false);

        assertFalse(catalogo.isActivo());
        verify(catalogoRepository).save(catalogo);
    }
}
