package co.edu.sistema_practicas_empresariales.modules.dashboard.service;

import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalVacantes = vacanteRepository.count();
        long totalUsuarios = usuarioRepository.count();
        
        stats.put("totalVacantes", totalVacantes);
        stats.put("totalUsuarios", totalUsuarios);
        stats.put("vacantesActivas", vacanteRepository.count()); // Simulado, requeriría filtro por estado
        
        return stats;
    }
}
