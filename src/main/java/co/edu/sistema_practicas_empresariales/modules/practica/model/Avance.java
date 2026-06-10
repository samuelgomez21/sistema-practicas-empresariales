package co.edu.sistema_practicas_empresariales.modules.practica.model;

import co.edu.sistema_practicas_empresariales.modules.practica.enums.EstadoAvance;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Avance del estudiante dentro de un corte de seguimiento.
 * Un corte puede tener múltiples avances.
 * Patrón Observer: al crear un avance se puede notificar al docente asesor.
 */
@Entity
@Table(name = "avances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practica_id", nullable = false)
    private Practica practica;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "archivo_url", length = 500)
    private String archivoUrl;

    @Column(name = "archivo_fecha_carga")
    private LocalDateTime archivoFechaCarga;

    @Column(name = "comentario_docente", columnDefinition = "TEXT")
    private String comentarioDocente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoAvance estado = EstadoAvance.PENDIENTE;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        this.createdAt  = LocalDateTime.now();
        this.updatedAt  = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}