package co.edu.sistema_practicas_empresariales.modules.encuesta.repository;

import co.edu.sistema_practicas_empresariales.modules.encuesta.model.EncuestaPlantilla;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EncuestaPlantillaRepository
        extends JpaRepository<EncuestaPlantilla, Long> {

    Optional<EncuestaPlantilla> findByTipoAndActivaTrue(TipoEncuesta tipo);
}