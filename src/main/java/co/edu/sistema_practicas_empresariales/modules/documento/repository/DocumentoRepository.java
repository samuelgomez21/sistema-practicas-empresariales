package co.edu.sistema_practicas_empresariales.modules.documento.repository;

import co.edu.sistema_practicas_empresariales.modules.documento.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

/**
 * Repositorio para la entidad Documento.
 * Incluye consultas que excluyen los registros marcados como eliminados (soft‑delete).
 */
@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findAllByEliminadoFalse();

    Optional<Documento> findByIdAndEliminadoFalse(Long id);

    @Modifying
    @Transactional
    @Query("update Documento d set d.eliminado = true where d.id = :id")
    void softDelete(Long id);
}
