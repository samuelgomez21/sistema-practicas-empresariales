package co.edu.sistema_practicas_empresariales.modules.cierre.event;

import co.edu.sistema_practicas_empresariales.modules.encuesta.model.Encuesta;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecordatorioEncuestaEvent {
    private final Long practicaId;
    private final Encuesta.TipoActor tipoActor;
}
