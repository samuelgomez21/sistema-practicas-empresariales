package co.edu.sistema_practicas_empresariales.modules.cierre.service.chain;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.exception.BusinessException;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValidadorNotaDocente extends BaseValidadorCierre {

    private final EvaluacionRepository evaluacionRepository;

    @Override
    public void validar(Practica practica) {
        Evaluacion evaluacion = evaluacionRepository.findByPracticaIdAndActivoTrue(practica.getId())
                .orElseThrow(() -> new BusinessException("No se ha registrado ninguna evaluación para esta práctica."));

        if (evaluacion.getNotaDocente() == null) {
            throw new BusinessException("El docente asesor aún no ha registrado la calificación.");
        }

        verificarSiguiente(practica);
    }
}
