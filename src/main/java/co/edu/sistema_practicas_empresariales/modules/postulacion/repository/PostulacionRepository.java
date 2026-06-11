package co.edu.sistema_practicas_empresariales.modules.postulacion.repository;

import co.edu.sistema_practicas_empresariales.modules.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.EstadoPostulacionTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

    List<Postulacion> findByVacanteId(Long vacanteId);
    List<Postulacion> findByEstudianteId(Long estudianteId);
    List<Postulacion> findByEstado(EstadoPostulacionTipo estado);
    Optional<Postulacion> findByVacanteIdAndEstudianteId(Long vacanteId, Long estudianteId);
}
