package co.edu.sistema_practicas_empresariales.modules.encuesta.model;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoEncuesta;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Plantilla de encuesta configurable.
 * El coordinador puede agregar o modificar preguntas.
 * Patrón Builder: se construye con secciones y preguntas.
 */
@Entity
@Table(name = "encuesta_plantilla")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaPlantilla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEncuesta tipo;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activa = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "plantilla",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<EncuestaSeccion> secciones = new ArrayList<>();

    @PrePersist
    void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }
}