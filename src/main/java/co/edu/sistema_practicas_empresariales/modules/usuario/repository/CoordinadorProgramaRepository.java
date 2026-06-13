package co.edu.sistema_practicas_empresariales.modules.usuario.repository;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.CoordinadorPrograma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoordinadorProgramaRepository extends JpaRepository<CoordinadorPrograma, Long> {

    /**
     * Lista todas las relaciones coordinador-programa para un usuario específico.
     */
    List<CoordinadorPrograma> findByUsuarioId(Long usuarioId);

    /**
     * Elimina la relación entre un usuario y un programa específico.
     */
    void deleteByUsuarioIdAndProgramaId(Long usuarioId, Long programaId);

    /**
     * Verifica si ya existe una relación entre un usuario y un programa.
     */
    boolean existsByUsuarioIdAndProgramaId(Long usuarioId, Long programaId);


}