package co.edu.sistema_practicas_empresariales.modules.empresa.repository;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.empresa.state.EstadoVacanteTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacanteRepository extends JpaRepository<Vacante, Long> {
    List<Vacante> findByEmpresaId(Long empresaId);
    List<Vacante> findByEstado(EstadoVacanteTipo estado);
}
