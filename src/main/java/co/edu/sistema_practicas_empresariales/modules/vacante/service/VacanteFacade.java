package co.edu.sistema_practicas_empresariales.modules.vacante.service;

import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteResponse;

import java.util.List;

public interface VacanteFacade {
    VacanteResponse crearVacante(VacanteRequest request);
    VacanteResponse aprobarVacante(Long vacanteId);
    VacanteResponse rechazarVacante(Long vacanteId, String motivo);
    VacanteResponse cerrarVacante(Long vacanteId);
    
    List<VacanteResponse> listarVacantesPorEmpresa(Long empresaId);
    List<VacanteResponse> listarVacantesPendientes();
}
