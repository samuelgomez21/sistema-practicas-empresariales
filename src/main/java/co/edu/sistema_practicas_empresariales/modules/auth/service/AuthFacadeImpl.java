package co.edu.sistema_practicas_empresariales.modules.auth.service;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.LoginRequest;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.JwtResponse;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.security.JwtTokenProvider;
import co.edu.sistema_practicas_empresariales.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import co.edu.sistema_practicas_empresariales.modules.usuario.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthFacadeImpl implements AuthFacade {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public JwtResponse login(LoginRequest request) {
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

    /**
     * Creates a seed admin user if it does not already exist.
     * This method is idempotent and follows the Facade pattern to hide
     * the complexity of role lookup, password encoding and persistence.
     */
    @Override
    @Transactional
    public void registerSemillaAdmin() {
        String adminEmail = "admin@example.com";
        if (usuarioRepository.existsByEmail(adminEmail)) {
            return; // admin already present, nothing to do
        }
        // Obtain ADMIN role (enum name matches the enum defined in Rol)
        Rol adminRole = rolRepository.findByNombre(Rol.Nombre.ADMINISTRADOR)
                .orElseThrow(() -> new IllegalStateException("Rol ADMINISTRADOR no encontrado"));
        Usuario admin = Usuario.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .nombre("Administrador")
                .activo(true)
                .rol(adminRole)
                .build();
        usuarioRepository.save(admin);
    }
}
