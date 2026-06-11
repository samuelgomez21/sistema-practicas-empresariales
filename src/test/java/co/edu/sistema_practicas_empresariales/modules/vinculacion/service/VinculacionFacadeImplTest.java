package co.edu.sistema_practicas_empresariales.modules.vinculacion.service;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.model.Vinculacion;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.repository.VinculacionRepository;
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
public class VinculacionFacadeImplTest {

    @Mock
    private VinculacionRepository vinculacionRepository;

    @Mock
    private VacanteRepository vacanteRepository;

    @Mock
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private VinculacionFacadeImpl vinculacionFacade;

    @Test
    void crearVinculacion_ShouldSaveAndReturnResponse() {
        VinculacionCreateDto dto = new VinculacionCreateDto();
        dto.setVacanteId(1L);
        dto.setCargo("Trainee");
        
        Vacante vacante = new Vacante();
        vacante.setId(1L);

        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));
        when(vinculacionRepository.save(any(Vinculacion.class))).thenAnswer(i -> {
            Vinculacion v = i.getArgument(0);
            v.setId(1L);
            return v;
        });

        VinculacionResponse result = vinculacionFacade.crearVinculacion(dto);

        assertNotNull(result);
        assertEquals("Trainee", result.getCargo());
        verify(vinculacionRepository).save(any(Vinculacion.class));
    }

    @Test
    void softDeleteVinculacion_ShouldCallSoftDelete() {
        Vinculacion vinculacion = new Vinculacion();
        vinculacion.setId(1L);
        when(vinculacionRepository.findByIdAndEliminadoFalse(1L)).thenReturn(Optional.of(vinculacion));

        vinculacionFacade.softDeleteVinculacion(1L);

        verify(vinculacionRepository).softDelete(1L);
    }
}
