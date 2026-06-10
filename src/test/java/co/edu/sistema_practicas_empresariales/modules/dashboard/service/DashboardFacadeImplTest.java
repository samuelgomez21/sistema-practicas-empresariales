package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
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

    @Mock
    private co.edu.sistema_practicas_empresariales.modules.vinculacion.repository.VinculacionRepository vinculacionRepository;

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

        // Act
        DashboardEstadisticasDto stats = dashboardService.obtenerEstadisticas();

        // Assert
        assertNotNull(stats);
        assertEquals(10L, stats.getTotalVacantes());
        assertEquals(5L, stats.getTotalUsuarios());
    }
}
