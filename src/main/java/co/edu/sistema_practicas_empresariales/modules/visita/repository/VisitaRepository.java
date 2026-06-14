package co.edu.sistema_practicas_empresariales.modules.visita.repository;

import co.edu.sistema_practicas_empresariales.modules.visita.model.Visita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VisitaRepository extends JpaRepository<Visita, Long> {

    List<Visita> findByActivoTrueOrderByFechaDesc();

    @Query("SELECT v FROM Visita v WHERE v.activo = true " +
            "AND v.registradoPor.id = :userId ORDER BY v.fecha DESC")
    List<Visita> findByRegistradoPorId(@Param("userId") Long userId);

    @Query("SELECT v FROM Visita v WHERE v.activo = true " +
            "AND v.empresa.id = :empresaId ORDER BY v.fecha DESC")
    List<Visita> findByEmpresaId(@Param("empresaId") Long empresaId);
}