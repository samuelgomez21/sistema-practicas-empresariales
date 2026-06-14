package co.edu.sistema_practicas_empresariales.modules.contrato.repository;

import co.edu.sistema_practicas_empresariales.modules.contrato.model.Contrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    List<Contrato> findByActivoTrueOrderByFechaGeneracionDesc();
    List<Contrato> findByEmpresaIdAndActivoTrue(Long empresaId);
    boolean existsByPracticaIdAndActivoTrue(Long practicaId);
}