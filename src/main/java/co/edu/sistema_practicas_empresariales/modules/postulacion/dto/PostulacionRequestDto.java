package co.edu.sistema_practicas_empresariales.modules.postulacion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostulacionRequestDto {
    private Long vacanteId;
    private Long estudianteId;
    private String observaciones;
}