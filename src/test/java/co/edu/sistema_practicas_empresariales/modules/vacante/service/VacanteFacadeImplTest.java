package co.edu.sistema_practicas_empresariales.modules.vacante.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteRequest;
import co.edu.sistema_practicas_empresariales.modules.vacante.dto.VacanteResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.event.VacanteCreadaEvent;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteFactory;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VacanteFacadeImplTest {

    @Mock
    private VacanteRepository vacanteRepository;

    @Mock
    private EmpresaRepository empresaRepository;

    @Mock
    private EstadoVacanteFactory estadoVacanteFactory;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private VacanteFacadeImpl vacanteFacade;

    @Test
    void crearVacante_ShouldCreateAndPublishEvent() {
        VacanteRequest request = new VacanteRequest();
        request.setEmpresaId(1L);
        request.setTitulo("Desarrollador");

        Empresa empresa = new Empresa();
        empresa.setId(1L);

        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));
        when(vacanteRepository.save(any(Vacante.class))).thenAnswer(i -> {
            Vacante v = i.getArgument(0);
            v.setId(1L);
            return v;
        });

        VacanteResponse result = vacanteFacade.crearVacante(request);

        assertNotNull(result);
        assertEquals("Desarrollador", result.getTitulo());
        verify(eventPublisher).publishEvent(any(VacanteCreadaEvent.class));
    }

    @Test
    void aprobarVacante_ShouldApproveAndPublishEvent() {
        Empresa empresa = new Empresa();
        empresa.setId(1L);
        Vacante vacante = new Vacante();
        vacante.setId(1L);
        vacante.setEmpresa(empresa);
        vacante.setEstado(EstadoVacanteTipo.PENDIENTE);

        EstadoVacante estadoMock = mock(EstadoVacante.class);

        when(vacanteRepository.findById(1L)).thenReturn(Optional.of(vacante));
        when(estadoVacanteFactory.getEstado(EstadoVacanteTipo.PENDIENTE)).thenReturn(estadoMock);
        when(vacanteRepository.save(any(Vacante.class))).thenReturn(vacante);

        vacanteFacade.aprobarVacante(1L);

        verify(estadoMock).aprobar(vacante);
        verify(vacanteRepository).save(vacante);
    }
}
