package co.edu.sistema_practicas_empresariales.modules.configuracion.repository;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramaRepository extends JpaRepository<Programa, Long> {
    List<Programa> findByActivoTrue();
    List<Programa> findByFacultadId(Long facultadId);
    List<Programa> findByFacultadIdAndActivoTrue(Long facultadId);
}
