package co.edu.sistema_practicas_empresariales.modules.usuario.controller;

import co.edu.sistema_practicas_empresariales.modules.usuario.dto.AsignarProgramasRequest;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.ProgramaResumenDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.dto.MaxEstudiantesRequest;
import co.edu.sistema_practicas_empresariales.modules.usuario.dto.UsuarioDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.service.UsuarioFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para el módulo de Gestión de Usuarios.
 * <p>
 * Facilita operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los usuarios del sistema.
 * <p>
 * <b>Roles y Permisos:</b> Las acciones principales de creación, edición y borrado lógico
 * están estrictamente limitadas a administradores o coordinadores.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link UsuarioFacade}).
 * Este controlador recibe las peticiones, verifica los roles mediante Spring Security,
 * y delega la ejecución del proceso a la fachada.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioFacade usuarioFacade;

    /**
     * Obtiene la lista de todos los usuarios activos en el sistema.
     * Permitido para Administradores, Coordinadores y Secretarias.
     *
     * @return ResponseEntity con la lista de usuarios.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'SECRETARIA_COORDINACION')")
    public ResponseEntity<List<UsuarioDto>> listarUsuarios() {
        return ResponseEntity.ok(usuarioFacade.obtenerTodos());
    }

    /**
     * Obtiene los detalles de un usuario específico por su ID.
     * Permitido para Administradores, Coordinadores y Secretarias.
     *
     * @param id Identificador único del usuario.
     * @return ResponseEntity con el DTO del usuario encontrado.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'SECRETARIA_COORDINACION')")
    public ResponseEntity<UsuarioDto> obtenerUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioFacade.obtenerPorId(id));
    }

    /**
     * Crea un nuevo usuario en el sistema.
     * Exclusivo para el rol Administrador.
     *
     * @param request Datos del nuevo usuario (correo, roles, etc.).
     * @return ResponseEntity con el usuario creado y status 201 Created.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioDto> crearUsuario(@RequestBody UsuarioDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioFacade.crear(request));
    }

    /**
     * Actualiza la información de un usuario existente.
     * Exclusivo para el rol Administrador.
     *
     * @param id Identificador del usuario a modificar.
     * @param request Nuevos datos del usuario.
     * @return ResponseEntity con el usuario actualizado.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<UsuarioDto> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDto request) {
        return ResponseEntity.ok(usuarioFacade.actualizar(id, request));
    }

    /**
     * Realiza un borrado lógico (desactivación) de un usuario en el sistema.
     * Exclusivo para el rol Administrador.
     *
     * @param id Identificador del usuario a eliminar.
     * @return ResponseEntity HTTP 204 No Content.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioFacade.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Reactiva un usuario previamente desactivado (inverso al soft-delete).
     */
    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        usuarioFacade.activar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista los programas asignados a un coordinador académico.
     */
    @GetMapping("/{id}/programas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<ProgramaResumenDto>> obtenerProgramas(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioFacade.obtenerProgramas(id));
    }

    /**
     * Asigna (reemplaza) los programas que gestiona un coordinador académico.
     * Solo el administrador puede definir el alcance de cada coordinador.
     */
    @PutMapping("/{id}/programas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> asignarProgramas(
            @PathVariable Long id,
            @RequestBody AsignarProgramasRequest request) {
        usuarioFacade.asignarProgramas(id, request.getProgramaIds());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/docentes-carga")
    public ResponseEntity<List<DocenteCargaDto>> listarDocentesConCarga() {
        return ResponseEntity.ok(usuarioFacade.listarDocentesConCarga());
    }

    @PatchMapping("/{id}/max-estudiantes")
    public ResponseEntity<Void> actualizarMaxEstudiantes(@PathVariable Long id, @RequestBody MaxEstudiantesRequest request) {
        usuarioFacade.actualizarMaxEstudiantes(id, request.getMax());
        return ResponseEntity.ok().build();
    }

}
