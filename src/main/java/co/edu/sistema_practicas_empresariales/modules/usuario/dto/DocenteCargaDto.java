package co.edu.sistema_practicas_empresariales.modules.usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocenteCargaDto {
    private Long id;
    private String nombre;
    private String correo;
    private int maxEstudiantes;
    private List<EstudianteAsignadoDto> estudiantesActivos;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstudianteAsignadoDto {
        private Long id;
        private String nombre;
        private String programa;
        private int semestre;
    }
}