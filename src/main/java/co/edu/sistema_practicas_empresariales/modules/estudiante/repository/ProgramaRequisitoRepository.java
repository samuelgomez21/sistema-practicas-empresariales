package co.edu.sistema_practicas_empresariales.modules.estudiante.repository;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProgramaRequisitoRepository extends JpaRepository<ProgramaRequisito, Long> {
    Optional<ProgramaRequisito> findByProgramaIdAndNumeroPractica(Long programaId, int numeroPractica);
}
