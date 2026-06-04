package co.edu.sistema_practicas_empresariales.modules.encuesta.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "encuesta_item_respuesta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncuestaItemRespuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "respuesta_id", nullable = false)
    private EncuestaRespuesta respuesta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private EncuestaPregunta pregunta;

    @Column(name = "valor_escala")
    private Integer valorEscala;

    @Column(name = "valor_texto", columnDefinition = "TEXT")
    private String valorTexto;

    @Column(name = "valor_booleano")
    private Boolean valorBooleano;
}