package co.edu.sistema_practicas_empresariales.modules.practica.repository;

import co.edu.sistema_practicas_empresariales.modules.practica.model.PracticaDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PracticaDocumentoRepository extends JpaRepository<PracticaDocumento, Long> {
    List<PracticaDocumento> findByPracticaId(Long practicaId);
}
