package co.edu.sistema_practicas_empresariales.modules.evaluacion.service;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionRequest;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;

import java.util.List;

public interface EvaluacionFacade {
    EvaluacionResponse registrarEvaluacion(EvaluacionRequest request);
    List<EvaluacionResponse> listarPorPractica(Long practicaId);
    EvaluacionResponse obtenerPorId(Long id);
    void eliminarEvaluacion(Long id);
}
