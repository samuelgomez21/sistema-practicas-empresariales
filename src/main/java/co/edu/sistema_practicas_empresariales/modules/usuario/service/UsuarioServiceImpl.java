package co.edu.sistema_practicas_empresariales.modules.usuario.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects; // for null checks
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Servicio para la entidad {@link Usuario}.
 *
 * <p>Implementa la lógica de negocio respetando los principios SOLID y
 * utilizando Soft‑Delete para la eliminación de usuarios.</p>
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    /**
 * Obtiene todos los usuarios activos.
 * @return lista de usuarios no eliminados
 */
@Transactional(readOnly = true)
public List<Usuario> obtenerTodos() {
        // Sólo devuelve usuarios activos (no eliminados)
        return usuarioRepository.findAllByEliminadoFalse();
    }

    @Override
    /**
 * Busca un usuario activo por su id.
 * @param id identificador del usuario
 * @return usuario encontrado
 * @throws IllegalArgumentException si no existe o está eliminado
 */
@Transactional(readOnly = true)
public Usuario obtenerPorId(Long id) {
        // Busca un usuario activo por id
        return usuarioRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + id));
    }

    @Override
    /**
 * Crea un nuevo usuario después de validar que el email no exista.
 * @param usuario entidad a crear
 * @return usuario creado
 * @throws IllegalArgumentException si el email ya está registrado
 */
public Usuario crear(Usuario usuario) {
    Objects.requireNonNull(usuario, "Usuario no puede ser null");
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }
        if (usuario.getPassword() != null) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        } else {
            // Generate a random default password if not provided
            String generated = java.util.UUID.randomUUID().toString().substring(0, 8);
            usuario.setPassword(passwordEncoder.encode(generated));
        }
        usuario.setDebeCambiarPassword(true);
        return usuarioRepository.save(usuario);
    }

    @Override
    /**
 * Actualiza los campos permitidos de un usuario existente.
 * @param id identificador del usuario a actualizar
 * @param usuario datos con los que se actualiza
 * @return usuario actualizado
 * @throws IllegalArgumentException si el usuario no existe
 */
public Usuario actualizar(Long id, Usuario usuario) {
    Objects.requireNonNull(usuario, "Usuario no puede ser null");
        Usuario existente = obtenerPorId(id);
        // Actualizamos solo los campos permitidos
        existente.setEmail(usuario.getEmail());
        existente.setNombre(usuario.getNombre());
        existente.setActivo(usuario.isActivo());
        existente.setRol(usuario.getRol());
        existente.setPassword(usuario.getPassword()); // Se asume que ya está codificado
        return usuarioRepository.save(existente);
    }

    @Override
    /**
 * Elimina lógicamente (soft‑delete) un usuario.
 * @param id identificador del usuario a eliminar
 */
public void eliminar(Long id) {
        // Soft‑delete mediante el repositorio
        usuarioRepository.softDelete(id);
    }
}
