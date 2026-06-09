package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import co.edu.sistema_practicas_empresariales.modules.dashboard.dto.DashboardEstadisticasDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.repository.VinculacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Implementación de la fachada del Dashboard.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade.
 * Coordina múltiples repositorios (Usuarios, Vacantes, Vinculaciones) para
 * consolidar las estadísticas generales en un solo objeto de respuesta.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class DashboardFacadeImpl implements DashboardFacade {

    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final VinculacionRepository vinculacionRepository;

    @Override
    public DashboardEstadisticasDto obtenerEstadisticas() {
        
        long totalVacantes = vacanteRepository.count();
        long totalUsuarios = usuarioRepository.count();
        long totalVinculaciones = vinculacionRepository.count();
        
        // Contamos solo las vacantes aprobadas usando el tipo de estado
        long vacantesAprobadas = vacanteRepository.findByEstado(EstadoVacanteTipo.APROBADA).size();
        
        return DashboardEstadisticasDto.builder()
                .totalVacantes(totalVacantes)
                .vacantesAprobadas(vacantesAprobadas)
                .totalUsuarios(totalUsuarios)
                .totalVinculaciones(totalVinculaciones)
                .build();
    }
}
