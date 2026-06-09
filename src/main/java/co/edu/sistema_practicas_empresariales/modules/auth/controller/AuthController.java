package co.edu.sistema_practicas_empresariales.modules.auth.controller;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.CambiarPasswordInicialDto;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.JwtResponse;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.LoginRequest;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.RecuperarPasswordDto;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.ResetPasswordDto;
import co.edu.sistema_practicas_empresariales.modules.auth.service.AuthFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la gestión de la autenticación y seguridad.
 * <p>
 * Gestiona el inicio de sesión, recuperación de contraseñas y registro
 * de usuarios administradores semilla.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link AuthFacade}).
 * Este controlador expone los endpoints y delega toda la lógica de validación de tokens,
 * cifrado de contraseñas y notificaciones por correo a la fachada de autenticación.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthFacade authFacade;

    /**
     * Autentica a un usuario en el sistema.
     *
     * @param request DTO con correo y contraseña.
     * @return ResponseEntity con el token JWT si las credenciales son válidas.
     */
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authFacade.login(request));
    }

    /**
     * Registra el usuario administrador por defecto del sistema (semilla).
     * Usado para inicializar la base de datos vacía.
     *
     * @return HTTP 200 OK.
     */
    @PostMapping("/register-admin")
    public ResponseEntity<Void> registerAdmin() {
        authFacade.registerSemillaAdmin();
        return ResponseEntity.ok().build();
    }

    /**
     * Solicita un enlace de recuperación de contraseña enviado por correo (Patrón Adapter - Email).
     *
     * @param request DTO con el correo electrónico del usuario.
     * @return HTTP 204 No Content.
     */
    @PostMapping("/recuperar-password")
    public ResponseEntity<Void> solicitarRecuperacionPassword(@Valid @RequestBody RecuperarPasswordDto request) {
        authFacade.solicitarRecuperacionPassword(request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Permite restablecer la contraseña utilizando un token válido.
     *
     * @param request DTO con el token y la nueva contraseña.
     * @return HTTP 204 No Content.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetearPassword(@Valid @RequestBody ResetPasswordDto request) {
        authFacade.resetearPassword(request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Permite cambiar la contraseña obligatoria en el primer ingreso al sistema.
     *
     * @param request DTO con la nueva contraseña segura.
     * @return HTTP 204 No Content.
     */
    @PostMapping("/cambiar-password-inicial")
    public ResponseEntity<Void> cambiarPasswordPrimerIngreso(@Valid @RequestBody CambiarPasswordInicialDto request) {
        authFacade.cambiarPasswordPrimerIngreso(request);
        return ResponseEntity.noContent().build();
    }
}
