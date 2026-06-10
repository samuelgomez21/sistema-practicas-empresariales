package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialResponse;

public interface EmpresaFacade {
    EmpresaResponse registrarEmpresa(EmpresaRequest request);
    TutorEmpresarialResponse registrarTutor(TutorEmpresarialRequest request);
    
    java.util.List<EmpresaResponse> listarTodas();
    EmpresaResponse obtenerPorId(Long id);
    EmpresaResponse actualizarEmpresa(Long id, EmpresaRequest request);
    void eliminarEmpresa(Long id);
    
    java.util.List<TutorEmpresarialResponse> listarTutoresPorEmpresa(Long empresaId);
    void eliminarTutor(Long id);
}
