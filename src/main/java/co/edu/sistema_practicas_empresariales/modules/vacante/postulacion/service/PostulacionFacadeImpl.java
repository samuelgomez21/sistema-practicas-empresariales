package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.service;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion.EstadoPostulacionTipo;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.repository.PostulacionRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del facade para la gestión de postulaciones.
 *
 * - Usa soft‑delete exclusivamente (no se elimina físicamente).
 * - Aplica los principios SOLID (SRP, DIP) y el patrón Facade.
 * - Todas las consultas excluyen registros marcados como eliminados.
 */
@Service
@RequiredArgsConstructor
public class PostulacionFacadeImpl implements PostulacionFacade {

    private final PostulacionRepository postulacionRepository;
    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public PostulacionResponse crearPostulacion(PostulacionCreateDto dto) {
        // Validar existencia de la vacante y del usuario (solo si no están eliminados)
        var vacante = vacanteRepository.findByIdAndEliminadoFalse(dto.getVacanteId())
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada o eliminada"));
        var usuario = usuarioRepository.findByIdAndActivoTrue(dto.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado o inactivo"));

        Postulacion postulacion = Postulacion.builder()
                .vacante(vacante)
                .usuario(usuario)
                .estado(dto.getEstado() != null ? dto.getEstado() : EstadoPostulacionTipo.PENDIENTE)
                .build();
        postulacion = postulacionRepository.save(postulacion);
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional
    public PostulacionResponse actualizarPostulacion(Long id, PostulacionUpdateDto dto) {
        Postulacion postulacion = postulacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada o eliminada"));
        if (dto.getEstado() != null) {
            postulacion.setEstado(dto.getEstado());
        }
        postulacion = postulacionRepository.save(postulacion);
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional
    public void softDeletePostulacion(Long id) {
        // Verificar existencia antes de marcar eliminado
        postulacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada o ya eliminada"));
        postulacionRepository.softDelete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PostulacionResponse obtenerPostulacion(Long id) {
        Postulacion postulacion = postulacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada o eliminada"));
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulacionResponse> listarTodas() {
        return postulacionRepository.findAllByEliminadoFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostulacionResponse> listarPorVacante(Long vacanteId) {
        return postulacionRepository.findAllByEliminadoFalse()
                .stream()
                .filter(p -> p.getVacante() != null && p.getVacante().getId().equals(vacanteId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PostulacionResponse mapToResponse(Postulacion p) {
        return PostulacionResponse.builder()
                .id(p.getId())
                .vacanteId(p.getVacante() != null ? p.getVacante().getId() : null)
                .usuarioId(p.getUsuario() != null ? p.getUsuario().getId() : null)
                .estado(p.getEstado())
                .fechaPostulacion(p.getFechaPostulacion())
                .build();
    }
}
