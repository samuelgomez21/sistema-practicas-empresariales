package co.edu.sistema_practicas_empresariales.modules.bitacora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa un registro de auditoría en la bitácora del sistema.
 */
@Entity
@Table(name = "bitacora")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bitacora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(nullable = false, length = 150)
    private String usuarioEmail;

    @Column(nullable = false, length = 50)
    private String accion;

    @Column(nullable = false, length = 50)
    private String modulo;

    @Column(columnDefinition = "TEXT")
    private String detalles;

    @Column(length = 45)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
