package co.edu.sistema_practicas_empresariales.modules.reporte.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReporteEncuestasDto {

    private int    totalRespuestas;
    private int    totalPracticas;
    private double tasaRespuesta;   // totalRespuestas / totalPracticas * 100

    private List<PromedioPreguntaDto>  promediosPorPregunta;
    private List<PromedioEmpresaDto>   promediosPorEmpresa;
    private List<PromedioPrograma>     promediosPorPrograma;

    // ── Sub-DTOs ─────────────────────────────────────────────────────────────

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PromedioPreguntaDto {
        private Long   preguntaId;
        private String textoPregunta;
        private double promedio;
        private int    totalRespuestas;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PromedioEmpresaDto {
        private Long   empresaId;
        private String empresaNombre;
        private double promedioGeneral;
        private int    totalRespuestas;
        // Solo se muestra si totalRespuestas >= 5 (confidencialidad)
        private boolean suficientesRespuestas;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PromedioPrograma {
        private Long   programaId;
        private String programaNombre;
        private double promedioGeneral;
        private int    totalRespuestas;
    }
}