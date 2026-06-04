package co.edu.sistema_practicas_empresariales.modules.encuesta.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "encuesta_seccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plantilla_id", nullable = false)
    private EncuestaPlantilla plantilla;

    @Column(nullable = false, length = 10)
    private String codigo;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false)
    private Integer orden;

    @OneToMany(mappedBy = "seccion",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<EncuestaPregunta> preguntas = new ArrayList<>();
}