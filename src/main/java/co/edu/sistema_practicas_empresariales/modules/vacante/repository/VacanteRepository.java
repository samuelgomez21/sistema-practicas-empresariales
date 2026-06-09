package co.edu.sistema_practicas_empresariales.modules.vacante.repository;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface VacanteRepository extends JpaRepository<Vacante, Long> {
    List<Vacante> findByEmpresaId(Long empresaId);
    List<Vacante> findByEstado(EstadoVacanteTipo estado);
    Optional<Vacante> findById(Long id);
}
