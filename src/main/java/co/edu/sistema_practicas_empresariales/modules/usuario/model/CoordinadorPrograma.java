package co.edu.sistema_practicas_empresariales.modules.usuario.model;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coordinador_programas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoordinadorPrograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    private Programa programa;
}