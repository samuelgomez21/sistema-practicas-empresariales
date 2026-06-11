package co.edu.sistema_practicas_empresariales.modules.vacante.model;

import co.edu.sistema_practicas_empresariales.modules.vacante.state.EstadoVacanteTipo;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import java.time.LocalDateTime;
import java.math.BigDecimal;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id")
    private Programa programa;

    @Column(length = 50)
    private String modalidad;

    @Column(precision = 12, scale = 2)
    private BigDecimal salario;

    @Column(name = "tipo_contrato", length = 100)
    private String tipoContrato;

    @Column(length = 100)
    private String horario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoVacanteTipo estado = EstadoVacanteTipo.PENDIENTE;

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @Column(nullable = false)
    @Builder.Default
    private Boolean eliminado = false;

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
