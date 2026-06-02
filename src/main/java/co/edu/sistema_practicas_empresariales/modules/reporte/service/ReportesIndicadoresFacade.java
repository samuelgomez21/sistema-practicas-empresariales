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

    private final PracticaRepository practicaRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final EncuestaRepository encuestaRepository;
    private final EmpresaRepository empresaRepository;
    private final VacanteRepository vacanteRepository;
    private final ProgramaRepository programaRepository;

    private final ExportadorReporte excelExportAdapter;
    private final ExportadorReporte pdfExportAdapter;

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
        builder.headers(Arrays.asList("ID Práctica", "Estudiante", "Programa", "Número Práctica", "Estado", "Fecha Creación"));

        if (programaId != null) {
            programaRepository.findById(programaId).ifPresent(prog -> builder.filtro("Programa", prog.getNombre()));
        }
        if (periodo != null) {
            builder.filtro("Periodo Académico", periodo);
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
        builder.headers(Arrays.asList("Estudiante", "Programa", "Número Práctica", "Nota Docente", "Nota Tutor", "Nota Final", "Resultado"));

        if (programaId != null) {
            programaRepository.findById(programaId).ifPresent(prog -> builder.filtro("Programa", prog.getNombre()));
        }
        if (periodo != null) {
            builder.filtro("Periodo Académico", periodo);
        }

        for (Evaluacion e : evaluaciones) {
            builder.fila(Arrays.asList(
                    e.getPractica().getEstudiante().getUsuario().getNombre(),
                    e.getPractica().getEstudiante().getPrograma().getNombre(),
                    e.getPractica().getNumeroPractica(),
                    e.getNotaDocente() != null ? e.getNotaDocente() : "Pendiente",
                    e.getNotaTutor() != null ? e.getNotaTutor() : "Pendiente",
                    e.getNotaFinal() != null ? e.getNotaFinal() : "Pendiente",
                    e.getPractica().getResultado() != null ? e.getPractica().getResultado() : "En Proceso"
            ));
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
        builder.headers(Arrays.asList("NIT", "Razón Social", "Sector", "Vacantes Pendientes", "Vacantes Activas", "Vacantes Cerradas", "Practicantes Activos", "Practicantes Históricos", "Tasa Finalización Exitosa (%)"));

        if (periodo != null) {
            builder.filtro("Periodo Académico", periodo);
        }

        for (Empresa e : empresas) {
            List<Vacante> vacantes = vacanteRepository.findByEmpresaId(e.getId());
            long pendientes = vacantes.stream().filter(v -> v.getEstado() == EstadoVacanteTipo.PENDIENTE).count();
            long activas = vacantes.stream().filter(v -> v.getEstado() == EstadoVacanteTipo.APROBADA).count();
            long cerradas = vacantes.stream().filter(v -> v.getEstado() == EstadoVacanteTipo.CERRADA).count();

            List<Practica> practicas = practicaRepository.findByEmpresaId(e.getId());
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
        builder.headers(Arrays.asList("ID Práctica", "Estudiante", "Programa", "Estado Encuesta Estudiante", "Comentarios Estudiante", "Estado Encuesta Tutor", "Comentarios Tutor"));

        for (Practica p : practicas) {
            Optional<Encuesta> estEnc = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(p.getId(), Encuesta.TipoActor.ESTUDIANTE);
            Optional<Encuesta> tutEnc = encuestaRepository.findByPracticaIdAndTipoActorAndActivoTrue(p.getId(), Encuesta.TipoActor.TUTOR_EMPRESARIAL);

            String estadoEst = estEnc.map(e -> e.getEstado().name()).orElse("PENDIENTE");
            String comentarioEst = estEnc.map(Encuesta::getComentarios).orElse("");

            String estadoTut = tutEnc.map(e -> e.getEstado().name()).orElse("PENDIENTE");
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
        long activos = practicas.stream()
                .filter(p -> p.getEstado() != EstadoPracticaTipo.COMPLETADA 
                        && p.getEstado() != EstadoPracticaTipo.REPROBADA 
                        && p.getEstado() != EstadoPracticaTipo.CANCELADA)
                .count();

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

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("practicantesActivos", activos);
        metrics.put("tasaAprobacion", tasaAprobacion.doubleValue());
        metrics.put("empresasActivas", empresasActivas);
        metrics.put("tiempoPromedioPlacementDias", Math.round(tiempoPromedio * 10.0) / 10.0);
        metrics.put("periodo", periodo);

        // Agrupación por Facultad para gráficos
        Map<String, Long> porFacultad = practicas.stream()
                .filter(p -> p.getEstudiante() != null)
                .collect(Collectors.groupingBy(p -> p.getEstudiante().getPrograma().getFacultad().getNombre(), Collectors.counting()));
        metrics.put("distribucionPorFacultad", porFacultad);

        return metrics;
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
