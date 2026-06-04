package co.edu.sistema_practicas_empresariales.modules.encuesta.repository;

import co.edu.sistema_practicas_empresariales.modules.encuesta.model.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {
    Optional<Encuesta> findByPracticaIdAndTipoActorAndActivoTrue(Long practicaId, Encuesta.TipoActor tipoActor);
    List<Encuesta> findByPracticaIdAndActivoTrue(Long practicaId);
}
