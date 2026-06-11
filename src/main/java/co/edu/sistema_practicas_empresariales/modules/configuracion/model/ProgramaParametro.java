package co.edu.sistema_practicas_empresariales.modules.configuracion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "programa_parametros")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramaParametro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false, unique = true)
    private Programa programa;

    @Builder.Default
    @Column(name = "num_practicas", nullable = false)
    private int numPracticas = 4;

    @Builder.Default
    @Column(name = "cortes_por_practica", nullable = false)
    private int cortesPorPractica = 3;

    @Builder.Default
    @Column(name = "nota_minima_aprobacion", nullable = false, precision = 3, scale = 2)
    private BigDecimal notaMinimaAprobacion = BigDecimal.valueOf(3.00);

    @Builder.Default
    @Column(name = "max_asignaciones_simultaneas", nullable = false)
    private int maxAsignacionesSimultaneas = 1;

    @Builder.Default
    @Column(name = "umbral_inactividad_dias", nullable = false)
    private int umbralInactividadDias = 5;

    @Builder.Default
    @Column(name = "documentos_requeridos", nullable = false, length = 500)
    private String documentosRequeridos = "ARL,PLANEADOR,INFORME_EJECUTIVO,PRESENTACION,DOCUMENTO_FINAL";
}
