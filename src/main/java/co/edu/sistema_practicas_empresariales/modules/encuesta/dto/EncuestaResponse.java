package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaResponse {
    private Long id;
    private Long practicaId;
    private String tipoActor;
    private String estado;
    private String respuestasJson;
    private String comentarios;
    private LocalDateTime fechaCompletada;
    private boolean activo;
}
