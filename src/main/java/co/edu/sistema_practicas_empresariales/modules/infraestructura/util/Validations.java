package co.edu.sistema_practicas_empresariales.modules.infraestructura.util;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import java.util.Objects;

/**
 * Clase de utilidades que centraliza validaciones comunes de entidades.
 * Se utilizan en los facades para evitar código duplicado y cumplir con los
 * requisitos de Sonar (evitar NullPointerException y reducir complejidad).
 */
public final class Validations {

    private Validations() {
        // Clase de utilidades, no instanciable.
    }

    public static Vacante validarVacante(Long id, VacanteRepository repo) {
        Objects.requireNonNull(id, "Id de Vacante no puede ser null");
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada o eliminada"));
    }

    public static Usuario validarUsuario(Long id, UsuarioRepository repo) {
        Objects.requireNonNull(id, "Id de Usuario no puede ser null");
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado o eliminado"));
    }
}
