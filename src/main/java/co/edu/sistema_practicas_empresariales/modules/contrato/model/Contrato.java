package co.edu.sistema_practicas_empresariales.modules.contrato.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contratos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "practica_id", nullable = false)
    private Long practicaId;

    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;

    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @Column(name = "estudiante_nombre", nullable = false, length = 150)
    private String estudianteNombre;

    @Column(name = "empresa_nombre", nullable = false, length = 150)
    private String empresaNombre;

    @Column(name = "tipo_contrato", length = 100)
    private String tipoContrato;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "valor_mensual", precision = 12, scale = 2)
    private BigDecimal valorMensual;

    @Column(name = "pdf_url", length = 500)
    private String pdfUrl;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String estado = "GENERADO";

    @Builder.Default
    @Column(name = "fecha_generacion", nullable = false, updatable = false)
    private LocalDateTime fechaGeneracion = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}