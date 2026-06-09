package co.edu.sistema_practicas_empresariales.modules.cierre.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistResponse {
    private boolean notaDocenteRegistrada;
    private boolean notaTutorRegistrada;
    private boolean notaFinalRegistrada;
    private String estadoEncuestaTutor;
    private String estadoEncuestaEstudiante;
    private java.time.LocalDateTime fechaUltimoRecordatorioTutor;
    private java.time.LocalDateTime fechaUltimoRecordatorioEstudiante;
    private boolean documentosAprobados;
    private boolean informeFinalAprobado;
    private boolean todoListo;
}
