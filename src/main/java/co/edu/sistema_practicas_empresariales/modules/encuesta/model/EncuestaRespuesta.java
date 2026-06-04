package co.edu.sistema_practicas_empresariales.modules.encuesta.model;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Respuesta diligenciada de una encuesta.
 * Una vez guardada es inmutable — no se puede modificar.
 * Constraint unique garantiza una sola respuesta por práctica por tipo.
 */
@Entity
@Table(name = "encuesta_respuesta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaRespuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "practica_id", nullable = false)
    private Long practicaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plantilla_id", nullable = false)
    private EncuestaPlantilla plantilla;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEncuesta tipo;

    @Column(name = "respondido_por", nullable = false, length = 100)
    private String respondidoPor;

    @Column(name = "fecha_envio", nullable = false, updatable = false)
    private LocalDateTime fechaEnvio;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "nombre_proyecto", length = 200)
    private String nombreProyecto;

    @Column(name = "postular_proyecto")
    @Builder.Default
    private Boolean postularProyecto = false;

    @OneToMany(mappedBy = "respuesta",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @Builder.Default
    private List<EncuestaItemRespuesta> items = new ArrayList<>();

    @PrePersist
    void prePersist() {
        this.fechaEnvio = LocalDateTime.now();
    }
}