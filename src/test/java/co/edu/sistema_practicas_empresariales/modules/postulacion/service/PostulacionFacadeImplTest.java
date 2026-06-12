package co.edu.sistema_practicas_empresariales.modules.postulacion.service;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionRequestDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionResponseDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.EstadoPostulacionTipo;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.postulacion.repository.PostulacionRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostulacionFacadeImplTest {

    @Mock
    private PostulacionRepository postulacionRepository;

    @Mock
    private VacanteRepository vacanteRepository;

    @Mock
    private EstudianteRepository estudianteRepository;

    @InjectMocks
    private PostulacionFacadeImpl postulacionFacade;

    private Vacante vacante;
    private Estudiante estudiante;

    private Vacante crearVacante() {
        Vacante v = new Vacante();
        v.setId(1L);
        v.setTitulo("Practicante Desarrollo Web");
        return v;
    }

    private Estudiante crearEstudiante() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Carlos Mendoza");

        Estudiante e = new Estudiante();
        e.setId(1L);
        e.setUsuario(usuario);
        return e;
    }

    @Test
    void crearPostulacion_ShouldSaveAndReturnResponse() {
        PostulacionRequestDto dto = PostulacionRequestDto.builder()
                .vacanteId(1L)
                .estudianteId(1L)
                .observaciones("Muy interesado en la vacante")
                .build();

        vacante    = crearVacante();
        estudiante = crearEstudiante();

        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(postulacionRepository.findByVacanteIdAndEstudianteId(1L, 1L))
                .thenReturn(Optional.empty());
        when(postulacionRepository.save(any(Postulacion.class))).thenAnswer(i -> {
            Postulacion p = i.getArgument(0);
            p.setId(1L);
            return p;
        });

        PostulacionResponseDto result = postulacionFacade.crearPostulacion(dto);

        assertNotNull(result);
        assertEquals(EstadoPostulacionTipo.POSTULADO, result.getEstado());
        assertEquals("Carlos Mendoza", result.getNombreEstudiante());
        assertEquals("Practicante Desarrollo Web", result.getTituloVacante());
        verify(postulacionRepository).save(any(Postulacion.class));
    }

    @Test
    void crearPostulacion_ShouldThrowWhenVacanteNotFound() {
        PostulacionRequestDto dto = PostulacionRequestDto.builder()
                .vacanteId(99L)
                .estudianteId(1L)
                .build();

        when(vacanteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> postulacionFacade.crearPostulacion(dto));

        verify(postulacionRepository, never()).save(any());
    }

    @Test
    void crearPostulacion_ShouldThrowWhenEstudianteYaPostulado() {
        PostulacionRequestDto dto = PostulacionRequestDto.builder()
                .vacanteId(1L)
                .estudianteId(1L)
                .build();

        vacante    = crearVacante();
        estudiante = crearEstudiante();

        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(postulacionRepository.findByVacanteIdAndEstudianteId(1L, 1L))
                .thenReturn(Optional.of(new Postulacion()));

        assertThrows(IllegalStateException.class,
                () -> postulacionFacade.crearPostulacion(dto));

        verify(postulacionRepository, never()).save(any());
    }

    @Test
    void actualizarEstado_ShouldAllowValidTransition() {
        vacante    = crearVacante();
        estudiante = crearEstudiante();

        Postulacion postulacion = Postulacion.builder()
                .id(1L)
                .vacante(vacante)
                .estudiante(estudiante)
                .estado(EstadoPostulacionTipo.POSTULADO)
                .build();

        when(postulacionRepository.findById(1L)).thenReturn(Optional.of(postulacion));
        when(postulacionRepository.save(any(Postulacion.class))).thenAnswer(i -> i.getArgument(0));

        PostulacionResponseDto result = postulacionFacade.actualizarEstado(1L, "EN_SELECCION");

        assertEquals(EstadoPostulacionTipo.EN_SELECCION, result.getEstado());
    }

    @Test
    void actualizarEstado_ShouldThrowOnInvalidTransition() {
        vacante    = crearVacante();
        estudiante = crearEstudiante();

        Postulacion postulacion = Postulacion.builder()
                .id(1L)
                .vacante(vacante)
                .estudiante(estudiante)
                .estado(EstadoPostulacionTipo.POSTULADO)
                .build();

        when(postulacionRepository.findById(1L)).thenReturn(Optional.of(postulacion));

        // POSTULADO -> SELECCIONADO no es una transición válida (debe pasar por EN_SELECCION/EN_ENTREVISTA)
        assertThrows(IllegalStateException.class,
                () -> postulacionFacade.actualizarEstado(1L, "SELECCIONADO"));

        verify(postulacionRepository, never()).save(any());
    }

    @Test
    void actualizarEstado_ShouldThrowOnFinalState() {
        vacante    = crearVacante();
        estudiante = crearEstudiante();

        Postulacion postulacion = Postulacion.builder()
                .id(1L)
                .vacante(vacante)
                .estudiante(estudiante)
                .estado(EstadoPostulacionTipo.RECHAZADO)
                .build();

        when(postulacionRepository.findById(1L)).thenReturn(Optional.of(postulacion));

        // RECHAZADO es estado final, no admite más transiciones
        assertThrows(IllegalStateException.class,
                () -> postulacionFacade.actualizarEstado(1L, "EN_SELECCION"));

        verify(postulacionRepository, never()).save(any());
    }

    @Test
    void actualizarEstado_ShouldThrowOnInvalidEnumValue() {
        vacante    = crearVacante();
        estudiante = crearEstudiante();

        Postulacion postulacion = Postulacion.builder()
                .id(1L)
                .vacante(vacante)
                .estudiante(estudiante)
                .estado(EstadoPostulacionTipo.POSTULADO)
                .build();

        when(postulacionRepository.findById(1L)).thenReturn(Optional.of(postulacion));

        assertThrows(IllegalArgumentException.class,
                () -> postulacionFacade.actualizarEstado(1L, "ESTADO_INEXISTENTE"));

        verify(postulacionRepository, never()).save(any());
    }

    @Test
    void listarPorEstudiante_ShouldReturnList() {
        vacante    = crearVacante();
        estudiante = crearEstudiante();

        Postulacion postulacion = Postulacion.builder()
                .id(1L)
                .vacante(vacante)
                .estudiante(estudiante)
                .estado(EstadoPostulacionTipo.POSTULADO)
                .build();

        when(postulacionRepository.findByEstudianteId(1L))
                .thenReturn(List.of(postulacion));

        List<PostulacionResponseDto> result = postulacionFacade.listarPorEstudiante(1L);

        assertEquals(1, result.size());
        assertEquals("Carlos Mendoza", result.get(0).getNombreEstudiante());
    }

    @Test
    void eliminarPostulacion_ShouldThrowWhenNotFound() {
        when(postulacionRepository.existsById(99L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> postulacionFacade.eliminarPostulacion(99L));

        verify(postulacionRepository, never()).deleteById(any());
    }

    @Test
    void eliminarPostulacion_ShouldDeleteWhenExists() {
        when(postulacionRepository.existsById(1L)).thenReturn(true);

        postulacionFacade.eliminarPostulacion(1L);

        verify(postulacionRepository).deleteById(1L);
    }
}