package co.edu.sistema_practicas_empresariales.modules.cierre.service.impl;

import co.edu.sistema_practicas_empresariales.modules.cierre.dto.ChecklistResponse;
import co.edu.sistema_practicas_empresariales.modules.cierre.dto.CierreDto;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.ChecklistCierreService;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.CierreService;
import co.edu.sistema_practicas_empresariales.modules.practica.dto.ChecklistDto;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import co.edu.sistema_practicas_empresariales.modules.evaluacion.repository.EvaluacionRepository;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaParametroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio de cierre formal de práctica.
 * Usa ChecklistCierreService para validar en tiempo real
 * en vez de la tabla checklist_item que puede estar desactualizada.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CierreServiceImpl implements CierreService {

    private final PracticaRepository        practicaRepository;
    private final ChecklistCierreService    checklistCierreService;
    private final EvaluacionRepository      evaluacionRepository;
    private final ProgramaParametroRepository programaParametroRepository;

    @Override
    public CierreDto ejecutarCierre(Long practicaId) {

        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new RuntimeException("Práctica no encontrada"));

        if (practica.getEstado() != EstadoPracticaTipo.EN_PRACTICA) {
            throw new RuntimeException(
                    "Solo se puede cerrar una práctica en estado EN_PRACTICA. " +
                            "Estado actual: " + practica.getEstado());
        }

        // Validar en tiempo real con ChecklistCierreService
        ChecklistResponse ck = checklistCierreService.obtenerChecklistCierre(practicaId);

        if (!ck.isTodoListo()) {
            List<ChecklistDto> items = buildChecklistDto(ck);
            return CierreDto.builder()
                    .practicaId(practicaId)
                    .estadoAnterior(practica.getEstado())
                    .estadoNuevo(practica.getEstado())
                    .checklist(items)
                    .exitoso(false)
                    .mensaje("No se puede cerrar. Aún hay requisitos pendientes.")
                    .build();
        }

        EstadoPracticaTipo estadoAnterior = practica.getEstado();

        // Obtener nota mínima del programa
        BigDecimal notaMinima = programaParametroRepository
                .findByProgramaId(practica.getEstudiante().getPrograma().getId())
                .map(p -> p.getNotaMinimaAprobacion())
                .orElse(BigDecimal.valueOf(3.0));

        // Sincronizar nota final de la evaluación al modelo Practica
        // (necesario porque ejecutarCierre lee practica.getNotaFinal())
        BigDecimal notaFinal = evaluacionRepository
                .findByPracticaIdAndActivoTrue(practicaId)
                .map(e -> e.getNotaFinal())
                .orElseThrow(() -> new RuntimeException("No se encontró nota final registrada"));

        practica.setNotaFinal(notaFinal);

        // Patrón State: ejecutarCierre lee notaFinal y transiciona a COMPLETADA o REPROBADA
        practica.ejecutarCierre(notaMinima);
        practicaRepository.save(practica);

        return CierreDto.builder()
                .practicaId(practicaId)
                .estadoAnterior(estadoAnterior)
                .estadoNuevo(practica.getEstado())
                .fechaCierre(LocalDateTime.now())
                .checklist(buildChecklistDto(ck))
                .exitoso(true)
                .mensaje("Práctica cerrada exitosamente — estado: " + practica.getEstado())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CierreDto verificarEstadoCierre(Long practicaId) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new RuntimeException("Práctica no encontrada"));

        ChecklistResponse ck = checklistCierreService.obtenerChecklistCierre(practicaId);

        return CierreDto.builder()
                .practicaId(practicaId)
                .estadoAnterior(practica.getEstado())
                .estadoNuevo(practica.getEstado())
                .checklist(buildChecklistDto(ck))
                .exitoso(ck.isTodoListo())
                .mensaje(ck.isTodoListo()
                        ? "Todos los requisitos están completos. Se puede ejecutar el cierre."
                        : "Faltan requisitos por completar.")
                .build();
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private List<ChecklistDto> buildChecklistDto(ChecklistResponse ck) {
        return List.of(
                ChecklistDto.builder().clave("nota_docente")
                        .label("Nota docente registrada")
                        .completado(ck.isNotaDocenteRegistrada()).build(),
                ChecklistDto.builder().clave("nota_tutor")
                        .label("Nota tutor registrada")
                        .completado(ck.isNotaTutorRegistrada()).build(),
                ChecklistDto.builder().clave("nota_final")
                        .label("Nota final registrada")
                        .completado(ck.isNotaFinalRegistrada()).build(),
                ChecklistDto.builder().clave("encuesta_estudiante")
                        .label("Encuesta estudiante completada")
                        .completado("COMPLETADA".equals(ck.getEstadoEncuestaEstudiante())).build(),
                ChecklistDto.builder().clave("encuesta_tutor")
                        .label("Encuesta tutor completada")
                        .completado("COMPLETADA".equals(ck.getEstadoEncuestaTutor())).build(),
                ChecklistDto.builder().clave("documentos_aprobados")
                        .label("Documentos aprobados")
                        .completado(ck.isDocumentosAprobados()).build(),
                ChecklistDto.builder().clave("informe_final")
                        .label("Informe final aprobado")
                        .completado(ck.isInformeFinalAprobado()).build()
        );
    }
}