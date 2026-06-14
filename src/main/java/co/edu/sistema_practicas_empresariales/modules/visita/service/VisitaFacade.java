package co.edu.sistema_practicas_empresariales.modules.visita.service;

import co.edu.sistema_practicas_empresariales.modules.visita.dto.VisitaDto;
import co.edu.sistema_practicas_empresariales.modules.visita.request.RegistrarVisitaRequest;
import java.util.List;

public interface VisitaFacade {
    VisitaDto registrar(RegistrarVisitaRequest request, String emailUsuario);
    List<VisitaDto> listarTodas();
    List<VisitaDto> listarMias(String emailUsuario);
    List<VisitaDto> listarPorEmpresa(Long empresaId);
    void eliminar(Long id, String emailUsuario);
}
