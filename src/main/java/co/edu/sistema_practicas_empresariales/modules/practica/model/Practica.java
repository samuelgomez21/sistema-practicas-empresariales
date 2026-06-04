package co.edu.sistema_practicas_empresariales.modules.practica.model;


import co.edu.sistema_practicas_empresariales.modules.estudiante.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.practica.state.*;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "instancias_practica")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Practica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @Column(name = "numero_practica", nullable = false)
    private int numeroPractica;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "materia_nucleo", nullable = false, length = 100)
    private String materiaNucleo;

    @Column(name = "materia_nucleo_codigo", nullable = false, length = 20)
    private String materiaNucleoCodigo;

    @Column(name = "duracion_semanas", nullable = false)
    private int duracionSemanas;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EstadoPracticaTipo estado = EstadoPracticaTipo.ASIGNADA_PENDIENTE_INICIO;

    @Column(name = "empresa_id")
    private Long empresaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_asesor_id")
    private Usuario docenteAsesor;

    @Column(name = "tutor_empresarial_id")
    private Long tutorEmpresarialId;

    @Column(name = "nota_final", precision = 3, scale = 2)
    private BigDecimal notaFinal;

    @Column(length = 20)
    private String resultado;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name="fecha_sustentacion")
    private LocalDate fechaSustentacion;

    @Builder.Default
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "catalogo_practica_id")
    private CatalogoPractica catalogoPractica;


    @Transient
    private EstadoPractica estadoComportamiento;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }

    public EstadoPractica getEstadoComportamiento() {
        if (estadoComportamiento == null) {
            estadoComportamiento = instanciarEstado(this.estado);
        }
        return estadoComportamiento;
    }

    public void setEstado(EstadoPracticaTipo nuevoEstado) {
        this.estado = nuevoEstado;
        this.estadoComportamiento = instanciarEstado(nuevoEstado);
    }

    // Delegación de comportamiento de estado
    public void iniciarVinculacion() {
        this.getEstadoComportamiento().iniciarVinculacion(this);
    }

    public void registrarConvenio() {
        this.getEstadoComportamiento().registrarConvenio(this);
    }

    public void activarPractica() {
        this.getEstadoComportamiento().activarPractica(this);
    }

    public void registrarNotaFinal(BigDecimal nota, BigDecimal notaMinima) {
        this.getEstadoComportamiento().registrarNotaFinal(this, nota, notaMinima);
    }

    public void cancelar(String motivo) {
        this.getEstadoComportamiento().cancelar(this, motivo);
    }

    private EstadoPractica instanciarEstado(EstadoPracticaTipo tipo) {
        return switch (tipo) {
            case ASIGNADA_PENDIENTE_INICIO -> new EstadoAsignada();
            case EN_PROCESO_VINCULACION    -> new EstadoEnProcesoVinculacion();
            case VINCULADA                 -> new EstadoVinculada();
            case EN_PRACTICA               -> new EstadoEnPractica();
            case COMPLETADA                -> new EstadoCompletada();
            case REPROBADA                 -> new EstadoReprobada();
            case CANCELADA                 -> new EstadoCancelada();
        };
    }
}
