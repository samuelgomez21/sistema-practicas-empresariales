package co.edu.sistema_practicas_empresariales.modules.postulacion.service;

import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionRequestDto;
import co.edu.sistema_practicas_empresariales.modules.postulacion.dto.PostulacionResponseDto;

import java.util.List;

public interface PostulacionFacade {
    PostulacionResponseDto crearPostulacion(PostulacionRequestDto dto);
    PostulacionResponseDto actualizarEstado(Long id, String estado);
    PostulacionResponseDto obtenerPostulacion(Long id);
    List<PostulacionResponseDto> listarTodas();
    List<PostulacionResponseDto> listarPorVacante(Long vacanteId);
    List<PostulacionResponseDto> listarPorEstudiante(Long estudianteId);
    void eliminarPostulacion(Long id);
}
