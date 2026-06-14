// ── ReporteEstadoProcesoDto.java ──────────────────────────────────────────────
package co.edu.sistema_practicas_empresariales.modules.reporte.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReporteEstadoProcesoDto {
    private String programa;
    private String facultad;
    private Integer numeroPractica;
    private String periodo;

    // Contadores por estado
    private long sinEvaluar;
    private long aptos;
    private long noAptos;
    private long asignadaPendienteInicio;
    private long enProcesoVinculacion;
    private long vinculada;
    private long enPractica;
    private long completadas;
    private long reprobadas;
    private long canceladas;
    private long totalEstudiantes;
}