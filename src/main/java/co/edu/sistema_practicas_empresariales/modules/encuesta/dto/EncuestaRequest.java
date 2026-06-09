package co.edu.sistema_practicas_empresariales.modules.encuesta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaRequest {
    private String respuestasJson;
    private String comentarios;
    private String estado; // e.g. "BORRADOR" or "COMPLETADA"
}
