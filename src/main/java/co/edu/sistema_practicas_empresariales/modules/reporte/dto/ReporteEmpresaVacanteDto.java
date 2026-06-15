package co.edu.sistema_practicas_empresariales.modules.reporte.dto;

import lombok.*;

// ── Empresas y Vacantes ───────────────────────────────────────────────────────

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReporteEmpresaVacanteDto {
    private Long   empresaId;
    private String razonSocial;
    private String nit;
    private String sector;
    private String municipio;

    // Vacantes
    private long vacantesPendientes;
    private long vacantesActivas;
    private long vacantesCerradas;
    private long totalVacantes;

    // Practicantes
    private long practicantesHistoricos;   // total iniciadas en esta empresa
    private long practicantesActivos;      // EN_PRACTICA actualmente
    private long practicantesCompletados;  // COMPLETADA
    private long practicantesReprobados;   // REPROBADA

    // KPI
    private double tasaFinalizacionExitosa; // practicantesCompletados / practicantesHistoricos * 100
}