package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DashboardServiceImplTest {

    @Mock
    private VacanteRepository vacanteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void obtenerEstadisticas_ShouldReturnCorrectStats() {
        // Arrange
        when(vacanteRepository.count()).thenReturn(10L);
        when(usuarioRepository.count()).thenReturn(5L);

        // Act
        Map<String, Object> stats = dashboardService.obtenerEstadisticas();

        // Assert
        assertNotNull(stats);
        assertEquals(10L, stats.get("totalVacantes"));
        assertEquals(5L, stats.get("totalUsuarios"));
        assertEquals(10L, stats.get("vacantesActivas"));
    }
}
