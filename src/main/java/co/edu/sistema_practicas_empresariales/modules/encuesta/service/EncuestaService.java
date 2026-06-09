package co.edu.sistema_practicas_empresariales.modules.encuesta.service;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EncuestaPlantillaDto;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EncuestaRespuestaDto;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EnviarEncuestaRequest;
import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.PreguntaDto;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;

public interface EncuestaService {
    EncuestaPlantillaDto obtenerPlantilla(TipoEncuesta tipo);
    EncuestaRespuestaDto obtenerRespuesta(Long practicaId, TipoEncuesta tipo);
    boolean estaCompletada(Long practicaId, TipoEncuesta tipo);
    EncuestaRespuestaDto enviarEncuesta(Long practicaId,
                                        TipoEncuesta tipo,
                                        EnviarEncuestaRequest req,
                                        String emailRespondiente);
    PreguntaDto agregarPregunta(Long seccionId,
                                String texto,
                                TipoPregunta tipoPregunta);

}
