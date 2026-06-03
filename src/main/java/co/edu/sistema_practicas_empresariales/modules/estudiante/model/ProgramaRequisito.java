package co.edu.sistema_practicas_empresariales.modules.estudiante.model;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "programa_requisitos", uniqueConstraints = {
    @UniqueConstraint(name = "uq_requisito_programa_num", columnNames = {"programa_id", "numero_practica"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramaRequisito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    private Programa programa;

    @Column(name = "numero_practica", nullable = false)
    private int numeroPractica;

    @Column(name = "creditos_minimos", nullable = false)
    private int creditosMinimos;

    @Column(name = "promedio_minimo", nullable = false, precision = 3, scale = 2)
    private BigDecimal promedioMinimo;

    @Builder.Default
    @Column(name = "requiere_practica_anterior", nullable = false)
    private boolean requierePracticaAnterior = true;

    @Builder.Default
    @Column(name = "documentos_requeridos", nullable = false)
    private String documentosRequeridos = "HOJA_DE_VIDA,PAZ_Y_SALVO";
}
