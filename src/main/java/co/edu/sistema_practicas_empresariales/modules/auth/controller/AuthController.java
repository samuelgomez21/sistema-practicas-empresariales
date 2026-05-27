package co.edu.sistema_practicas_empresariales.modules.auth.controller;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.LoginRequest;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.JwtResponse;
import co.edu.sistema_practicas_empresariales.modules.auth.service.AuthFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthFacade authFacade;

    /**
     * Endpoint to authenticate a user and receive a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        JwtResponse response = authFacade.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to create the seed admin user (idempotent).
     * Typically called once at application start or manually by an admin.
     */
    @PostMapping("/register-admin")
    public ResponseEntity<Void> registerAdmin() {
        authFacade.registerSemillaAdmin();
        return ResponseEntity.ok().build();
    }
}
