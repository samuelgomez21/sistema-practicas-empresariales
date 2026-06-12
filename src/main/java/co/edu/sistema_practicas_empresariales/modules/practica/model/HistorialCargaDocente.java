package co.edu.sistema_practicas_empresariales.modules.practica.model;

import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_carga_docente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialCargaDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Usuario docente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practica_id", nullable = false)
    private Practica practica;

    @Column(name = "fecha_asignacion", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime fechaAsignacion = LocalDateTime.now();

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "ACTIVA"; // ACTIVA, FINALIZADA

    @PrePersist
    protected void onCreate() {
        if (fechaAsignacion == null) {
            fechaAsignacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "ACTIVA";
        }
    }
}
