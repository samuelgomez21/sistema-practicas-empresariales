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

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioFacade usuarioFacade;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'SECRETARIA_COORDINACION', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<UsuarioDto>> listarUsuarios() {
        return ResponseEntity.ok(usuarioFacade.obtenerTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'SECRETARIA_COORDINACION', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<UsuarioDto> obtenerUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioFacade.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<UsuarioDto> crearUsuario(@RequestBody UsuarioDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioFacade.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<UsuarioDto> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDto request) {
        return ResponseEntity.ok(usuarioFacade.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioFacade.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        usuarioFacade.activar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/programas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<ProgramaResumenDto>> obtenerProgramas(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioFacade.obtenerProgramas(id));
    }

    @PutMapping("/{id}/programas")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> asignarProgramas(
            @PathVariable Long id,
            @RequestBody AsignarProgramasRequest request) {
        usuarioFacade.asignarProgramas(id, request.getProgramaIds());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/docentes-carga")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<DocenteCargaDto>> listarDocentesConCarga() {
        return ResponseEntity.ok(usuarioFacade.listarDocentesConCarga());
    }

    @PatchMapping("/{id}/max-estudiantes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<Void> actualizarMaxEstudiantes(@PathVariable Long id, @RequestBody MaxEstudiantesRequest request) {
        usuarioFacade.actualizarMaxEstudiantes(id, request.getMax());
        return ResponseEntity.ok().build();
    }
}