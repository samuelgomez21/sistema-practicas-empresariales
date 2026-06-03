package co.edu.sistema_practicas_empresariales.modules.usuario.repository;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

/**
 * Repositorio para la entidad {@link Usuario}.
 * Incluye métodos para soft‑delete y consultas filtradas por el flag {@code eliminado}.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    /** Busca un usuario por su email. */
    Optional<Usuario> findByEmail(String email);

    /** Verifica si existe un usuario con el email dado. */
    boolean existsByEmail(String email);
    Optional<Usuario> findByResetPasswordToken(String resetPasswordToken);

    /** Soft‑delete: marca el registro como eliminado sin borrarlo físicamente. */
    @Modifying
    @Query("UPDATE Usuario u SET u.eliminado = true WHERE u.id = :id")
    void softDelete(@Param("id") Long id);

    /** Busca un usuario activo por id. */
    Optional<Usuario> findByIdAndEliminadoFalse(Long id);

    /** Lista todos los usuarios que no están marcados como eliminados. */
    List<Usuario> findAllByEliminadoFalse();
}
