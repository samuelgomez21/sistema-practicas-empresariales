package co.edu.sistema_practicas_empresariales.modules.usuario.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private Nombre nombre;

    public enum Nombre {
        ADMINISTRADOR,
        COORDINADOR_PRACTICA,
        SECRETARIA_COORDINACION,
        COORDINADOR_ACADEMICO,
        ESTUDIANTE,
        DOCENTE_ASESOR,
        TUTOR_EMPRESARIAL,
        EMPRESA_VINCULADA
    }
}
