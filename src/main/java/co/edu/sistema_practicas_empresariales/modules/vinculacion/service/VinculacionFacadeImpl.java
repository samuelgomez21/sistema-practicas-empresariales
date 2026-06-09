package co.edu.sistema_practicas_empresariales.modules.vinculacion.service;

import java.util.Objects;
import java.util.List;

import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.model.Vinculacion;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.model.Vinculacion.EstadoVinculacionTipo;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.repository.VinculacionRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.event.VinculacionAprobadaEvent;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.event.VinculacionCreadaEvent;

/**
 * Implementación de la fachada para la gestión de vinculaciones.
 *
 * <p><b>Patrones de Diseño aplicados:</b></p>
 * <ul>
 *   <li><b>Facade:</b> Centraliza la lógica de negocio, validaciones y orquestación,
 *       ocultando la complejidad a los controladores.</li>
 *   <li><b>Observer:</b> Publica eventos (ej. VinculacionCreadaEvent, VinculacionAprobadaEvent)
 *       mediante ApplicationEventPublisher para desacoplar el envío de notificaciones y otras lógicas transversales.</li>
 * </ul>
 *
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class VinculacionFacadeImpl implements VinculacionFacade {

    private final VinculacionRepository vinculacionRepository;
    private final VacanteRepository vacanteRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public VinculacionResponse crearVinculacion(VinculacionCreateDto dto) {
        Objects.requireNonNull(dto, "VinculacionCreateDto no puede ser null");
        // Obtener la vacante asociada y validar existencia
        Vacante vacante = vacanteRepository.findByIdAndEliminadoFalse(dto.getVacanteId())
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada o eliminada"));

        Vinculacion vinculacion = Vinculacion.builder()
                .vacante(vacante)
                .cargo(dto.getCargo())
                .descripcion(dto.getDescripcion())
                .requisitosEstudiante(dto.getRequisitosEstudiante())
                .numeroCupos(dto.getNumeroCupos() != null ? dto.getNumeroCupos() : 0)
                .cuposDisponibles(dto.getCuposDisponibles() != null ? dto.getCuposDisponibles() : 0)
                .area(dto.getArea())
                .modalidad(dto.getModalidad())
                .estado(dto.getEstado() != null ? dto.getEstado() : EstadoVinculacionTipo.PENDIENTE)
                .build();

        vinculacion = vinculacionRepository.save(vinculacion);
        
        // Patrón Observer: Disparar evento de creación
        eventPublisher.publishEvent(new VinculacionCreadaEvent(vinculacion.getId(), vacante.getId()));
        
        return mapToResponse(vinculacion);
    }

    @Override
    @Transactional
    public VinculacionResponse actualizarVinculacion(Long id, VinculacionUpdateDto dto) {
        Objects.requireNonNull(id, "Id de Vinculación no puede ser null");
        Objects.requireNonNull(dto, "VinculacionUpdateDto no puede ser null");
        Vinculacion vinculacion = vinculacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Vinculación no encontrada o eliminada"));
        
        EstadoVinculacionTipo estadoAnterior = vinculacion.getEstado();
        
        // Actualizar campos (solo los que llegan en el DTO)
        if (dto.getCargo() != null) vinculacion.setCargo(dto.getCargo());
        if (dto.getDescripcion() != null) vinculacion.setDescripcion(dto.getDescripcion());
        if (dto.getRequisitosEstudiante() != null) vinculacion.setRequisitosEstudiante(dto.getRequisitosEstudiante());
        if (dto.getNumeroCupos() != null && dto.getNumeroCupos() > 0) vinculacion.setNumeroCupos(dto.getNumeroCupos());
        if (dto.getCuposDisponibles() != null && dto.getCuposDisponibles() >= 0) vinculacion.setCuposDisponibles(dto.getCuposDisponibles());
        if (dto.getArea() != null) vinculacion.setArea(dto.getArea());
        if (dto.getModalidad() != null) vinculacion.setModalidad(dto.getModalidad());
        if (dto.getEstado() != null) vinculacion.setEstado(dto.getEstado());

        vinculacion = vinculacionRepository.save(vinculacion);
        
        // Patrón Observer: Disparar evento si cambia a APROBADA
        if (estadoAnterior != EstadoVinculacionTipo.APROBADA && vinculacion.getEstado() == EstadoVinculacionTipo.APROBADA) {
            eventPublisher.publishEvent(new VinculacionAprobadaEvent(vinculacion.getId()));
        }
        
        return mapToResponse(vinculacion);
    }

    @Override
    @Transactional
    public void softDeleteVinculacion(Long id) {
        Objects.requireNonNull(id, "Id de Vinculación no puede ser null");
        // Verificar existencia antes de marcar eliminado
        vinculacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Vinculación no encontrada o ya eliminada"));
        vinculacionRepository.softDelete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public VinculacionResponse obtenerVinculacion(Long id) {
        Vinculacion vinculacion = vinculacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Vinculación no encontrada o eliminada"));
        return mapToResponse(vinculacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VinculacionResponse> listarTodas() {
        return vinculacionRepository.findAllByEliminadoFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VinculacionResponse> listarPorVacante(Long vacanteId) {
        return vinculacionRepository.findAllByEliminadoFalse()
                .stream()
                .filter(v -> v.getVacante() != null && v.getVacante().getId().equals(vacanteId))
                .map(this::mapToResponse)
                .toList();
    }

    private VinculacionResponse mapToResponse(Vinculacion v) {
        return VinculacionResponse.builder()
                .id(v.getId())
                .vacanteId(v.getVacante() != null ? v.getVacante().getId() : null)
                .cargo(v.getCargo())
                .descripcion(v.getDescripcion())
                .requisitosEstudiante(v.getRequisitosEstudiante())
                .numeroCupos(v.getNumeroCupos())
                .cuposDisponibles(v.getCuposDisponibles())
                .area(v.getArea())
                .modalidad(v.getModalidad())
                .estado(v.getEstado())
                .fechaCreacion(v.getFechaCreacion())
                .build();
    }
}
