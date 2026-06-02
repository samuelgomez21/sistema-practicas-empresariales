package co.edu.sistema_practicas_empresariales.modules.practica.repository;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Avance;
import co.edu.sistema_practicas_empresariales.modules.practica.enums.EstadoAvance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvanceRepository extends JpaRepository<Avance, Long> {

    List<Avance> findByPracticaIdOrderByCreatedAtDesc(Long practicaId);


    @Query("""
        SELECT a FROM Avance a
        WHERE a.practica.docenteAsesor.id = :docenteId
        AND a.estado = :estado
        ORDER BY a.createdAt DESC
    """)
    List<Avance> findByDocenteIdAndEstado(
            @Param("docenteId") Long docenteId,
            @Param("estado") EstadoAvance estado
    );

    List<Avance> findByPracticaIdAndEstado(Long practicaId, EstadoAvance estado);

}
