package co.edu.sistema_practicas_empresariales.modules.usuario.controller;

import co.edu.sistema_practicas_empresariales.modules.usuario.dto.UsuarioDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.service.UsuarioFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioFacade usuarioFacade;

    @GetMapping
    public ResponseEntity<Object> listarUsuarios() {
        return ResponseEntity.ok(usuarioFacade.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> obtenerUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioFacade.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Object> crearUsuario(@RequestBody UsuarioDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioFacade.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDto request) {
        return ResponseEntity.ok(usuarioFacade.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> eliminarUsuario(@PathVariable Long id) {
        usuarioFacade.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
