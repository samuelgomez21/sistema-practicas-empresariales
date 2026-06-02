package co.edu.sistema_practicas_empresariales.modules.encuesta.service;

import co.edu.sistema_practicas_empresariales.modules.encuesta.dto.EncuestaResponse;
import java.util.List;

public interface EncuestaService {
    EncuestaResponse guardarBorradorEncuesta(Long practicaId, String respuestasJson, String comentarios, String actorEmail, String tipoActor);
    EncuestaResponse completarEncuesta(Long practicaId, String respuestasJson, String comentarios, String actorEmail, String tipoActor);
    EncuestaResponse getEncuestaByPracticaAndActor(Long practicaId, String tipoActor);
    List<EncuestaResponse> getEncuestasByPractica(Long practicaId);
    void enviarInvitacionEncuesta(Long practicaId, String tipoActor);
    void enviarRecordatoriosPendientes();
}
