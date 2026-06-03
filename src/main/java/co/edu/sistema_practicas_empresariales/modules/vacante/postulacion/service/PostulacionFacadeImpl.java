package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.service;

import java.util.Objects;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionResponse;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model.Postulacion.EstadoPostulacionTipo;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.repository.PostulacionRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.util.Validations;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del facade para la gestión de postulaciones.
 *
 * <p>Se añaden validaciones de nulidad y se documentan los métodos para
 * cumplir con las reglas de Sonar (evitar NullPointerException y mejorar la
 * legibilidad).</p>
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
    /**
 * Crea una nueva postulación.
 * @param dto datos de la postulación
 * @return respuesta con la postulación creada
 * @throws IllegalArgumentException si la vacante o el usuario no existen
 */
public PostulacionResponse crearPostulacion(PostulacionCreateDto dto) {
        // Validar existencia de la vacante y del usuario (solo si no están eliminados)
        Objects.requireNonNull(dto, "PostulacionCreateDto no puede ser null");
        Vacante vacante = Validations.validarVacante(dto.getVacanteId(), vacanteRepository);
        Usuario usuario = Validations.validarUsuario(dto.getUsuarioId(), usuarioRepository);

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
    /**
 * Actualiza una postulación existente.
 * @param id identificador de la postulación
 * @param dto datos a actualizar
 * @return respuesta con la postulación actualizada
 * @throws IllegalArgumentException si la postulación no existe
 */
public PostulacionResponse actualizarPostulacion(Long id, PostulacionUpdateDto dto) {
        Objects.requireNonNull(dto, "PostulacionUpdateDto no puede ser null");
        Postulacion postulacion = postulacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada o eliminada"));
        if (dto.getEstado() != null) {
            postulacion.setEstado(dto.getEstado());
        }
        postulacion = postulacionRepository.save(postulacion);
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional(readOnly = true)
    /**
 * Elimina lógicamente una postulación.
 * @param id identificador de la postulación
 */
public void softDeletePostulacion(Long id) {
        // Verificar existencia antes de marcar eliminado
        postulacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada o ya eliminada"));
        postulacionRepository.softDelete(id);
    }

    @Override
    @Transactional(readOnly = true)
    /**
 * Obtiene una postulación por id.
 * @param id identificador de la postulación
 * @return respuesta con la postulación encontrada
 * @throws IllegalArgumentException si no se encuentra
 */
public PostulacionResponse obtenerPostulacion(Long id) {
        Postulacion postulacion = postulacionRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada o eliminada"));
        return mapToResponse(postulacion);
    }

    @Override
    @Transactional(readOnly = true)
    /**
 * Lista todas las postulaciones activas.
 * @return lista de respuestas de postulaciones
 */
public List<PostulacionResponse> listarTodas() {
        return postulacionRepository.findAllByEliminadoFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    /**
 * Lista postulaciones filtradas por vacante.
 * @param vacanteId identificador de la vacante
 * @return lista de respuestas de postulaciones
 */
public List<PostulacionResponse> listarPorVacante(Long vacanteId) {
        return postulacionRepository.findAllByEliminadoFalse()
                .stream()
                .filter(p -> esDeVacante(p, vacanteId))
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
    /**
     * Verifica si una postulación pertenece a la vacante indicada.
     * @param p postulación
     * @param vacanteId id de la vacante
     * @return true si pertenece, false otherwise
     */
    private boolean esDeVacante(Postulacion p, Long vacanteId) {
        return p.getVacante() != null && p.getVacante().getId().equals(vacanteId);
    }
}

