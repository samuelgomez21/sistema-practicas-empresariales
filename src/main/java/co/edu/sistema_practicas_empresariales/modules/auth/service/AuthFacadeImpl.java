package co.edu.sistema_practicas_empresariales.modules.auth.service;

// PR update – full file content
import co.edu.sistema_practicas_empresariales.modules.auth.dto.*;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.security.JwtTokenProvider;
import co.edu.sistema_practicas_empresariales.security.UserPrincipal;
import co.edu.sistema_practicas_empresariales.shared.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import co.edu.sistema_practicas_empresariales.modules.usuario.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthFacadeImpl implements AuthFacade {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public JwtResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (usuario.isDebeCambiarPassword()) {
            throw new IllegalStateException("DEBE_CAMBIAR_PASSWORD: Es su primer inicio de sesión o se le ha forzado a cambiar la contraseña.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .email(principal.getEmail())
                .nombre(principal.getNombre())
                .rol(principal.getAuthorities().iterator().next().getAuthority())
                .build();
    }

    @Override
    @Transactional
    public void registerSemillaAdmin() {
        String adminEmail = "admin@universidad.edu.co";
        if (usuarioRepository.existsByEmail(adminEmail)) {
            return;
        }
        // Find role enum ADMINISTRADOR; if not present, create it.
        Rol adminRole = rolRepository.findByNombre(Rol.Nombre.ADMINISTRADOR)
                .orElseGet(() -> {
                    Rol newRole = Rol.builder()
                            .nombre(Rol.Nombre.ADMINISTRADOR)
                            .build();
                    return rolRepository.save(newRole);
                });
        Usuario admin = Usuario.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .nombre("Administrador del Sistema")
                .activo(true)
                .rol(adminRole)
                .debeCambiarPassword(false)
                .build();
        usuarioRepository.save(admin);
    }

    @Override
    @Transactional
    public void solicitarRecuperacionPassword(RecuperarPasswordDto request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ese email."));

        String token = UUID.randomUUID().toString();
        usuario.setResetPasswordToken(token);
        usuario.setResetPasswordExpires(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String emailBody = "Hola " + usuario.getNombre() + ",\n\n"
                + "Has solicitado restablecer tu contraseña. Ingresa al siguiente enlace:\n"
                + resetLink + "\n\n"
                + "Este enlace expirará en 1 hora.\nSi no fuiste tú, ignora este correo.";

        emailService.sendEmail(usuario.getEmail(), "Recuperación de Contraseña", emailBody);
    }

    @Override
    @Transactional
    public void resetearPassword(ResetPasswordDto request) {
        Usuario usuario = usuarioRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o no existe."));

        if (usuario.getResetPasswordExpires().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("El token ha expirado. Por favor, solicita uno nuevo.");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuario.setResetPasswordToken(null);
        usuario.setResetPasswordExpires(null);
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void cambiarPasswordPrimerIngreso(CambiarPasswordInicialDto request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas."));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getCurrentPassword())
        );

        if (!usuario.isDebeCambiarPassword()) {
            throw new IllegalStateException("El usuario ya no requiere cambiar su contraseña inicial.");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
    }
}
// Force PR update
