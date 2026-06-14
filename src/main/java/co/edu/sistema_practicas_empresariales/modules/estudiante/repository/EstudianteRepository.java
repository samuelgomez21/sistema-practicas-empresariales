package co.edu.sistema_practicas_empresariales.modules.estudiante.repository;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    Optional<Estudiante> findByIdentificacion(String identificacion);

    Optional<Estudiante> findByUsuarioId(Long usuarioId);

    Optional<Estudiante> findByUsuarioEmail(String email);

    List<Estudiante> findByProgramaIdAndActivoTrue(Long programaId);

    List<Estudiante> findByActivoTrue();

    @Query("SELECT e FROM Estudiante e WHERE e.estadoAptitud = co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante.EstadoAptitud.APTO AND e.activo = true")
    List<Estudiante> findAptos();

    boolean existsByIdentificacion(String identificacion);
    
    boolean existsByProgramaId(Long programaId);

    Optional<Estudiante> findByUsuario_Email(String email);

}
