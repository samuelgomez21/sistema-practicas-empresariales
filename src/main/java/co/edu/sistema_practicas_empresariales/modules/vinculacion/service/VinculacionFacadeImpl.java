package co.edu.sistema_practicas_empresariales.modules.vinculacion.service;

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
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del facade para Vinculación.
 * Aplica principios SOLID: la lógica de negocio está en este servicio (SRP),
 * usa inyección de dependencias (DIP) y delega a los repositorios.
 */
@Service
@RequiredArgsConstructor
public class VinculacionFacadeImpl implements VinculacionFacade {

    private final VinculacionRepository vinculacionRepository;
    private final VacanteRepository vacanteRepository;

    @Override
    @Transactional
    public VinculacionResponse crearVinculacion(VinculacionCreateDto dto) {
        // Obtener la vacante asociada y validar existencia
        Vacante vacante = vacanteRepository.findByIdAndEliminadoFalse(dto.getVacanteId())
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada o eliminada"));

        Vinculacion vinculacion = Vinculacion.builder()
                .vacante(vacante)
                .cargo(dto.getCargo())
                .descripcion(dto.getDescripcion())
                .requisitosEstudiante(dto.getRequisitosEstudiante())
                .numeroCupos(dto.getNumeroCupos())
                .cuposDisponibles(dto.getCuposDisponibles())
                .area(dto.getArea())
                .modalidad(dto.getModalidad())
                .estado(dto.getEstado() != null ? dto.getEstado() : EstadoVinculacionTipo.PENDIENTE)
                .build();

        vinculacion = vinculacionRepository.save(vinculacion);
        return mapToResponse(vinculacion);
    }

    @Override
    @Transactional
    public VinculacionResponse actualizarVinculacion(Long id, VinculacionUpdateDto dto) {
        Vinculacion vinculacion = vinculacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Vinculación no encontrada o eliminada"));
        // Actualizar campos (solo los que llegan en el DTO)
        if (dto.getCargo() != null) vinculacion.setCargo(dto.getCargo());
        if (dto.getDescripcion() != null) vinculacion.setDescripcion(dto.getDescripcion());
        if (dto.getRequisitosEstudiante() != null) vinculacion.setRequisitosEstudiante(dto.getRequisitosEstudiante());
        if (dto.getNumeroCupos() > 0) vinculacion.setNumeroCupos(dto.getNumeroCupos());
        if (dto.getCuposDisponibles() >= 0) vinculacion.setCuposDisponibles(dto.getCuposDisponibles());
        if (dto.getArea() != null) vinculacion.setArea(dto.getArea());
        if (dto.getModalidad() != null) vinculacion.setModalidad(dto.getModalidad());
        if (dto.getEstado() != null) vinculacion.setEstado(dto.getEstado());

        vinculacion = vinculacionRepository.save(vinculacion);
        return mapToResponse(vinculacion);
    }

    @Override
    @Transactional
    public void softDeleteVinculacion(Long id) {
        // Verificar existencia antes de marcar eliminado
        Vinculacion vinculacion = vinculacionRepository.findByIdAndEliminadoFalse(id)
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
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VinculacionResponse> listarPorVacante(Long vacanteId) {
        return vinculacionRepository.findAllByEliminadoFalse()
                .stream()
                .filter(v -> v.getVacante() != null && v.getVacante().getId().equals(vacanteId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
