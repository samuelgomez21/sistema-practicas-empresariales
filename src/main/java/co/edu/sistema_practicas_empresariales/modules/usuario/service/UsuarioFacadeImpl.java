package co.edu.sistema_practicas_empresariales.modules.usuario.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.dto.UsuarioDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación de la fachada del módulo de usuarios.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade.
 * Esta clase actúa como un intermediario simplificado entre el controlador REST y
 * los servicios de dominio de usuario. Centraliza la conversión entre Entidades (Usuario)
 * y DTOs (UsuarioDto), aislando al controlador de la complejidad del modelo de datos
 * y las reglas de mapeo.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class UsuarioFacadeImpl implements UsuarioFacade {

    private final UsuarioService usuarioService;
    private final co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository rolRepository;

    /**
     * Mapea una entidad Usuario a su correspondiente DTO.
     *
     * @param u Entidad Usuario.
     * @return DTO del usuario.
     */
    private UsuarioDto mapToDto(Usuario u) {
        return UsuarioDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .activo(u.isActivo())
                .rol(u.getRol() != null ? u.getRol().getNombre().name() : null)
                .build();
    }

    /**
     * Mapea un DTO de Usuario a una entidad de persistencia.
     *
     * @param dto DTO del usuario recibido desde el controlador.
     * @return Entidad Usuario parcial (el rol se resuelve en el servicio).
     */
    private Usuario mapToEntity(UsuarioDto dto) {
        Usuario.UsuarioBuilder builder = Usuario.builder()
                .email(dto.getEmail())
                .nombre(dto.getNombre())
                .password(dto.getPassword())
                .activo(dto.isActivo());
        if (dto.getId() != null) {
            builder.id(dto.getId());
        }
        
        if (dto.getRol() != null) {
            co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol.Nombre rolNombre = 
                    co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol.Nombre.valueOf(dto.getRol());
            co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol rol = 
                    rolRepository.findByNombre(rolNombre)
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + dto.getRol()));
            builder.rol(rol);
        }

        return builder.build();
    }

    @Override
    /**
     * Recupera y mapea a DTO todos los usuarios del sistema.
     *
     * @return Lista de todos los usuarios (DTOs).
     */
    public List<UsuarioDto> obtenerTodos() {
        return usuarioService.obtenerTodos()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    /**
     * Obtiene un usuario específico por su ID y lo convierte a DTO.
     *
     * @param id ID del usuario.
     * @return DTO del usuario.
     */
    public UsuarioDto obtenerPorId(Long id) {
        return mapToDto(usuarioService.obtenerPorId(id));
    }

    @Override
    /**
     * Coordina la creación de un nuevo usuario delegando al servicio de dominio.
     *
     * @param usuarioDto DTO con los datos del usuario a crear.
     * @return DTO del usuario creado y persistido.
     */
    public UsuarioDto crear(UsuarioDto usuarioDto) {
        Usuario guardado = usuarioService.crear(mapToEntity(usuarioDto));
        return mapToDto(guardado);
    }

    @Override
    /**
     * Actualiza la información de un usuario existente.
     *
     * @param id ID del usuario a modificar.
     * @param usuarioDto Nuevos datos.
     * @return DTO del usuario actualizado.
     */
    public UsuarioDto actualizar(Long id, UsuarioDto usuarioDto) {
        Usuario actualizado = usuarioService.actualizar(id, mapToEntity(usuarioDto));
        return mapToDto(actualizado);
    }

    @Override
    /**
     * Realiza el borrado lógico del usuario en el sistema.
     *
     * @param id ID del usuario a desactivar.
     */
    public void eliminar(Long id) {
        usuarioService.eliminar(id);
    }
}
