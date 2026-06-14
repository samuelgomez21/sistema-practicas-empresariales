package co.edu.sistema_practicas_empresariales.modules.evaluacion.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.ProgramaParametro;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaParametroRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.exception.BusinessException;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EvaluacionServiceImpl implements EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final PracticaRepository practicaRepository;
    private final TutorEmpresarialRepository tutorEmpresarialRepository;
    private final ProgramaParametroRepository programaParametroRepository;

    @Override
    @Transactional
    public EvaluacionResponse registrarNotaDocente(Long practicaId, BigDecimal nota, String observaciones, String docenteEmail) {
        Practica practica = getPracticaValida(practicaId);

        // Validar que el usuario sea el docente asesor asignado
        if (practica.getDocenteAsesor() == null || !practica.getDocenteAsesor().getEmail().equalsIgnoreCase(docenteEmail)) {
            throw new BusinessException("No tienes permisos para registrar la nota como docente asesor en esta práctica.");
        }

        validarRangoNota(nota);

        Evaluacion evaluacion = getOrCreateEvaluacion(practica);
        evaluacion.setNotaDocente(nota);
        evaluacion.setObservacionesDocente(observaciones);
        evaluacion.setFechaEvaluacionDocente(LocalDateTime.now());

        Evaluacion guardada = evaluacionRepository.save(evaluacion);
        return convertToResponse(guardada);
    }

    @Override
    @Transactional
    public EvaluacionResponse registrarNotaTutor(Long practicaId, BigDecimal nota, String observaciones, String tutorEmail) {
        Practica practica = getPracticaValida(practicaId);

        // Validar que el usuario sea el tutor empresarial asignado
        TutorEmpresarial tutor = tutorEmpresarialRepository.findByCorreo(tutorEmail)
                .orElseThrow(() -> new BusinessException("No se encontró el tutor empresarial registrado con el correo: " + tutorEmail));

        if (practica.getTutorEmpresarialId() == null || !practica.getTutorEmpresarialId().equals(tutor.getId())) {
            throw new BusinessException("No tienes permisos para registrar la nota como tutor empresarial en esta práctica.");
        }

        validarRangoNota(nota);

        Evaluacion evaluacion = getOrCreateEvaluacion(practica);
        evaluacion.setNotaTutor(nota);
        evaluacion.setObservacionesTutor(observaciones);
        evaluacion.setFechaEvaluacionTutor(LocalDateTime.now());

        Evaluacion guardada = evaluacionRepository.save(evaluacion);
        return convertToResponse(guardada);
    }

    @Override
    @Transactional
    public EvaluacionResponse registrarNotaFinal(Long practicaId, BigDecimal nota, String observaciones, String coordinadorEmail) {
        Practica practica = getPracticaValida(practicaId);

        // Nota de docente es prerrequisito
        Evaluacion evaluacion = evaluacionRepository.findByPracticaIdAndActivoTrue(practicaId)
                .orElseThrow(() -> new BusinessException("Para registrar la nota final, el docente asesor debe haber registrado su nota previamente."));

        if (evaluacion.getNotaDocente() == null) {
            throw new BusinessException("Para registrar la nota final, el docente asesor debe haber registrado su nota previamente.");
        }

        validarRangoNota(nota);

        // Obtener la nota mínima configurada para el programa
        ProgramaParametro parametros = programaParametroRepository.findByProgramaId(practica.getEstudiante().getPrograma().getId())
                .orElseThrow(() -> new BusinessException("No se encontraron parámetros configurados para el programa académico."));

        BigDecimal notaMinima = parametros.getNotaMinimaAprobacion();

        // Registrar nota final en la evaluación
        evaluacion.setNotaFinal(nota);
        evaluacion.setObservacionesFinales(observaciones);
        evaluacion.setFechaEvaluacionFinal(LocalDateTime.now());
        evaluacionRepository.save(evaluacion);

        // Actualizar la práctica y cambiar su estado usando el patrón State
        practica.registrarNotaFinal(nota, notaMinima);
        practicaRepository.save(practica);

        return convertToResponse(evaluacion);
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluacionResponse getEvaluacionByPractica(Long practicaId) {
        Evaluacion evaluacion = evaluacionRepository.findByPracticaIdAndActivoTrue(practicaId)
                .orElseThrow(() -> new BusinessException("No se encontró evaluación registrada para esta práctica."));
        return convertToResponse(evaluacion);
    }

    private Practica getPracticaValida(Long practicaId) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new BusinessException("No se encontró la práctica con ID: " + practicaId));

        // Verificar que la práctica esté activa (no esté cancelada)
        if ("CANCELADA".equals(practica.getEstado().name())) {
            throw new BusinessException("La práctica se encuentra cancelada y no permite registros.");
        }
        return practica;
    }

    private Evaluacion getOrCreateEvaluacion(Practica practica) {
        return evaluacionRepository.findByPracticaIdAndActivoTrue(practica.getId())
                .orElseGet(() -> Evaluacion.builder()
                        .practica(practica)
                        .activo(true)
                        .build());
    }

    private void validarRangoNota(BigDecimal nota) {
        if (nota == null || nota.compareTo(BigDecimal.ZERO) < 0 || nota.compareTo(BigDecimal.valueOf(5.0)) > 0) {
            throw new BusinessException("La nota debe estar dentro del rango permitido (0.0 a 5.0).");
        }
    }

    private EvaluacionResponse convertToResponse(Evaluacion eval) {
        return EvaluacionResponse.builder()
                .id(eval.getId())
                .practicaId(eval.getPractica().getId())
                .notaDocente(eval.getNotaDocente())
                .observacionesDocente(eval.getObservacionesDocente())
                .fechaEvaluacionDocente(eval.getFechaEvaluacionDocente())
                .notaTutor(eval.getNotaTutor())
                .observacionesTutor(eval.getObservacionesTutor())
                .fechaEvaluacionTutor(eval.getFechaEvaluacionTutor())
                .notaFinal(eval.getNotaFinal())
                .observacionesFinales(eval.getObservacionesFinales())
                .fechaEvaluacionFinal(eval.getFechaEvaluacionFinal())
                .resultado(eval.getPractica().getResultado())
                .activo(eval.isActivo())
                .build();
    }
}