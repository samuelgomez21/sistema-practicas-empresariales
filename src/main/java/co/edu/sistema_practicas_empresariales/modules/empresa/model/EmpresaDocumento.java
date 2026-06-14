package co.edu.sistema_practicas_empresariales.modules.empresa.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresa_documentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = false, length = 50)
    private String tipo; // CAMARA_COMERCIO, NIT, CEDULA_RL, CONVENIO

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "nombre_archivo", length = 200)
    private String nombreArchivo;

    @Column(name = "fecha_vigencia")
    private LocalDate fechaVigencia;

    @Builder.Default
    @Column(name = "fecha_carga", nullable = false, updatable = false)
    private LocalDateTime fechaCarga = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}