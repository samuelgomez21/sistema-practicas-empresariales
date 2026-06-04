package co.edu.sistema_practicas_empresariales.modules.usuario.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @Test
    void obtenerPorId_WhenExists_ShouldReturnUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        when(usuarioRepository.findByIdAndEliminadoFalse(1L)).thenReturn(Optional.of(usuario));

        Usuario result = usuarioService.obtenerPorId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void crear_WhenEmailExists_ShouldThrowException() {
        Usuario usuario = new Usuario();
        usuario.setEmail("test@test.com");
        when(usuarioRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> usuarioService.crear(usuario));
    }

    @Test
    void crear_WhenEmailNotExists_ShouldSaveUsuario() {
        Usuario usuario = new Usuario();
        usuario.setEmail("new@test.com");
        when(usuarioRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArguments()[0]);

        Usuario result = usuarioService.crear(usuario);

        assertNotNull(result);
        assertTrue(result.isDebeCambiarPassword());
        verify(usuarioRepository).save(usuario);
    }
}
