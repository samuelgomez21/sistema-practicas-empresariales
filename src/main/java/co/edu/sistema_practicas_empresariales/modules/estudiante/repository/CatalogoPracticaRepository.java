package co.edu.sistema_practicas_empresariales.modules.estudiante.repository;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.CatalogoPractica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogoPracticaRepository extends JpaRepository<CatalogoPractica, Long> {
    List<CatalogoPractica> findByProgramaIdAndActivoTrue(Long programaId);
    Optional<CatalogoPractica> findByProgramaIdAndNumeroPracticaAndActivoTrue(Long programaId, int numeroPractica);
    boolean existsByProgramaIdAndNumeroPracticaAndActivoTrue(Long programaId, int numeroPractica);
}
