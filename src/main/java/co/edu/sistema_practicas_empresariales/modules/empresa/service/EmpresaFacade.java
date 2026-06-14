package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.*;

import java.util.List;

public interface EmpresaFacade {
    EmpresaResponse registrarEmpresa(EmpresaRequest request);
    TutorEmpresarialResponse registrarTutor(TutorEmpresarialRequest request);
    
    java.util.List<EmpresaResponse> listarTodas();
    EmpresaResponse obtenerPorId(Long id);
    EmpresaResponse actualizarEmpresa(Long id, EmpresaRequest request);
    void eliminarEmpresa(Long id);
    
    java.util.List<TutorEmpresarialResponse> listarTutoresPorEmpresa(Long empresaId);
    void eliminarTutor(Long id);
    EmpresaResponse obtenerPorUsuarioEmail(String email);
    TutorEmpresarialResponse actualizarTutor(Long id, TutorEmpresarialRequest request);
    void activarTutor(Long id);
    java.util.List<TutorEmpresarialResponse> listarTodosLosTutores();
    List<EmpresaDocumentoResponse> listarDocumentos(Long empresaId);
    EmpresaDocumentoResponse guardarDocumento(Long empresaId, EmpresaDocumentoRequest request);
}
