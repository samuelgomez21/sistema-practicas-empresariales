package co.edu.sistema_practicas_empresariales.modules.encuesta.model;

import co.edu.sistema_practicas_empresariales.modules.encuesta.enums.TipoPregunta;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "encuesta_pregunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaPregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    private EncuestaSeccion seccion;

    @Column(nullable = false)
    private Integer orden;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoPregunta tipo = TipoPregunta.ESCALA;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activa = true;
}