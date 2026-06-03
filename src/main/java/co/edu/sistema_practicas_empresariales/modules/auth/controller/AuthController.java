package co.edu.sistema_practicas_empresariales.modules.auth.controller;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.*;
import co.edu.sistema_practicas_empresariales.modules.auth.service.AuthFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthFacade authFacade;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authFacade.login(request));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<Void> registerAdmin() {
        authFacade.registerSemillaAdmin();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recuperar-password")
    public ResponseEntity<Void> solicitarRecuperacionPassword(@Valid @RequestBody RecuperarPasswordDto request) {
        authFacade.solicitarRecuperacionPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetearPassword(@Valid @RequestBody ResetPasswordDto request) {
        authFacade.resetearPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cambiar-password-inicial")
    public ResponseEntity<Void> cambiarPasswordPrimerIngreso(@Valid @RequestBody CambiarPasswordInicialDto request) {
        authFacade.cambiarPasswordPrimerIngreso(request);
        return ResponseEntity.noContent().build();
    }
}
