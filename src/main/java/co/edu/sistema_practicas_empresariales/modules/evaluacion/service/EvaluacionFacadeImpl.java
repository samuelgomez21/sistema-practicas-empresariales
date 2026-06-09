package co.edu.sistema_practicas_empresariales.modules.evaluacion.service;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionRequest;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.dto.EvaluacionResponse;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluacionFacadeImpl implements EvaluacionFacade {

    private final EvaluacionRepository evaluacionRepository;
    private final PracticaRepository practicaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public EvaluacionResponse registrarEvaluacion(EvaluacionRequest request) {
        Practica practica = practicaRepository.findById(request.getPracticaId())
                .orElseThrow(() -> new IllegalArgumentException("Práctica no encontrada"));

        Usuario evaluador = usuarioRepository.findById(request.getEvaluadorId())
                .orElseThrow(() -> new IllegalArgumentException("Evaluador no encontrado"));

        Evaluacion evaluacion = Evaluacion.builder()
                .practica(practica)
                .evaluador(evaluador)
                .tipo(request.getTipo())
                .criteriosJson(request.getCriteriosJson())
                .puntajeFinal(request.getPuntajeFinal())
                .comentarios(request.getComentarios())
                .build();

        evaluacion = evaluacionRepository.save(evaluacion);
        return mapToResponse(evaluacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvaluacionResponse> listarPorPractica(Long practicaId) {
        return evaluacionRepository.findByPracticaIdAndActivoTrue(practicaId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EvaluacionResponse obtenerPorId(Long id) {
        Evaluacion evaluacion = evaluacionRepository.findById(id)
                .filter(Evaluacion::isActivo)
                .orElseThrow(() -> new IllegalArgumentException("Evaluación no encontrada"));
        return mapToResponse(evaluacion);
    }

    @Override
    @Transactional
    public void eliminarEvaluacion(Long id) {
        Evaluacion evaluacion = evaluacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evaluación no encontrada"));
        evaluacion.setActivo(false); // Soft delete
        evaluacionRepository.save(evaluacion);
    }

    private EvaluacionResponse mapToResponse(Evaluacion evaluacion) {
        return EvaluacionResponse.builder()
                .id(evaluacion.getId())
                .practicaId(evaluacion.getPractica().getId())
                .evaluadorId(evaluacion.getEvaluador().getId())
                .nombreEvaluador(evaluacion.getEvaluador().getNombre())
                .tipo(evaluacion.getTipo())
                .criteriosJson(evaluacion.getCriteriosJson())
                .puntajeFinal(evaluacion.getPuntajeFinal())
                .comentarios(evaluacion.getComentarios())
                .fechaCreacion(evaluacion.getFechaCreacion())
                .build();
    }
}
