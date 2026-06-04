package co.edu.sistema_practicas_empresariales.modules.estudiante.model;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "estudiantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo_identificacion", nullable = false, length = 20)
    private String tipoIdentificacion;

    @Column(nullable = false, unique = true, length = 50)
    private String identificacion;

    @Column(length = 20)
    private String telefono;

    @Column(name = "contacto_emergencia", length = 100)
    private String contactoEmergencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    private Programa programa;

    @Column(nullable = false)
    private int semestre;

    @Column(name = "creditos_aprobados", nullable = false)
    private int creditosAprobados;

    @Column(name = "promedio_acumulado", nullable = false, precision = 3, scale = 2)
    private BigDecimal promedioAcumulado;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_aptitud", nullable = false, length = 50)
    private EstadoAptitud estadoAptitud = EstadoAptitud.SIN_EVALUAR;

    @Builder.Default
    @Column(name = "estado_practica", nullable = false, length = 50)
    private String estadoPractica = "SIN_INICIAR";

    @Column(name = "documento_hoja_vida_url", length = 255)
    private String documentoHojaVidaUrl;

    @Column(name = "documento_paz_salvo_url", length = 255)
    private String documentoPazSalvoUrl;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @Builder.Default
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

    public enum EstadoAptitud {
        SIN_EVALUAR,
        APTO,
        NO_APTO
    }
}
