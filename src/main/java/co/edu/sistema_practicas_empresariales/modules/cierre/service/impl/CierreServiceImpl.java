package co.edu.sistema_practicas_empresariales.modules.cierre.service.impl;

import co.edu.sistema_practicas_empresariales.modules.cierre.dto.CierreDto;
import co.edu.sistema_practicas_empresariales.modules.cierre.service.CierreService;
import co.edu.sistema_practicas_empresariales.modules.practica.dto.ChecklistDto;
import co.edu.sistema_practicas_empresariales.modules.practica.model.ChecklistItem;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.ChecklistItemRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio de cierre formal de práctica.
 *
 * Patrones aplicados:
 * - Facade: coordina la validación del checklist, cambio de estado
 *   y registro — el controlador solo llama a un método.
 * - Chain of Responsibility: el checklist valida secuencialmente
 *   cada requisito antes de permitir el cierre.
 * - State: delega el cambio de estado al modelo Practica.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CierreServiceImpl implements CierreService {

    private final PracticaRepository      practicaRepository;
    private final ChecklistItemRepository checklistRepository;

    /**
     * Patrón Facade: punto de entrada único para el cierre formal.
     * Coordina: validar checklist → cambiar estado → volver inmutable.
     *
     * Patrón Chain of Responsibility: cada ítem del checklist
     * es un eslabón. Si uno falla, se detiene y se informa qué falta.
     */
    public CierreDto ejecutarCierre(Long practicaId) {

        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new RuntimeException("Práctica no encontrada"));

        // Patrón State: solo se puede cerrar desde EN_PRACTICA
        if (practica.getEstado() != EstadoPracticaTipo.EN_PRACTICA) {
            throw new RuntimeException(
                    "Solo se puede cerrar una práctica en estado EN_PRACTICA. " +
                            "Estado actual: " + practica.getEstado());
        }

        List<ChecklistItem> items = checklistRepository.findByPracticaId(practicaId);

        // Patrón Chain of Responsibility: verificar cada eslabón
        List<ChecklistItem> pendientes = items.stream()
                .filter(i -> !i.getCompletado())
                .toList();

        if (!pendientes.isEmpty()) {
            String faltantes = pendientes.stream()
                    .map(ChecklistItem::getLabel)
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("");

            return CierreDto.builder()
                    .practicaId(practicaId)
                    .estadoAnterior(practica.getEstado())
                    .estadoNuevo(practica.getEstado())
                    .checklist(toChecklistDto(items))
                    .exitoso(false)
                    .mensaje("No se puede cerrar. Pendiente: " + faltantes)
                    .build();
        }

        // Validar documentos finales requeridos
        validarDocumentosFinales(practica);

        EstadoPracticaTipo estadoAnterior = practica.getEstado();

        // Patrón State: determinar si es COMPLETADA o REPROBADA según nota
        practica.registrarNotaFinal(
                practica.getNotaFinal(),
                obtenerNotaMinima(practica)
        );

        practicaRepository.save(practica);

        log.info("Práctica cerrada — practicaId={} estado={}",
                practicaId, practica.getEstado());

        return CierreDto.builder()
                .practicaId(practicaId)
                .estadoAnterior(estadoAnterior)
                .estadoNuevo(practica.getEstado())
                .fechaCierre(LocalDateTime.now())
                .checklist(toChecklistDto(items))
                .exitoso(true)
                .mensaje("Práctica cerrada exitosamente")
                .build();
    }

    /**
     * Consulta el estado del checklist sin ejecutar el cierre.
     * Útil para mostrar al coordinador qué falta antes de cerrar.
     */
    @Transactional(readOnly = true)
    public CierreDto verificarEstadoCierre(Long practicaId) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new RuntimeException("Práctica no encontrada"));

        List<ChecklistItem> items = checklistRepository.findByPracticaId(practicaId);

        List<ChecklistItem> pendientes = items.stream()
                .filter(i -> !i.getCompletado())
                .toList();

        boolean listo = pendientes.isEmpty()
                && tieneDocumentosFinales(practica);

        return CierreDto.builder()
                .practicaId(practicaId)
                .estadoAnterior(practica.getEstado())
                .estadoNuevo(practica.getEstado())
                .checklist(toChecklistDto(items))
                .exitoso(listo)
                .mensaje(listo
                        ? "Todos los requisitos están completos. Se puede ejecutar el cierre."
                        : "Faltan requisitos por completar.")
                .build();
    }

    // ── Privados ───────────────────────────────────────────────────

    /**
     * Valida que los documentos finales requeridos estén cargados.
     * Patrón Chain of Responsibility: otro eslabón de validación.
     */
    private void validarDocumentosFinales(Practica practica) {
        StringBuilder faltantes = new StringBuilder();

        if (practica.getInformeEjecutivoUrl() == null) {
            faltantes.append("Informe ejecutivo, ");
        }
        if (practica.getPresentacionUrl() == null) {
            faltantes.append("Presentación final, ");
        }
        if (practica.getDocumentoFinalUrl() == null) {
            faltantes.append("Documento final, ");
        }

        if (!faltantes.isEmpty()) {
            throw new RuntimeException(
                    "Documentos faltantes para el cierre: " + faltantes);
        }
    }

    private boolean tieneDocumentosFinales(Practica practica) {
        return practica.getInformeEjecutivoUrl() != null
                && practica.getPresentacionUrl() != null
                && practica.getDocumentoFinalUrl() != null;
    }

    private java.math.BigDecimal obtenerNotaMinima(Practica practica) {
        // Por defecto 3.0 — cuando esté disponible el repo de parámetros
        // se obtiene de programa_parametros.nota_minima_aprobacion
        return java.math.BigDecimal.valueOf(3.0);
    }

    private List<ChecklistDto> toChecklistDto(List<ChecklistItem> items) {
        return items.stream()
                .map(i -> ChecklistDto.builder()
                        .id(i.getId())
                        .clave(i.getClave())
                        .label(i.getLabel())
                        .completado(i.getCompletado())
                        .build())
                .toList();
    }
}