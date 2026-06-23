package co.edu.sistema_practicas_empresariales.modules.auth.service;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.JwtResponse;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.LoginRequest;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.security.JwtTokenProvider;
import co.edu.sistema_practicas_empresariales.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthFacadeImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private co.edu.sistema_practicas_empresariales.shared.email.adapter.EmailPort emailPort;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Mock
    private co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository rolRepository;

    @InjectMocks
    private AuthFacadeImpl authFacade;

    private Usuario mockUsuario;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        Rol rolAdmin = new Rol(1L, Rol.Nombre.ADMINISTRADOR);

        mockUsuario = Usuario.builder()
                .id(1L)
                .email("admin@test.com")
                .password("encoded_pass")
                .nombre("Administrador de Prueba")
                .rol(rolAdmin)
                .debeCambiarPassword(false)
                .build();

        loginRequest = new LoginRequest("admin@test.com", "password123");

        org.springframework.test.util.ReflectionTestUtils.setField(authFacade, "frontendUrl", "http://localhost:5173");
    }

    @Test
    @DisplayName("Test: Login Exitoso debe retornar un JWT")
    void testLoginExitoso() {
        // Arrange
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(mockUsuario));

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        UserPrincipal principal = UserPrincipal.create(mockUsuario);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt.token.mock");

        // Act
        JwtResponse response = authFacade.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt.token.mock", response.getToken());
        assertEquals("admin@test.com", response.getEmail());
        assertEquals("Administrador de Prueba", response.getNombre());

        // Verificamos que se llamó al repositorio y al generador de token
        verify(usuarioRepository, times(1)).findByEmail("admin@test.com");
        verify(tokenProvider, times(1)).generateToken(authentication);
    }

    @Test
    @DisplayName("Test: Login con credenciales inválidas debe lanzar Excepción")
    void testLoginCredencialesInvalidas() {
        // Arrange
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());
        LoginRequest badRequest = new LoginRequest("noexiste@test.com", "wrongpass");

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authFacade.login(badRequest);
        });

        assertEquals("Credenciales inválidas", exception.getMessage());
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    @DisplayName("Test: Login cuando debe cambiar contraseña debe lanzar IllegalStateException")
    void testLoginDebeCambiarPassword() {
        // Arrange
        mockUsuario.setDebeCambiarPassword(true);
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(mockUsuario));

        // Act & Assert
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            authFacade.login(loginRequest);
        });

        assertTrue(exception.getMessage().contains("DEBE_CAMBIAR_PASSWORD"));
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    @DisplayName("Test: Solicitar Recuperación de Contraseña Exitoso")
    void testSolicitarRecuperacionPassword() {
        // Arrange
        co.edu.sistema_practicas_empresariales.modules.auth.dto.RecuperarPasswordDto dto = 
            new co.edu.sistema_practicas_empresariales.modules.auth.dto.RecuperarPasswordDto();
        dto.setEmail("admin@test.com");
        
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(mockUsuario));

        // Act
        authFacade.solicitarRecuperacionPassword(dto);

        // Assert
        assertNotNull(mockUsuario.getResetPasswordToken());
        assertNotNull(mockUsuario.getResetPasswordExpires());
        verify(usuarioRepository, times(1)).save(mockUsuario);
    }

    @Test
    @DisplayName("Test: Solicitar Recuperación de Contraseña con email no existente")
    void testSolicitarRecuperacionPasswordEmailInvalido() {
        // Arrange
        co.edu.sistema_practicas_empresariales.modules.auth.dto.RecuperarPasswordDto dto = 
            new co.edu.sistema_practicas_empresariales.modules.auth.dto.RecuperarPasswordDto();
        dto.setEmail("noexiste@test.com");
        
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authFacade.solicitarRecuperacionPassword(dto);
        });
        
        assertEquals("Usuario no encontrado con ese email.", exception.getMessage());
        verify(usuarioRepository, never()).save(any());
    }
}
