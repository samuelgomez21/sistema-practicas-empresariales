package co.edu.sistema_practicas_empresariales.modules.evaluacion.service;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionRequest;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;
import java.math.BigDecimal;

public interface EvaluacionService {
    EvaluacionResponse registrarNotaDocente(Long practicaId, BigDecimal nota, String observaciones, String docenteEmail);
    EvaluacionResponse registrarNotaTutor(Long practicaId, BigDecimal nota, String observaciones, String tutorEmail);
    EvaluacionResponse registrarNotaFinal(Long practicaId, BigDecimal nota, String observaciones, String coordinadorEmail);
    EvaluacionResponse getEvaluacionByPractica(Long practicaId);
}
