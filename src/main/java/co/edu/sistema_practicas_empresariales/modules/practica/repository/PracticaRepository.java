package co.edu.sistema_practicas_empresariales.modules.practica.repository;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PracticaRepository extends JpaRepository<Practica, Long> {
    List<Practica> findByEstudianteIdOrderByNumeroPracticaAsc(Long estudianteId);

    Optional<Practica> findByEstudianteIdAndNumeroPractica(Long estudianteId, int numeroPractica);

    List<Practica> findByEstudianteId(Long estudianteId);

    List<Practica> findByDocenteAsesorId(Long docenteId);

    List<Practica> findByEmpresaId(Long empresaId);

    List<Practica> findByEstado(EstadoPracticaTipo estado);

    @Query("""
                SELECT p FROM Practica p
                WHERE p.estudiante.id = :estudianteId
                AND p.estado NOT IN ('COMPLETADA', 'REPROBADA', 'CANCELADA')
                ORDER BY p.fechaCreacion DESC
            """)
    Optional<Practica> findPracticaActivaByEstudiante(@Param("estudianteId") Long estudianteId);

    @Query("""
                SELECT p FROM Practica p
                WHERE p.docenteAsesor.id = :docenteId
            """)
    List<Practica> findPracticasActivasByDocente(@Param("docenteId") Long docenteId);
/*
    @Query("""
                SELECT p FROM Practica p
                WHERE p.docenteAsesor.id = :docenteId
                AND p.estado = 'EN_PRACTICA'
            """)*/

    // Buscar si el estudiante tiene alguna práctica activa (en curso, asignada,
    // vinculación, etc.)
    boolean existsByEstudianteIdAndEstadoNotIn(Long estudianteId, List<EstadoPracticaTipo> estadosCerrados);

    long countActivasByCatalogoPracticaId (@Param("catalogoId") Long catalogoId);

    @Query("""
            SELECT p FROM Practica p
            WHERE p.docenteAsesor.id = :docenteId
            AND p.estado NOT IN ('COMPLETADA', 'REPROBADA', 'CANCELADA')
        """)
    List<Practica> findAsignadasActivasByDocente(@Param("docenteId") Long docenteId);

    List<Practica> findByEmpresaIdAndActivoTrue(Long empresaId);
}