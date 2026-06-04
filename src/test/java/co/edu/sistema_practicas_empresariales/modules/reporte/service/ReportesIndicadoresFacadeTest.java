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
import co.edu.sistema_practicas_empresariales.modules.practica.repository.AvanceRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaDocumentoRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.model.PracticaDocumento;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    @Mock private AvanceRepository avanceRepository;
    @Mock private PracticaDocumentoRepository practicaDocumentoRepository;
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
                avanceRepository,
                practicaDocumentoRepository,
                excelExportAdapter,
                pdfExportAdapter
        );
    }

    @Test
    void generarReporteNotasFiltraSoloEvaluacionesActivas() {
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
    void generarReporteEmpresasVacantesFiltraSoloEmpresasActivas() {
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

    @Test
    void obtenerDashboardGerencialCalculaMetricasCorrectamente() {
        Practica practica1 = new Practica();
        practica1.setId(1L);
        practica1.setEstado(EstadoPracticaTipo.COMPLETADA);
        
        Practica practica2 = new Practica();
        practica2.setId(2L);
        practica2.setEstado(EstadoPracticaTipo.REPROBADA);
        
        Practica practicaActiva = new Practica();
        practicaActiva.setId(3L);
        practicaActiva.setEstado(EstadoPracticaTipo.EN_PRACTICA);

        when(practicaRepository.findAll()).thenReturn(List.of(practica1, practica2, practicaActiva));
        when(empresaRepository.findAll()).thenReturn(Collections.emptyList());
        
        // Mock avances
        when(avanceRepository.findByPracticaIdOrderByCreatedAtDesc(3L)).thenReturn(List.of(new co.edu.sistema_practicas_empresariales.modules.practica.model.Avance()));
        
        // Mock evaluaciones
        Evaluacion eval1 = Evaluacion.builder().practica(practica1).notaFinal(BigDecimal.valueOf(4.5)).build();
        when(evaluacionRepository.findByPracticaIdAndActivoTrue(1L)).thenReturn(Optional.of(eval1));
        when(evaluacionRepository.findByPracticaIdAndActivoTrue(2L)).thenReturn(Optional.empty());
        
        // Mock documentos
        PracticaDocumento doc1 = PracticaDocumento.builder().categoria("ARL").estado("APROBADO").build();
        PracticaDocumento doc2 = PracticaDocumento.builder().categoria("PLANEADOR").estado("PENDIENTE").build();
        when(practicaDocumentoRepository.findByPracticaId(any())).thenReturn(List.of(doc1, doc2));

        Map<String, Object> dashboard = facade.obtenerDashboardGerencial(null);

        assertNotNull(dashboard);
        assertEquals(1, ((Number) dashboard.get("practicantesActivos")).longValue());
        assertEquals(2, ((Number) dashboard.get("practicasCerradas")).longValue());
        assertEquals(50.0, ((Number) dashboard.get("tasaAprobacion")).doubleValue());
        assertEquals(100.0, ((Number) dashboard.get("porcentajePracticasConSeguimiento")).doubleValue());
        assertEquals(50.0, ((Number) dashboard.get("porcentajePracticasConEvaluacionFinal")).doubleValue());
        assertEquals(3, ((Number) dashboard.get("documentosPendientes")).longValue());
        assertEquals(40.0, ((Number) dashboard.get("porcentajeDocumentacionCompleta")).doubleValue());
    }
}
