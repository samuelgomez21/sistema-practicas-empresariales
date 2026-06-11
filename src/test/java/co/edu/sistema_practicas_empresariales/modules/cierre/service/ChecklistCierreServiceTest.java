package co.edu.sistema_practicas_empresariales.modules.cierre.service;

import co.edu.sistema_practicas_empresariales.modules.cierre.service.chain.*;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChecklistCierreServiceTest {

    @Mock private ValidadorNotaDocente validadorNotaDocente;

    @InjectMocks
    private ChecklistCierreService checklistCierreService;

    @Test
    void validarChecklistCierre_FlujoExitoso_PasaPorTodaLaCadena() {
        Practica practica = new Practica();
        practica.setId(101L);

        checklistCierreService.validarChecklistCierre(practica);

        verify(validadorNotaDocente, times(1)).validar(practica);
    }

    @Test
    void validarChecklistCierre_FallaEnMedio_LanzaExcepcion() {
        Practica practica = new Practica();
        practica.setId(101L);

        doThrow(new RuntimeException("Falta nota")).when(validadorNotaDocente).validar(practica);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            checklistCierreService.validarChecklistCierre(practica);
        });

        assert(exception.getMessage().equals("Falta nota"));
    }
}
