package co.edu.sistema_practicas_empresariales.modules.reporte.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.EncuestaItemRespuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.model.EncuestaRespuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.repository.EncuestaRespuestaRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.model.Evaluacion;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import co.edu.sistema_practicas_empresariales.modules.reporte.dto.*;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportesFacadeImpl implements ReporteFacade {

    private final EstudianteRepository    estudianteRepository;
    private final PracticaRepository      practicaRepository;
    private final EvaluacionRepository    evaluacionRepository;
    private final EmpresaRepository       empresaRepository;
    private final VacanteRepository       vacanteRepository;
    private final EncuestaRespuestaRepository encuestaRespuestaRepository;

    // ── 1. Estado del proceso ─────────────────────────────────────────────────

    @Override
    public List<ReporteEstadoProcesoDto> reporteEstadoProceso(
            Long programaId, Long facultadId, String periodo, Integer numeroPractica) {

        List<Estudiante> estudiantes = estudianteRepository.findByActivoTrue();

        // Filtros
        if (programaId != null) {
            estudiantes = estudiantes.stream()
                    .filter(e -> e.getPrograma().getId().equals(programaId))
                    .toList();
        }
        if (facultadId != null) {
            estudiantes = estudiantes.stream()
                    .filter(e -> e.getPrograma().getFacultad() != null
                            && e.getPrograma().getFacultad().getId().equals(facultadId))
                    .toList();
        }

        // Agrupar por programa + numeroPractica
        Map<String, List<Estudiante>> grupos = estudiantes.stream()
                .collect(Collectors.groupingBy(e ->
                        e.getPrograma().getId() + "_" + e.getPrograma().getNombre()
                ));

        return grupos.entrySet().stream().map(entry -> {
            String[] parts   = entry.getKey().split("_", 2);
            List<Estudiante> grupo = entry.getValue();

            // Prácticas activas de este grupo
            List<Practica> practicas = practicaRepository.findAll().stream()
                    .filter(p -> p.isActivo()
                            && grupo.stream().anyMatch(e -> e.getId().equals(p.getEstudiante().getId())))
                    .filter(p -> numeroPractica == null || p.getNumeroPractica() == numeroPractica)
                    .toList();

            long enPractica    = count(practicas, EstadoPracticaTipo.EN_PRACTICA);
            long completadas   = count(practicas, EstadoPracticaTipo.COMPLETADA);
            long reprobadas    = count(practicas, EstadoPracticaTipo.REPROBADA);
            long canceladas    = count(practicas, EstadoPracticaTipo.CANCELADA);
            long vinculada     = count(practicas, EstadoPracticaTipo.VINCULADA);
            long enVinculacion = count(practicas, EstadoPracticaTipo.EN_PROCESO_VINCULACION);
            long asignada      = count(practicas, EstadoPracticaTipo.ASIGNADA_PENDIENTE_INICIO);

            long aptos    = grupo.stream().filter(e ->
                    e.getEstadoAptitud() == Estudiante.EstadoAptitud.APTO).count();
            long noAptos  = grupo.stream().filter(e ->
                    e.getEstadoAptitud() == Estudiante.EstadoAptitud.NO_APTO).count();
            long sinEval  = grupo.stream().filter(e ->
                    e.getEstadoAptitud() == Estudiante.EstadoAptitud.SIN_EVALUAR
                            || e.getEstadoAptitud() == Estudiante.EstadoAptitud.EN_REVISION).count();

            return ReporteEstadoProcesoDto.builder()
                    .programa(parts.length > 1 ? parts[1] : parts[0])
                    .facultad(grupo.get(0).getPrograma().getFacultad() != null
                            ? grupo.get(0).getPrograma().getFacultad().getNombre() : '—' + "")
                    .numeroPractica(numeroPractica)
                    .periodo(periodo)
                    .sinEvaluar(sinEval)
                    .aptos(aptos)
                    .noAptos(noAptos)
                    .asignadaPendienteInicio(asignada)
                    .enProcesoVinculacion(enVinculacion)
                    .vinculada(vinculada)
                    .enPractica(enPractica)
                    .completadas(completadas)
                    .reprobadas(reprobadas)
                    .canceladas(canceladas)
                    .totalEstudiantes(grupo.size())
                    .build();
        }).toList();
    }

    private long count(List<Practica> practicas, EstadoPracticaTipo estado) {
        return practicas.stream().filter(p -> p.getEstado() == estado).count();
    }

    // ── 2. Notas ──────────────────────────────────────────────────────────────

    @Override
    public List<ReporteNotasDto> reporteNotas(
            Long programaId, String periodo, Long docenteId, Long empresaId, String resultado) {

        List<Practica> practicas = practicaRepository.findAll().stream()
                .filter(Practica::isActivo)
                .toList();

        // Filtros
        if (programaId != null) {
            practicas = practicas.stream()
                    .filter(p -> p.getEstudiante().getPrograma().getId().equals(programaId))
                    .toList();
        }
        if (docenteId != null) {
            practicas = practicas.stream()
                    .filter(p -> p.getDocenteAsesor() != null
                            && p.getDocenteAsesor().getId().equals(docenteId))
                    .toList();
        }
        if (empresaId != null) {
            practicas = practicas.stream()
                    .filter(p -> empresaId.equals(p.getEmpresaId()))
                    .toList();
        }

        return practicas.stream().map(p -> {
                    Evaluacion eval = null;
                    try {
                        eval = evaluacionRepository.findByPracticaIdAndActivoTrue(p.getId()).orElse(null);
                    } catch (Exception ignored) {}

                    String resultadoCalc = p.getResultado() != null
                            ? p.getResultado()
                            : (eval != null && eval.getNotaFinal() != null ? p.getResultado() : "PENDIENTE");

                    if (resultadoCalc == null) resultadoCalc = "PENDIENTE";

                    // Filtro resultado
                    if (resultado != null && !resultado.isBlank()
                            && !resultado.equalsIgnoreCase(resultadoCalc)) {
                        return null;
                    }

                    // Nombre empresa
                    String empresaNombre = "—";
                    if (p.getEmpresaId() != null) {
                        try {
                            empresaNombre = empresaRepository.findById(p.getEmpresaId())
                                    .map(e -> e.getRazonSocial()).orElse("Empresa #" + p.getEmpresaId());
                        } catch (Exception ignored) {}
                    }

                    return ReporteNotasDto.builder()
                            .practicaId(p.getId())
                            .estudianteNombre(p.getEstudiante().getUsuario().getNombre())
                            .estudianteIdentificacion(p.getEstudiante().getIdentificacion())
                            .programa(p.getEstudiante().getPrograma().getNombre())
                            .numeroPractica(p.getNumeroPractica())
                            .empresaNombre(empresaNombre)
                            .docenteNombre(p.getDocenteAsesor() != null
                                    ? p.getDocenteAsesor().getNombre() : "—")
                            .notaDocente(eval != null ? eval.getNotaDocente() : null)
                            .notaTutor(eval   != null ? eval.getNotaTutor()   : null)
                            .notaFinal(eval   != null ? eval.getNotaFinal()   : null)
                            .resultado(resultadoCalc)
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }

    // ── 3. Empresas y vacantes ────────────────────────────────────────────────

    @Override
    public List<ReporteEmpresaVacanteDto> reporteEmpresasVacantes(
            String sector, Long programaId, String periodo) {

        return empresaRepository.findAll().stream()
                .filter(e -> e.isActivo())
                .filter(e -> sector == null || sector.isBlank()
                        || sector.equalsIgnoreCase(e.getSectorEconomico()))
                .map(empresa -> {
                    // Vacantes
                    var vacantes = vacanteRepository.findByEmpresaId(empresa.getId());
                    long vPendientes = vacantes.stream()
                            .filter(v -> v.getEstado() == EstadoVacanteTipo.PENDIENTE).count();
                    long vActivas = vacantes.stream()
                            .filter(v -> v.getEstado() == EstadoVacanteTipo.APROBADA).count();
                    long vCerradas = vacantes.stream()
                            .filter(v -> v.getEstado() == EstadoVacanteTipo.CERRADA).count();

                    // Prácticas
                    var practicas = practicaRepository.findByEmpresaIdAndActivoTrue(empresa.getId());
                    long historicos   = practicas.size();
                    long activos      = practicas.stream()
                            .filter(p -> p.getEstado() == EstadoPracticaTipo.EN_PRACTICA).count();
                    long completados  = practicas.stream()
                            .filter(p -> p.getEstado() == EstadoPracticaTipo.COMPLETADA).count();
                    long reprobados   = practicas.stream()
                            .filter(p -> p.getEstado() == EstadoPracticaTipo.REPROBADA).count();

                    double tasa = historicos > 0
                            ? (double) completados / historicos * 100.0 : 0.0;

                    return ReporteEmpresaVacanteDto.builder()
                            .empresaId(empresa.getId())
                            .razonSocial(empresa.getRazonSocial())
                            .nit(empresa.getNit())
                            .sector(empresa.getSectorEconomico())
                            .municipio(empresa.getMunicipio())
                            .vacantesPendientes(vPendientes)
                            .vacantesActivas(vActivas)
                            .vacantesCerradas(vCerradas)
                            .totalVacantes(vacantes.size())
                            .practicantesHistoricos(historicos)
                            .practicantesActivos(activos)
                            .practicantesCompletados(completados)
                            .practicantesReprobados(reprobados)
                            .tasaFinalizacionExitosa(Math.round(tasa * 10.0) / 10.0)
                            .build();
                })
                .toList();
    }

    // ── 4. Encuestas ──────────────────────────────────────────────────────────

    @Override
    public ReporteEncuestasDto reporteEncuestas(Long programaId, String periodo, String tipo) {

        List<EncuestaRespuesta> respuestas = encuestaRespuestaRepository.findAll();

        // Filtro tipo
        if (tipo != null && !tipo.isBlank()) {
            respuestas = respuestas.stream()
                    .filter(r -> tipo.equalsIgnoreCase(r.getTipo().name()))
                    .toList();
        }

        // Filtro programa — a través de la práctica
        if (programaId != null) {
            final Long pid = programaId;
            respuestas = respuestas.stream()
                    .filter(r -> {
                        try {
                            return practicaRepository.findById(r.getPracticaId())
                                    .map(p -> p.getEstudiante().getPrograma().getId().equals(pid))
                                    .orElse(false);
                        } catch (Exception e) { return false; }
                    })
                    .toList();
        }

        int totalRespuestas = respuestas.size();
        long totalPracticas = practicaRepository.count();
        double tasaRespuesta = totalPracticas > 0
                ? (double) totalRespuestas / totalPracticas * 100.0 : 0.0;

        // Promedios por pregunta
        Map<Long, List<Integer>> porPregunta = new LinkedHashMap<>();
        Map<Long, String>        textoPregunta = new LinkedHashMap<>();

        for (EncuestaRespuesta r : respuestas) {
            for (EncuestaItemRespuesta item : r.getItems()) {
                if (item.getValorEscala() != null) {
                    Long pid2 = item.getPregunta().getId();
                    porPregunta.computeIfAbsent(pid2, k -> new ArrayList<>())
                            .add(item.getValorEscala());
                    textoPregunta.putIfAbsent(pid2, item.getPregunta().getTexto());
                }
            }
        }

        List<ReporteEncuestasDto.PromedioPreguntaDto> promediosPregunta = porPregunta.entrySet()
                .stream().map(e -> ReporteEncuestasDto.PromedioPreguntaDto.builder()
                        .preguntaId(e.getKey())
                        .textoPregunta(textoPregunta.get(e.getKey()))
                        .promedio(e.getValue().stream().mapToInt(i -> i).average().orElse(0.0))
                        .totalRespuestas(e.getValue().size())
                        .build())
                .toList();

        // Promedios por empresa — agrupando a través de practica → empresa
        Map<Long, List<Double>> porEmpresa      = new LinkedHashMap<>();
        Map<Long, String>       nombreEmpresa   = new LinkedHashMap<>();

        for (EncuestaRespuesta r : respuestas) {
            try {
                Practica practica = practicaRepository.findById(r.getPracticaId()).orElse(null);
                if (practica == null || practica.getEmpresaId() == null) continue;

                Long empId = practica.getEmpresaId();
                double prom = r.getItems().stream()
                        .filter(i -> i.getValorEscala() != null)
                        .mapToInt(EncuestaItemRespuesta::getValorEscala)
                        .average().orElse(0.0);

                porEmpresa.computeIfAbsent(empId, k -> new ArrayList<>()).add(prom);

                if (!nombreEmpresa.containsKey(empId)) {
                    empresaRepository.findById(empId).ifPresent(em ->
                            nombreEmpresa.put(empId, em.getRazonSocial()));
                }
            } catch (Exception ignored) {}
        }

        List<ReporteEncuestasDto.PromedioEmpresaDto> promediosEmpresa = porEmpresa.entrySet()
                .stream().map(e -> {
                    int total = e.getValue().size();
                    double avg = e.getValue().stream().mapToDouble(d -> d).average().orElse(0.0);
                    return ReporteEncuestasDto.PromedioEmpresaDto.builder()
                            .empresaId(e.getKey())
                            .empresaNombre(nombreEmpresa.getOrDefault(e.getKey(), "Empresa #" + e.getKey()))
                            .promedioGeneral(Math.round(avg * 10.0) / 10.0)
                            .totalRespuestas(total)
                            .suficientesRespuestas(total >= 5) // confidencialidad
                            .build();
                })
                .toList();

        // Promedios por programa
        Map<Long, List<Double>> porPrograma    = new LinkedHashMap<>();
        Map<Long, String>       nombrePrograma = new LinkedHashMap<>();

        for (EncuestaRespuesta r : respuestas) {
            try {
                Practica practica = practicaRepository.findById(r.getPracticaId()).orElse(null);
                if (practica == null) continue;

                Long progId = practica.getEstudiante().getPrograma().getId();
                double prom = r.getItems().stream()
                        .filter(i -> i.getValorEscala() != null)
                        .mapToInt(EncuestaItemRespuesta::getValorEscala)
                        .average().orElse(0.0);

                porPrograma.computeIfAbsent(progId, k -> new ArrayList<>()).add(prom);
                nombrePrograma.putIfAbsent(progId,
                        practica.getEstudiante().getPrograma().getNombre());
            } catch (Exception ignored) {}
        }

        List<ReporteEncuestasDto.PromedioPrograma> promediosPrograma = porPrograma.entrySet()
                .stream().map(e -> {
                    double avg = e.getValue().stream().mapToDouble(d -> d).average().orElse(0.0);
                    return ReporteEncuestasDto.PromedioPrograma.builder()
                            .programaId(e.getKey())
                            .programaNombre(nombrePrograma.getOrDefault(e.getKey(), "—"))
                            .promedioGeneral(Math.round(avg * 10.0) / 10.0)
                            .totalRespuestas(e.getValue().size())
                            .build();
                })
                .toList();

        return ReporteEncuestasDto.builder()
                .totalRespuestas(totalRespuestas)
                .totalPracticas((int) totalPracticas)
                .tasaRespuesta(Math.round(tasaRespuesta * 10.0) / 10.0)
                .promediosPorPregunta(promediosPregunta)
                .promediosPorEmpresa(promediosEmpresa)
                .promediosPorPrograma(promediosPrograma)
                .build();
    }
}