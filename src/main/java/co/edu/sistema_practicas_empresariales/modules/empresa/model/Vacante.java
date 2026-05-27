package co.edu.sistema_practicas_empresariales.modules.empresa.model;

import co.edu.sistema_practicas_empresariales.modules.empresa.state.EstadoVacanteTipo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vacantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vacante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "perfil_requerido", nullable = false, columnDefinition = "TEXT")
    private String perfilRequerido;

    @Column(columnDefinition = "TEXT")
    private String requisitos;

    @Column(name = "cupos_totales", nullable = false)
    private int cuposTotales;

    @Column(name = "cupos_disponibles", nullable = false)
    private int cuposDisponibles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoVacanteTipo estado = EstadoVacanteTipo.PENDIENTE;

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @Builder.Default
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoVacanteTipo.PENDIENTE;
        }
    }
}
