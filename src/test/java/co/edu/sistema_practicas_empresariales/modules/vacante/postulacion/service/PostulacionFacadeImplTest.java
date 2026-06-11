package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion.EstadoPostulacionTipo;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.repository.PostulacionRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
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
public class PostulacionFacadeImplTest {

    @Mock
    private PostulacionRepository postulacionRepository;

    @Mock
    private VacanteRepository vacanteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private PostulacionFacadeImpl postulacionFacade;

    @Test
    void crearPostulacion_ShouldSaveAndReturnResponse() {
        PostulacionCreateDto dto = new PostulacionCreateDto();
        dto.setVacanteId(1L);
        dto.setUsuarioId(1L);

        Vacante vacante = new Vacante();
        vacante.setId(1L);

        Usuario usuario = new Usuario();
        usuario.setId(1L);

        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(postulacionRepository.save(any(Postulacion.class))).thenAnswer(i -> {
            Postulacion p = i.getArgument(0);
            p.setId(1L);
            return p;
        });

        PostulacionResponse result = postulacionFacade.crearPostulacion(dto);

        assertNotNull(result);
        assertEquals(EstadoPostulacionTipo.PENDIENTE, result.getEstado());
        verify(postulacionRepository).save(any(Postulacion.class));
    }

    @Test
    void softDeletePostulacion_ShouldCallRepositorySoftDelete() {
        Postulacion postulacion = new Postulacion();
        postulacion.setId(1L);
        
        when(postulacionRepository.findByIdAndEliminadoFalse(1L)).thenReturn(Optional.of(postulacion));

        postulacionFacade.softDeletePostulacion(1L);

        verify(postulacionRepository).softDelete(1L);
    }
}
