package co.edu.sistema_practicas_empresariales.modules.configuracion.repository;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.ProgramaParametro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProgramaParametroRepository extends JpaRepository<ProgramaParametro, Long> {
    Optional<ProgramaParametro> findByProgramaId(Long programaId);
}
