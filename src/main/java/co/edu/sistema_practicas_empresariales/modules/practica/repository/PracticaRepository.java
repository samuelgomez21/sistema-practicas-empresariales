package co.edu.sistema_practicas_empresariales.modules.practica.repository;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PracticaRepository extends JpaRepository<Practica, Long> {
    List<Practica> findByEstudianteIdOrderByNumeroPracticaAsc(Long estudianteId);
    Optional<Practica> findByEstudianteIdAndNumeroPractica(Long estudianteId, int numeroPractica);
    
    // Buscar si el estudiante tiene alguna práctica activa (en curso, asignada, vinculación, etc.)
    boolean existsByEstudianteIdAndEstadoNotIn(Long estudianteId, List<co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo> estadosCerrados);
}
