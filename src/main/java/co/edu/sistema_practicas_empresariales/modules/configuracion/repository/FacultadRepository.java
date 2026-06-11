package co.edu.sistema_practicas_empresariales.modules.configuracion.repository;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Facultad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultadRepository extends JpaRepository<Facultad, Long> {
}
