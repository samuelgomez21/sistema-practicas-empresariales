package co.edu.sistema_practicas_empresariales.modules.vinculacion.model;

import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidad que representa la vinculación de una vacante con los detalles de la posición.
 * Incluye soporte para soft‑delete mediante el campo {@code eliminado}.
 */
@Entity
@Table(name = "vinculaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vinculacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @Column(nullable = false, length = 150)
    private String cargo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "requisitos_estudiante", columnDefinition = "TEXT")
    private String requisitosEstudiante;

    @Column(name = "numero_cupos", nullable = false)
    private int numeroCupos;

    @Column(name = "cupos_disponibles", nullable = false)
    private int cuposDisponibles;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String modalidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoVinculacionTipo estado;

    @Builder.Default
    @Column(nullable = false)
    private boolean eliminado = false;

    @Builder.Default
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

    public enum EstadoVinculacionTipo {
        PENDIENTE,
        APROBADA,
        RECHAZADA,
        CERRADA
    }
}
