package co.edu.sistema_practicas_empresariales.modules.configuracion.model;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "catalogo_practicas", uniqueConstraints = {
    @UniqueConstraint(name = "uq_catalogo_practica_num_programa", columnNames = {"numero_practica", "programa_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogoPractica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_practica", nullable = false)
    private int numeroPractica;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "materia_nucleo", nullable = false, length = 100)
    private String materiaNucleo;

    @Column(name = "materia_nucleo_codigo", nullable = false, length = 20)
    private String materiaNucleoCodigo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    private Programa programa;

    @Builder.Default
    @Column(name = "cortes_por_practica", nullable = false)
    private int cortesPorPractica = 3;

    @Builder.Default
    @Column(name = "duracion_semanas", nullable = false)
    private int duracionSemanas = 16;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @Builder.Default
    @Column(name = "documentos_requeridos", nullable = false)
    private String documentosRequeridos = "HOJA_DE_VIDA,PAZ_Y_SALVO";

    @Builder.Default
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
