package co.edu.sistema_practicas_empresariales.modules.usuario.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.ProgramaResumenDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.dto.UsuarioDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.CoordinadorPrograma;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.CoordinadorProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.shared.email.EmailService;
import co.edu.sistema_practicas_empresariales.shared.email.templates.EmailTemplates;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;


/**
 * Implementación de la fachada del módulo de usuarios.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade.
 * Esta clase actúa como un intermediario simplificado entre el controlador REST
 * y
 * los servicios de dominio de usuario. Centraliza la conversión entre Entidades
 * (Usuario)
 * y DTOs (UsuarioDto), aislando al controlador de la complejidad del modelo de
 * datos
 * y las reglas de mapeo.
 *
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
@Transactional
@lombok.extern.slf4j.Slf4j
public class UsuarioFacadeImpl implements UsuarioFacade {

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String USUARIO_NO_ENCONTRADO_ID = "Usuario no encontrado con id: ";

    private final CoordinadorProgramaRepository coordinadorProgramaRepository;
    private final ProgramaRepository programaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository rolRepository;
    private final EmailService emailService;
    private final co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository practicaRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

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
            co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol.Nombre rolNombre = co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol.Nombre
                    .valueOf(dto.getRol());
            co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol rol = rolRepository.findByNombre(rolNombre)
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + dto.getRol()));
            builder.rol(rol);
        }

        return builder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDto> obtenerTodos() {
        return usuarioRepository.findAllByEliminadoFalse()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDto obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException(USUARIO_NO_ENCONTRADO_ID + id));
        return mapToDto(usuario);
    }

    @Override
    @co.edu.sistema_practicas_empresariales.modules.bitacora.annotation.Auditable(accion = "CREAR", modulo = "USUARIOS")
    public UsuarioDto crear(UsuarioDto usuarioDto) {
        Usuario usuario = mapToEntity(usuarioDto);
        Objects.requireNonNull(usuario, "Usuario no puede ser null");
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        // Capturamos la contraseña en texto plano ANTES de cifrarla,
        // para poder enviarla por correo al usuario.
        String passwordTemporal;
        if (usuario.getPassword() != null) {
            passwordTemporal = usuario.getPassword();
        } else {
            passwordTemporal = java.util.UUID.randomUUID().toString().substring(0, 8);
        }
        usuario.setPassword(passwordEncoder.encode(passwordTemporal));
        usuario.setDebeCambiarPassword(true);

        Usuario guardado = usuarioRepository.save(usuario);
        log.info("antes de el email");
        emailService.sendEmail(
                guardado.getEmail(),
                "Bienvenido al Sistema de Prácticas UAH — Credenciales de acceso",
                EmailTemplates.credencialesAcceso(guardado.getNombre(), guardado.getEmail(), passwordTemporal,
                        frontendUrl));
        log.info("despues de el email");
        return mapToDto(guardado);
    }

    @Override
    @co.edu.sistema_practicas_empresariales.modules.bitacora.annotation.Auditable(accion = "ACTUALIZAR", modulo = "USUARIOS")
    public UsuarioDto actualizar(Long id, UsuarioDto usuarioDto) {
        Usuario datosNuevos = mapToEntity(usuarioDto);
        Objects.requireNonNull(datosNuevos, "Usuario no puede ser null");

        Usuario existente = usuarioRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException(USUARIO_NO_ENCONTRADO_ID + id));

        existente.setEmail(datosNuevos.getEmail());
        existente.setNombre(datosNuevos.getNombre());
        existente.setActivo(datosNuevos.isActivo());
        if (datosNuevos.getRol() != null) {
            existente.setRol(datosNuevos.getRol());
        }
        if (datosNuevos.getPassword() != null) {
            existente.setPassword(datosNuevos.getPassword());
        }

        Usuario actualizado = usuarioRepository.save(existente);
        return mapToDto(actualizado);
    }

    @Override
    @Transactional
    @co.edu.sistema_practicas_empresariales.modules.bitacora.annotation.Auditable(accion = "ELIMINAR", modulo = "USUARIOS")
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(USUARIO_NO_ENCONTRADO));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void activar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(USUARIO_NO_ENCONTRADO));
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgramaResumenDto> obtenerProgramas(Long usuarioId) {
        return coordinadorProgramaRepository.findByUsuarioId(usuarioId).stream()
                .map(cp -> ProgramaResumenDto.builder()
                        .id(cp.getPrograma().getId())
                        .nombre(cp.getPrograma().getNombre())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void asignarProgramas(Long usuarioId, List<Long> programaIds) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException(USUARIO_NO_ENCONTRADO));

        // Elimina las asignaciones actuales
        List<CoordinadorPrograma> actuales = coordinadorProgramaRepository.findByUsuarioId(usuarioId);
        coordinadorProgramaRepository.deleteAll(actuales);

        // Crea las nuevas
        List<CoordinadorPrograma> nuevas = programaIds.stream()
                .map(programaId -> {
                    Programa programa = programaRepository.findById(programaId)
                            .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado: " + programaId));
                    return CoordinadorPrograma.builder()
                            .usuario(usuario)
                            .programa(programa)
                            .build();
                })
                .toList();

        coordinadorProgramaRepository.saveAll(nuevas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto> listarDocentesConCarga() {
        return usuarioRepository.findByRolNombreAndEliminadoFalse(
                co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol.Nombre.DOCENTE_ASESOR)
                .stream()
                .map(this::toDocenteCargaDto)
                .toList();
    }

    private co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto toDocenteCargaDto(
            Usuario docente) {
        List<co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto.EstudianteAsignadoDto> activos = practicaRepository
                .findAsignadasActivasByDocente(docente.getId()).stream()
                .map(p -> co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto.EstudianteAsignadoDto
                        .builder()
                        .id(p.getEstudiante().getId())
                        .nombre(p.getEstudiante().getUsuario().getNombre())
                        .programa(p.getEstudiante().getPrograma().getNombre())
                        .semestre(p.getEstudiante().getSemestre())
                        .build())
                .toList();

        return co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto.builder()
                .id(docente.getId())
                .nombre(docente.getNombre())
                .correo(docente.getEmail())
                .maxEstudiantes(docente.getMaxEstudiantes())
                .estudiantesActivos(activos)
                .build();
    }

    @Override
    @Transactional
    @co.edu.sistema_practicas_empresariales.modules.bitacora.annotation.Auditable(accion = "ACTUALIZAR", modulo = "USUARIOS")
    public void actualizarMaxEstudiantes(Long docenteId, int max) {
        Usuario docente = usuarioRepository.findById(docenteId)
                .orElseThrow(() -> new IllegalArgumentException("Docente no encontrado"));
        docente.setMaxEstudiantes(max);
        usuarioRepository.save(docente);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDto obtenerPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(USUARIO_NO_ENCONTRADO));
        return mapToDto(usuario);
    }

}
