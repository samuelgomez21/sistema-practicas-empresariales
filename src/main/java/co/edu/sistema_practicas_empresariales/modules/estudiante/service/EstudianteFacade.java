package co.edu.sistema_practicas_empresariales.modules.estudiante.service;

import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteRequest;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.PracticaResponse;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface EstudianteFacade {

    EstudianteResponse registrarEstudiante(EstudianteRequest request);
    
    List<EstudianteResponse> registrarEstudiantesMasivo(MultipartFile file);

    EstudianteResponse obtenerPorId(Long id);

    EstudianteResponse obtenerPorUsuarioId(Long usuarioId);

    List<EstudianteResponse> listarTodos();

    List<EstudianteResponse> listarPorPrograma(Long programaId);

    List<EstudianteResponse> listarAptos();

    EstudianteResponse actualizarEstudiante(Long id, EstudianteRequest request);

    EstudianteResponse evaluarAptitud(Long estudianteId, int numeroPractica);

    List<PracticaResponse> obtenerHistorialPracticas(Long estudianteId);

    /**
     * Realiza el borrado lógico del estudiante.
     * @param id ID del estudiante.
     */
    void eliminarEstudiante(Long id);
}
