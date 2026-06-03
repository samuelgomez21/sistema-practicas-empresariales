package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.repository;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

/**
 * Repositorio para la entidad Postulacion.
 * Incluye operaciones que excluyen los registros marcados como eliminados (soft‑delete).
 */
@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

    List<Postulacion> findAllByEliminadoFalse();

    Optional<Postulacion> findByIdAndEliminadoFalse(Long id);

    @Modifying
    @Transactional
    @Query("update Postulacion p set p.eliminado = true where p.id = :id")
    void softDelete(Long id);
}
