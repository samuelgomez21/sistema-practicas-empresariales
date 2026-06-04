package co.edu.sistema_practicas_empresariales.modules.vinculacion.service;

import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionCreateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.vinculacion.dto.VinculacionResponse;
import java.util.List;

/**
 * Facade (service) para la gestión de Vinculaciones.
 * Incluye operaciones CRUD y soft‑delete.
 */
public interface VinculacionFacade {

    VinculacionResponse crearVinculacion(VinculacionCreateDto dto);

    VinculacionResponse actualizarVinculacion(Long id, VinculacionUpdateDto dto);

    void softDeleteVinculacion(Long id);

    VinculacionResponse obtenerVinculacion(Long id);

    List<VinculacionResponse> listarTodas();

    List<VinculacionResponse> listarPorVacante(Long vacanteId);
}
