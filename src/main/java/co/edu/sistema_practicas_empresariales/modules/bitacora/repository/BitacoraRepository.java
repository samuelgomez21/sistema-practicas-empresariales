package co.edu.sistema_practicas_empresariales.modules.bitacora.repository;

import co.edu.sistema_practicas_empresariales.modules.bitacora.model.Bitacora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Bitacora.
 */
@Repository
public interface BitacoraRepository extends JpaRepository<Bitacora, Long> {
}
