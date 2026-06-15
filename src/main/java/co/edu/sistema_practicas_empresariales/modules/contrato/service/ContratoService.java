package co.edu.sistema_practicas_empresariales.modules.contrato.service;

import co.edu.sistema_practicas_empresariales.modules.contrato.dto.ContratoRequest;
import co.edu.sistema_practicas_empresariales.modules.contrato.dto.ContratoResponse;

import java.util.List;
import java.util.Map;

public interface ContratoService {
    ContratoResponse generarContrato(ContratoRequest req);
    List<ContratoResponse> listarTodos();
    List<Map<String, Object>> getEmpresasConSeleccionados();
}
