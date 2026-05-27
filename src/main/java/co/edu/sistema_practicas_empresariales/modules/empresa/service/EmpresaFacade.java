package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.VacanteResponse;

import java.util.List;

public interface EmpresaFacade {
    EmpresaResponse registrarEmpresa(EmpresaRequest request);
    TutorEmpresarialResponse registrarTutor(TutorEmpresarialRequest request);
    
    VacanteResponse crearVacante(VacanteRequest request);
    VacanteResponse aprobarVacante(Long vacanteId);
    VacanteResponse rechazarVacante(Long vacanteId, String motivo);
    VacanteResponse cerrarVacante(Long vacanteId);
    
    List<VacanteResponse> listarVacantesPorEmpresa(Long empresaId);
    List<VacanteResponse> listarVacantesPendientes();
}
