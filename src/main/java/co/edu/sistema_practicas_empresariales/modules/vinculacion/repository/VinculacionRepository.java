package co.edu.sistema_practicas_empresariales.modules.vinculacion.repository;

import co.edu.sistema_practicas_empresariales.modules.vinculacion.model.Vinculacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

/**
 * Repositorio para la entidad Vinculacion. Incluye consultas que excluyen los registros marcados
 * como eliminados (soft‑delete).
 */
@Repository
public interface VinculacionRepository extends JpaRepository<Vinculacion, Long> {

    List<Vinculacion> findAllByEliminadoFalse();

    Optional<Vinculacion> findByIdAndEliminadoFalse(Long id);

    @Modifying
    @Transactional
    @Query("update Vinculacion v set v.eliminado = true where v.id = :id")
    void softDelete(Long id);
}
