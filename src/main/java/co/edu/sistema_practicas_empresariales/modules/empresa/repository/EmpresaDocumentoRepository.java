package co.edu.sistema_practicas_empresariales.modules.empresa.repository;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.EmpresaDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaDocumentoRepository extends JpaRepository<EmpresaDocumento, Long> {
    List<EmpresaDocumento> findByEmpresaIdAndActivoTrue(Long empresaId);
    Optional<EmpresaDocumento> findByEmpresaIdAndTipoAndActivoTrue(Long empresaId, String tipo);
}