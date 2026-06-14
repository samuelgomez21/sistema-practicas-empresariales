package co.edu.sistema_practicas_empresariales.modules.estudiante.service;

import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteClasificacionDto;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteRequest;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.PracticaResponse;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDetalleDto;
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

    void activarEstudiante(Long id);
    List<EstudianteClasificacionDto> listarParaClasificacion();
    EstudianteResponse actualizarAptitudManual(Long estudianteId, String estadoAptitud);

    List<EstudianteResponse> listarPorCoordinadorPractica(String email);
    EstudianteResponse actualizarHojaVida(Long id, String url);
    PracticaDetalleDto obtenerMiPracticaActiva(String email);
    EstudianteResponse obtenerPorEmail(String email);

}
