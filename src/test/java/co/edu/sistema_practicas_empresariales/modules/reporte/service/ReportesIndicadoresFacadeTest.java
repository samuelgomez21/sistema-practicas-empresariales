package co.edu.sistema_practicas_empresariales.modules.reporte.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.encuesta.repository.EncuestaRepository;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.export.ExportadorReporte;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.reporte.builder.ReporteBuilder.Reporte;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportesIndicadoresFacadeTest {

    @Mock private PracticaRepository practicaRepository;
    @Mock private EvaluacionRepository evaluacionRepository;
    @Mock private EncuestaRepository encuestaRepository;
    @Mock private EmpresaRepository empresaRepository;
    @Mock private VacanteRepository vacanteRepository;
    @Mock private ProgramaRepository programaRepository;
    @Mock private ExportadorReporte excelExportAdapter;
    @Mock private ExportadorReporte pdfExportAdapter;

    private ReportesIndicadoresFacade facade;

    @BeforeEach
    void setUp() {
        facade = new ReportesIndicadoresFacade(
                practicaRepository,
                evaluacionRepository,
                encuestaRepository,
                empresaRepository,
                vacanteRepository,
                programaRepository,
                excelExportAdapter,
                pdfExportAdapter
        );
    }

    @Test
    void generarReporteNotas_FiltraSoloEvaluacionesActivas() {
        Practica practica = new Practica();
        practica.setId(1L);
        practica.setEstado(EstadoPracticaTipo.COMPLETADA);
        practica.setResultado("APROBADO");
        
        Estudiante estudiante = new Estudiante();
        estudiante.setId(2L);
        Usuario usuario = new Usuario();
        usuario.setNombre("Pepito Perez");
        estudiante.setUsuario(usuario);
        Programa programa = new Programa();
        programa.setNombre("Ingenieria");
        estudiante.setPrograma(programa);
        practica.setEstudiante(estudiante);

        // Una evaluación activa y otra inactiva (softdelete)
        Evaluacion activa = Evaluacion.builder()
                .id(10L)
                .practica(practica)
                .notaFinal(BigDecimal.valueOf(4.5))
                .activo(true)
                .build();

        Evaluacion inactiva = Evaluacion.builder()
                .id(11L)
                .practica(practica)
                .notaFinal(BigDecimal.valueOf(2.0))
                .activo(false) // Softdeleted!
                .build();

        when(evaluacionRepository.findAll()).thenReturn(List.of(activa, inactiva));
        when(excelExportAdapter.exportar(any(Reporte.class))).thenReturn(new byte[]{1, 2, 3});

        byte[] result = facade.generarReporteNotas(null, null, "excel");

        assertNotNull(result);
        assertEquals(3, result.length);
        
        // Verificar que excelExportAdapter fue llamado con un reporte que contiene solo la fila activa
        verify(excelExportAdapter).exportar(argThat(reporte -> {
            assertEquals(1, reporte.getFilas().size());
            assertEquals("Pepito Perez", reporte.getFilas().get(0).get(0));
            return true;
        }));
    }

    @Test
    void generarReporteEmpresasVacantes_FiltraSoloEmpresasActivas() {
        Empresa activa = new Empresa();
        activa.setId(1L);
        activa.setNit("12345");
        activa.setRazonSocial("Empresa Activa");
        activa.setActivo(true);

        Empresa inactiva = new Empresa();
        inactiva.setId(2L);
        inactiva.setNit("67890");
        inactiva.setRazonSocial("Empresa Inactiva");
        inactiva.setActivo(false); // Softdeleted!

        when(empresaRepository.findAll()).thenReturn(List.of(activa, inactiva));
        when(vacanteRepository.findByEmpresaId(1L)).thenReturn(Collections.emptyList());
        when(practicaRepository.findByEmpresaId(1L)).thenReturn(Collections.emptyList());
        when(excelExportAdapter.exportar(any(Reporte.class))).thenReturn(new byte[]{4, 5});

        byte[] result = facade.generarReporteEmpresasVacantes(null, null);

        assertNotNull(result);
        verify(excelExportAdapter).exportar(argThat(reporte -> {
            assertEquals(1, reporte.getFilas().size());
            assertEquals("Empresa Activa", reporte.getFilas().get(0).get(1));
            return true;
        }));
    }
}
