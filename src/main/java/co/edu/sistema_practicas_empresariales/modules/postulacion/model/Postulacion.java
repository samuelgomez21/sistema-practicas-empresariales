package co.edu.sistema_practicas_empresariales.modules.postulacion.model;

import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "postulaciones", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"vacante_id", "estudiante_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private EstadoPostulacionTipo estado = EstadoPostulacionTipo.POSTULADO;

    @Column(name = "fecha_postulacion", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaPostulacion = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private boolean eliminado = false;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @PrePersist
    protected void onCreate() {
        if (fechaPostulacion == null) {
            fechaPostulacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoPostulacionTipo.POSTULADO;
        }
    }
}