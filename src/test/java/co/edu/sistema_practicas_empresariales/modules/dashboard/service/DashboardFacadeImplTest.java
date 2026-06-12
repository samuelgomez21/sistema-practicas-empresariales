package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.postulacion.repository.PostulacionRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import co.edu.sistema_practicas_empresariales.modules.dashboard.dto.DashboardEstadisticasDto;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DashboardFacadeImplTest {

    @Mock
    private VacanteRepository vacanteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;



    @InjectMocks
    private DashboardFacadeImpl dashboardService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void obtenerEstadisticas_ShouldReturnCorrectStats() {
        // Arrange
        when(vacanteRepository.count()).thenReturn(10L);
        when(usuarioRepository.count()).thenReturn(5L);
        when(vacanteRepository.findByEstado(co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo.APROBADA))
                .thenReturn(java.util.List.of(new co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante(), new co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante()));

        // Act
        DashboardEstadisticasDto dto = dashboardService.obtenerEstadisticas();

        // Assert
        assertNotNull(dto);
        assertEquals(10L, dto.getTotalVacantes());
        assertEquals(5L, dto.getTotalUsuarios());
        assertEquals(0L, dto.getTotalPostulaciones());
        assertEquals(2L, dto.getVacantesAprobadas());
    }
}
