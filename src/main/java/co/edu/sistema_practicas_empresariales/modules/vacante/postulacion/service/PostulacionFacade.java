package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.service;

import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.dto.PostulacionResponse;
import java.util.List;

/**
 * Fachada (service) para la gestión de postulaciones.
 * Provee operaciones CRUD y soft‑delete, aplicando SOLID y los patrones de diseño
 * especificados en el documento de patrones.
 */
public interface PostulacionFacade {

    /**
     * Crea una nueva postulación.
     */
    PostulacionResponse crearPostulacion(PostulacionCreateDto dto);

    /**
     * Actualiza la información de una postulación existente.
     */
    PostulacionResponse actualizarPostulacion(Long id, PostulacionUpdateDto dto);

    /**
     * Elimina lógicamente (soft‑delete) una postulación.
     */
    void softDeletePostulacion(Long id);

    /**
     * Obtiene una postulación por su identificador.
     */
    PostulacionResponse obtenerPostulacion(Long id);

    /**
     * Lista todas las postulaciones que no están eliminadas.
     */
    List<PostulacionResponse> listarTodas();

    /**
     * Lista las postulaciones de una vacante específica.
     */
    List<PostulacionResponse> listarPorVacante(Long vacanteId);
}
