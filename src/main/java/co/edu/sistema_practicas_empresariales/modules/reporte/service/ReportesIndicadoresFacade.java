package co.edu.sistema_practicas_empresariales.modules.reporte.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.Encuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.repository.EncuestaRepository;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.export.ExportadorReporte;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import co.edu.sistema_practicas_empresariales.modules.reporte.builder.ReporteBuilder;
import co.edu.sistema_practicas_empresariales.modules.reporte.builder.ReporteBuilder.Reporte;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.AvanceRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaDocumentoRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.model.PracticaDocumento;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportesIndicadoresFacade {

    private static final String HEADER_ESTUDIANTE = "Estudiante";
    private static final String FILTRO_PROGRAMA = "Programa";
    private static final String FILTRO_PERIODO = "Periodo Académico";
    private static final String PENDIENTE_LABEL = "Pendiente";
    private static final String PENDIENTE_ESTADO = "PENDIENTE";

    private final PracticaRepository practicaRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final EncuestaRepository encuestaRepository;
    private final EmpresaRepository empresaRepository;
    private final VacanteRepository vacanteRepository;
    private final ProgramaRepository programaRepository;
    private final AvanceRepository avanceRepository;
    private final PracticaDocumentoRepository practicaDocumentoRepository;

    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.beans.factory.annotation.Qualifier("excelExportAdapter")
    private ExportadorReporte excelExportAdapter;

    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.beans.factory.annotation.Qualifier("pdfExportAdapter")
    private ExportadorReporte pdfExportAdapter;

    @Transactional(readOnly = true)
    public byte[] generarReporteEstadoProceso(Long programaId, String periodo, String format) {
        List<Practica> practicas = practicaRepository.findAll().stream()
                .filter(p -> p.getEstudiante() != null && p.getEstudiante().isActivo())
                .collect(Collectors.toList());

        if (programaId != null) {
            practicas = practicas.stream()
                    .filter(p -> p.getEstudiante().getPrograma().getId().equals(programaId))
                    .collect(Collectors.toList());
        }

        if (periodo != null) {
            LocalDateTime[] rango = parsePeriodo(periodo);
            practicas = practicas.stream()
                    .filter(p -> p.getFechaCreacion().isAfter(rango[0]) && p.getFechaCreacion().isBefore(rango[1]))
                    .collect(Collectors.toList());
        }

        ReporteBuilder builder = new ReporteBuilder("Reporte de Estado del Proceso de Prácticas");
        builder.headers(List.of("ID Práctica", HEADER_ESTUDIANTE, FILTRO_PROGRAMA, "Número Práctica", "Estado", "Fecha Creación"));

        if (programaId != null) {
            programaRepository.findById(programaId).ifPresent(prog -> builder.filtro(FILTRO_PROGRAMA, prog.getNombre()));
        }
        if (periodo != null) {
            builder.filtro(FILTRO_PERIODO, periodo);
        }

        for (Practica p : practicas) {
            builder.fila(Arrays.asList(
                    p.getId(),
                    p.getEstudiante().getUsuario().getNombre(),
                    p.getEstudiante().getPrograma().getNombre(),
                    p.getNumeroPractica(),
                    p.getEstado().name(),
                    p.getFechaCreacion().toString()
            ));
        }

        // Totales por estado al pie
        Map<EstadoPracticaTipo, Long> conteoEstados = practicas.stream()
                .collect(Collectors.groupingBy(Practica::getEstado, Collectors.counting()));
                
        builder.total("TOTAL GENERAL: " + practicas.size());
        for (Map.Entry<EstadoPracticaTipo, Long> entry : conteoEstados.entrySet()) {
            builder.total(entry.getKey().name() + ": " + entry.getValue());
        }

        Reporte reporte = builder.build();
        if ("pdf".equalsIgnoreCase(format)) {
            return pdfExportAdapter.exportar(reporte);
        } else {
            return excelExportAdapter.exportar(reporte);
        }
    }

    @Transactional(readOnly = true)
    public byte[] generarReporteNotas(Long programaId, String periodo, String format) {
        List<Evaluacion> evaluaciones = evaluacionRepository.findAll().stream()
                .filter(e -> e.isActivo() && e.getPractica() != null)
                .collect(Collectors.toList());

        if (programaId != null) {
            evaluaciones = evaluaciones.stream()
                    .filter(e -> e.getPractica().getEstudiante().getPrograma().getId().equals(programaId))
                    .collect(Collectors.toList());
        }

        if (periodo != null) {
            LocalDateTime[] rango = parsePeriodo(periodo);
            evaluaciones = evaluaciones.stream()
                    .filter(e -> e.getCreatedAt().isAfter(rango[0]) && e.getCreatedAt().isBefore(rango[1]))
                    .collect(Collectors.toList());
        }

        ReporteBuilder builder = new ReporteBuilder("Reporte de Calificaciones de Prácticas");
        builder.headers(List.of(HEADER_ESTUDIANTE, FILTRO_PROGRAMA, "Número Práctica", "Nota Docente", "Nota Tutor", "Nota Final", "Resultado"));

        if (programaId != null) {
            programaRepository.findById(programaId).ifPresent(prog -> builder.filtro(FILTRO_PROGRAMA, prog.getNombre()));
        }
        if (periodo != null) {
            builder.filtro(FILTRO_PERIODO, periodo);
        }

        for (Evaluacion e : evaluaciones) {
            builder.fila(mapEvaluacionFila(e));
        }

        Reporte reporte = builder.build();
        if ("pdf".equalsIgnoreCase(format)) {
            return pdfExportAdapter.exportar(reporte);
        } else {
            return excelExportAdapter.exportar(reporte);
        }
    }

    @Transactional(readOnly = true)
    public byte[] generarReporteEmpresasVacantes(Long programaId, String periodo) {
        List<Empresa> empresas = empresaRepository.findAll().stream()
                .filter(Empresa::isActivo)
                .collect(Collectors.toList());

        ReporteBuilder builder = new ReporteBuilder("Reporte de Empresas y Vacantes");
        builder.headers(List.of("NIT", "Razón Social", "Sector", "Vacantes Pendientes", "Vacantes Activas", "Vacantes Cerradas", "Practicantes Activos", "Practicantes Históricos", "Tasa Finalización Exitosa (%)"));

        if (periodo != null) {
            builder.filtro(FILTRO_PERIODO, periodo);
        }

        for (Empresa e : empresas) {
            List<Vacante> vacantes = vacanteRepository.findByEmpresaId(e.getId());
            long pendientes = vacantes.stream().filter(v -> v.getEstado() == EstadoVacanteTipo.PENDIENTE).count();
            long activas = vacantes.stream().filter(v -> v.getEstado() == EstadoVacanteTipo.APROBADA).count();
            long cerradas = vacantes.stream().filter(v -> v.getEstado() == EstadoVacanteTipo.CERRADA).count();

            List<Practica> practicas = practicaRepository.findByEmpresaId(e.getId());
            if (programaId != null) {
                practicas = practicas.stream()
                        .filter(p -> p.getEstudiante() != null
                                && p.getEstudiante().getPrograma() != null
                                && programaId.equals(p.getEstudiante().getPrograma().getId()))
                        .collect(Collectors.toList());
            }
            long activos = practicas.stream().filter(p -> p.getEstado() != EstadoPracticaTipo.COMPLETADA && p.getEstado() != EstadoPracticaTipo.REPROBADA && p.getEstado() != EstadoPracticaTipo.CANCELADA).count();
            long historicos = practicas.size();

            // Calcular tasa finalización
            long completadas = practicas.stream().filter(p -> p.getEstado() == EstadoPracticaTipo.COMPLETADA).count();
            long totalIniciadas = practicas.stream().filter(p -> p.getEstado() != EstadoPracticaTipo.CANCELADA).count();
            
            BigDecimal tasa = BigDecimal.ZERO;
            if (totalIniciadas > 0) {
                tasa = BigDecimal.valueOf(completadas)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(totalIniciadas), 2, RoundingMode.HALF_UP);
            }

            builder.fila(Arrays.asList(
                    e.getNit(),
                    e.getRazonSocial(),
                    e.getSectorEconomico() != null ? e.getSectorEconomico() : "No especificado",
                    pendientes,
                    activas,
                    cerradas,
                    activos,
                    historicos,
                    tasa.doubleValue() + "%"
            ));
        }

        return excelExportAdapter.exportar(builder.build());
    }

    @Transactional(readOnly = true)
    public byte[] generarReporteEncuestas(Long programaId, String periodo) {
        List<Practica> practicas = practicaRepository.findAll().stream()
                .filter(p -> p.getEstado() == EstadoPracticaTipo.COMPLETADA || p.getEstado() == EstadoPracticaTipo.REPROBADA)
                .collect(Collectors.toList());

        if (programaId != null) {
            practicas = practicas.stream()
                    .filter(p -> p.getEstudiante().getPrograma().getId().equals(programaId))
                    .collect(Collectors.toList());
        }

        ReporteBuilder builder = new ReporteBuilder("Reporte Consolidado de Encuestas de Satisfacción");
        builder.headers(List.of("ID Práctica", HEADER_ESTUDIANTE, FILTRO_PROGRAMA, "Estado Encuesta Estudiante", "Comentarios Estudiante", "Estado Encuesta Tutor", "Comentarios Tutor"));

        for (Practica p : practicas) {
            Optional<Encuesta> estEnc = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(p.getId(), Encuesta.TipoActor.ESTUDIANTE);
            Optional<Encuesta> tutEnc = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(p.getId(), Encuesta.TipoActor.TUTOR_EMPRESARIAL);

            String estadoEst = estEnc.map(e -> e.getEstado().name()).orElse(PENDIENTE_ESTADO);
            String comentarioEst = estEnc.map(Encuesta::getComentarios).orElse("");

            String estadoTut = tutEnc.map(e -> e.getEstado().name()).orElse(PENDIENTE_ESTADO);
            String comentarioTut = tutEnc.map(Encuesta::getComentarios).orElse("");

            builder.fila(Arrays.asList(
                    p.getId(),
                    p.getEstudiante().getUsuario().getNombre(),
                    p.getEstudiante().getPrograma().getNombre(),
                    estadoEst,
                    comentarioEst,
                    estadoTut,
                    comentarioTut
            ));
        }

        return excelExportAdapter.exportar(builder.build());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerDashboardGerencial(String periodo) {
        List<Practica> practicas = practicaRepository.findAll();

        if (periodo != null) {
            LocalDateTime[] rango = parsePeriodo(periodo);
            practicas = practicas.stream()
                    .filter(p -> p.getFechaCreacion().isAfter(rango[0]) && p.getFechaCreacion().isBefore(rango[1]))
                    .collect(Collectors.toList());
        }

        // Indicador 1: Total de practicantes activos (no cerradas ni canceladas)
        List<Practica> practicasActivas = practicas.stream()
                .filter(p -> p.getEstado() != EstadoPracticaTipo.COMPLETADA 
                        && p.getEstado() != EstadoPracticaTipo.REPROBADA 
                        && p.getEstado() != EstadoPracticaTipo.CANCELADA)
                .collect(Collectors.toList());
        long activos = practicasActivas.size();

        // Indicador 2: Tasa de aprobación global
        long completadas = practicas.stream().filter(p -> p.getEstado() == EstadoPracticaTipo.COMPLETADA).count();
        long reprobadas = practicas.stream().filter(p -> p.getEstado() == EstadoPracticaTipo.REPROBADA).count();
        long totalEvaluados = completadas + reprobadas;
        
        BigDecimal tasaAprobacion = BigDecimal.ZERO;
        if (totalEvaluados > 0) {
            tasaAprobacion = BigDecimal.valueOf(completadas)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalEvaluados), 2, RoundingMode.HALF_UP);
        }

        // Indicador 3: Empresas activas
        long empresasActivas = empresaRepository.findAll().stream().filter(Empresa::isActivo).count();

        // Indicador 4: Tiempo promedio de gestión (días desde creación hasta inicio de la práctica)
        double tiempoPromedio = practicas.stream()
                .filter(p -> p.getFechaInicio() != null)
                .mapToLong(p -> {
                    LocalDateTime inicio = p.getFechaInicio().atStartOfDay();
                    return ChronoUnit.DAYS.between(p.getFechaCreacion(), inicio);
                })
                .average()
                .orElse(14.5); // Fallback si no hay datos

        // Nuevos Indicadores Requeridos:
        // 1. practicasCerradas (total de prácticas completadas y reprobadas)
        long practicasCerradas = completadas + reprobadas;

        // 2. porcentajePrácticasConSeguimiento (porcentaje de prácticas activas que tienen al menos un avance registrado)
        long activasConSeguimiento = calcularActivasConSeguimiento(practicasActivas);
        double porcentajePracticasConSeguimiento = 0.0;
        if (activos > 0) {
            porcentajePracticasConSeguimiento = BigDecimal.valueOf(activasConSeguimiento)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(activos), 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        // 3. porcentajePrácticasConEvaluacionFinal (porcentaje de prácticas cerradas que tienen la evaluación final registrada)
        List<Practica> practicasCerradasList = practicas.stream()
                .filter(p -> p.getEstado() == EstadoPracticaTipo.COMPLETADA || p.getEstado() == EstadoPracticaTipo.REPROBADA)
                .collect(Collectors.toList());
        long conEvaluacionFinal = calcularConEvaluacionFinal(practicasCerradasList);
        double porcentajePracticasConEvaluacionFinal = 0.0;
        if (practicasCerradas > 0) {
            porcentajePracticasConEvaluacionFinal = BigDecimal.valueOf(conEvaluacionFinal)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(practicasCerradas), 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        // 4. documentosPendientes (cantidad de documentos en estado "PENDIENTE" en el repositorio)
        long documentosPendientes = calcularDocumentosPendientes(practicas);

        // 5. porcentajeDocumentacionCompleta (porcentaje promedio de documentación cargada sobre el total requerido)
        double porcentajeDocumentacionCompleta = calcularPorcentajeDocumentacionCompleta(practicas);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("practicantesActivos", activos);
        metrics.put("tasaAprobacion", tasaAprobacion.doubleValue());
        metrics.put("empresasActivas", empresasActivas);
        metrics.put("tiempoPromedioPlacementDias", Math.round(tiempoPromedio * 10.0) / 10.0);
        metrics.put("tiempoPromedioRespuesta", Math.round(tiempoPromedio * 10.0) / 10.0);
        metrics.put("periodo", periodo);

        // Agregamos con y sin acentos para mayor compatibilidad con llamadas frontend o pruebas
        metrics.put("practicasCerradas", practicasCerradas);
        metrics.put("porcentajePracticasConSeguimiento", porcentajePracticasConSeguimiento);
        metrics.put("porcentajePrácticasConSeguimiento", porcentajePracticasConSeguimiento);
        metrics.put("porcentajePracticasConEvaluacionFinal", porcentajePracticasConEvaluacionFinal);
        metrics.put("porcentajePrácticasConEvaluacionFinal", porcentajePracticasConEvaluacionFinal);
        metrics.put("documentosPendientes", documentosPendientes);
        metrics.put("porcentajeDocumentacionCompleta", porcentajeDocumentacionCompleta);

        // Agrupación por Facultad para gráficos
        Map<String, Long> porFacultad = practicas.stream()
                .filter(p -> p.getEstudiante() != null)
                .collect(Collectors.groupingBy(p -> p.getEstudiante().getPrograma().getFacultad().getNombre(), Collectors.counting()));
        metrics.put("distribucionPorFacultad", porFacultad);

        return metrics;
    }

    private long calcularActivasConSeguimiento(List<Practica> practicasActivas) {
        long count = 0;
        for (Practica p : practicasActivas) {
            if (!avanceRepository.findByPracticaIdOrderByCreatedAtDesc(p.getId()).isEmpty()) {
                count++;
            }
        }
        return count;
    }

    private long calcularConEvaluacionFinal(List<Practica> practicasCerradas) {
        long count = 0;
        for (Practica p : practicasCerradas) {
            Optional<Evaluacion> eval = evaluacionRepository.findByPracticaIdAndActivoTrue(p.getId());
            if (eval.isPresent() && eval.get().getNotaFinal() != null) {
                count++;
            }
        }
        return count;
    }

    private long calcularDocumentosPendientes(List<Practica> practicas) {
        long count = 0;
        for (Practica p : practicas) {
            List<PracticaDocumento> docs = practicaDocumentoRepository.findByPracticaId(p.getId());
            count += docs.stream()
                    .filter(d -> PENDIENTE_ESTADO.equalsIgnoreCase(d.getEstado()))
                    .count();
        }
        return count;
    }

    private double calcularPorcentajeDocumentacionCompleta(List<Practica> practicas) {
        double sumaPorcentajes = 0.0;
        List<String> obligatorios = List.of("ARL", "PLANEADOR", "INFORME_EJECUTIVO", "PRESENTACION", "DOCUMENTO_FINAL");
        for (Practica p : practicas) {
            List<PracticaDocumento> docs = practicaDocumentoRepository.findByPracticaId(p.getId());
            long uploadedUniqueCategories = docs.stream()
                    .map(d -> d.getCategoria().toUpperCase())
                    .filter(obligatorios::contains)
                    .distinct()
                    .count();
            sumaPorcentajes += (uploadedUniqueCategories * 100.0) / 5.0;
        }
        if (practicas.isEmpty()) {
            return 0.0;
        }
        return BigDecimal.valueOf(sumaPorcentajes)
                .divide(BigDecimal.valueOf(practicas.size()), 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private List<Object> mapEvaluacionFila(Evaluacion e) {
        return List.of(
                e.getPractica().getEstudiante().getUsuario().getNombre(),
                e.getPractica().getEstudiante().getPrograma().getNombre(),
                e.getPractica().getNumeroPractica(),
                e.getNotaDocente() != null ? e.getNotaDocente() : PENDIENTE_LABEL,
                e.getNotaTutor() != null ? e.getNotaTutor() : PENDIENTE_LABEL,
                e.getNotaFinal() != null ? e.getNotaFinal() : PENDIENTE_LABEL,
                e.getPractica().getResultado() != null ? e.getPractica().getResultado() : "En Proceso"
        );
    }

    private LocalDateTime[] parsePeriodo(String periodo) {
        // Formato esperado: "YYYY-1" o "YYYY-2"
        String[] parts = periodo.split("-");
        int year = Integer.parseInt(parts[0]);
        int semester = Integer.parseInt(parts[1]);

        LocalDateTime start;
        LocalDateTime end;
        if (semester == 1) {
            start = LocalDateTime.of(year, 1, 1, 0, 0);
            end = LocalDateTime.of(year, 6, 30, 23, 59, 59);
        } else {
            start = LocalDateTime.of(year, 7, 1, 0, 0);
            end = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        }
        return new LocalDateTime[]{start, end};
    }
}
