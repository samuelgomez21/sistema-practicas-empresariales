package co.edu.sistema_practicas_empresariales.modules.configuracion.repository;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogoPracticaRepository extends JpaRepository<CatalogoPractica, Long> {
    List<CatalogoPractica> findByProgramaIdAndActivoTrue(Long programaId);
    Optional<CatalogoPractica> findByProgramaIdAndNumeroPracticaAndActivoTrue(Long programaId, int numeroPractica);
    boolean existsByProgramaIdAndNumeroPracticaAndActivoTrue(Long programaId, int numeroPractica);

    @Query("""
            SELECT COUNT(p) FROM Practica p
            WHERE p.catalogoPractica.id = :catalogoId
            AND p.estado NOT IN ('COMPLETADA', 'REPROBADA', 'CANCELADA')
        """)
    long countActivasByCatalogoId(@Param("catalogoId") Long catalogoId);

    List<CatalogoPractica> findByProgramaId(Long programaId);

}
