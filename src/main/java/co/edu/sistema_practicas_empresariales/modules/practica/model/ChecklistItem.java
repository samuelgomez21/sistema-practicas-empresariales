package co.edu.sistema_practicas_empresariales.modules.practica.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Ítem del checklist de paz y salvo.
 * Patrón Chain of Responsibility: cada ítem es un eslabón
 * que debe completarse para otorgar el paz y salvo.
 */
@Entity
@Table(name = "checklist_paz_salvo",
        uniqueConstraints = @UniqueConstraint(columnNames = {"practica_id", "clave"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practica_id", nullable = false)
    private Practica practica;

    @Column(nullable = false, length = 50)
    private String clave;

    @Column(nullable = false, length = 200)
    private String label;

    @Column(nullable = false)
    @Builder.Default
    private Boolean completado = false;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}