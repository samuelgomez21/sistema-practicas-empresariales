package co.edu.sistema_practicas_empresariales.modules.vacante.postulacion.model;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.vacante.model.Vacante;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidad que representa la postulación de un estudiante a una vacante.
 * Incluye soporte de soft‑delete mediante el campo {@code eliminado}.
 */
@Entity
@Table(name = "postulaciones")
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
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_postulacion", nullable = false, updatable = false)
    private LocalDateTime fechaPostulacion = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPostulacionTipo estado;

    @Builder.Default
    @Column(nullable = false)
    private boolean eliminado = false;

    @PrePersist
    protected void onCreate() {
        if (fechaPostulacion == null) {
            fechaPostulacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoPostulacionTipo.PENDIENTE;
        }
    }

    public enum EstadoPostulacionTipo {
        PENDIENTE,
        ACEPTADA,
        RECHAZADA,
        CANCELADA
    }
}
