package co.edu.sistema_practicas_empresariales.modules.encuesta.repository;

import co.edu.sistema_practicas_empresariales.modules.encuesta.model.EncuestaRespuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EncuestaRespuestaRepository extends JpaRepository<EncuestaRespuesta, Long> {

    Optional<EncuestaRespuesta> findByPracticaIdAndTipo(Long practicaId, TipoEncuesta tipo);

    boolean existsByPracticaIdAndTipo(Long practicaId, TipoEncuesta tipo);

    List<EncuestaRespuesta> findByPracticaId(Long practicaId);
    List<EncuestaRespuesta> findByTipo(TipoEncuesta tipo);

}