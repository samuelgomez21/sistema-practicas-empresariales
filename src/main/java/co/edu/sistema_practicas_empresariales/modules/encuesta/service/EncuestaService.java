package co.edu.sistema_practicas_empresariales.modules.encuesta.service;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.*;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.EnviarEncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearPlantillaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearPreguntaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.request.CrearSeccionRequest;

import java.util.List;

public interface EncuestaService {
    // Plantillas
    EncuestaPlantillaDto crearPlantilla(CrearPlantillaRequest req);
    List<EncuestaPlantillaDto> listarPlantillas();
    EncuestaPlantillaDto obtenerPlantillaPorId(Long id);
    EncuestaPlantillaDto obtenerPlantilla(TipoEncuesta tipo);
    void togglePlantilla(Long id);

    // Secciones
    SeccionDto crearSeccion(CrearSeccionRequest req);
    SeccionDto obtenerSeccion(Long seccionId);
    void eliminarSeccion(Long seccionId);

    // Preguntas
    PreguntaDto agregarPregunta(Long seccionId, CrearPreguntaRequest req);
    PreguntaDto editarPregunta(Long preguntaId, CrearPreguntaRequest req);
    void desactivarPregunta(Long preguntaId);

    // Respuestas
    EncuestaRespuestaDto enviarEncuesta(Long practicaId, TipoEncuesta tipo,
                                        EnviarEncuestaRequest req, String email);
    EncuestaRespuestaDto obtenerRespuesta(Long practicaId, TipoEncuesta tipo);
    boolean estaCompletada(Long practicaId, TipoEncuesta tipo);

    List<EncuestaRespuestaDto> listarTodasLasRespuestas();
    List<EncuestaRespuestaDto> listarRespuestasPorTipo(TipoEncuesta tipo);

}
