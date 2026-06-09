package co.edu.sistema_practicas_empresariales.modules.evaluacion.repository;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.TipoEvaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByPracticaIdAndActivoTrue(Long practicaId);
    Optional<Evaluacion> findByPracticaIdAndTipoAndActivoTrue(Long practicaId, TipoEvaluacion tipo);
}
