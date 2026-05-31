package co.edu.sistema_practicas_empresariales.modules.practica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


/**
 * Documento asociado a una práctica.
 * Almacena la URL de Firebase Storage y metadatos del archivo.
 * Patrón Adapter: la URL apunta al archivo en Firebase Storage,
 * el dominio no conoce los detalles de Firebase.
 */
@Entity
@Table(name = "practica_documentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticaDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practica_id", nullable = false)
    private Practica practica;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String url;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Builder.Default
    @Column(name = "fecha_carga", nullable = false, updatable = false)
    private LocalDateTime fechaCarga = LocalDateTime.now();

    @Column(name = "cargado_por_email", nullable = false, length = 100)
    private String cargadoPorEmail;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String estado = "PENDIENTE";

    @PrePersist
    protected void onCreate() {
        if (fechaCarga == null) {
            fechaCarga = LocalDateTime.now();
        }
    }
}
