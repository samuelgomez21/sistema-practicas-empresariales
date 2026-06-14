// ── ReporteNotasDto.java ──────────────────────────────────────────────────────
package co.edu.sistema_practicas_empresariales.modules.reporte.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReporteNotasDto {
    private Long   practicaId;
    private String estudianteNombre;
    private String estudianteIdentificacion;
    private String programa;
    private Integer numeroPractica;
    private String empresaNombre;
    private String docenteNombre;
    private BigDecimal notaDocente;
    private BigDecimal notaTutor;
    private BigDecimal notaFinal;
    private String resultado;  // APROBADO | REPROBADO | PENDIENTE
}

// ── ReporteEmpresaVacanteDto.java ─────────────────────────────────────────────
// (en mismo paquete — colócalo en archivo separado en el proyecto)
// package co.edu.sistema_practicas_empresariales.modules.reporte.dto;

// @Data @Builder @NoArgsConstructor @AllArgsConstructor
// public class ReporteEmpresaVacanteDto { ... }
// (incluido abajo como referencia)

// ── ReporteEncuestasDto.java ──────────────────────────────────────────────────
// package co.edu.sistema_practicas_empresariales.modules.reporte.dto;
// (incluido abajo)