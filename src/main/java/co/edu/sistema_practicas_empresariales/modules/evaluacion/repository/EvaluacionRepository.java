package co.edu.sistema_practicas_empresariales.modules.evaluacion.repository;

import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    Optional<Evaluacion> findByPracticaIdAndActivoTrue(Long practicaId);
}
