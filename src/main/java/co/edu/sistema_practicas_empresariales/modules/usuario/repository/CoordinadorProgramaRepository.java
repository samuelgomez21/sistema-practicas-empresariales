package co.edu.sistema_practicas_empresariales.modules.usuario.repository;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.CoordinadorPrograma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoordinadorProgramaRepository extends JpaRepository<CoordinadorPrograma, Long> {

    List<CoordinadorPrograma> findByUsuarioId(Long usuarioId);

    void deleteByUsuarioIdAndProgramaId(Long usuarioId, Long programaId);

    boolean existsByUsuarioIdAndProgramaId(Long usuarioId, Long programaId);
}