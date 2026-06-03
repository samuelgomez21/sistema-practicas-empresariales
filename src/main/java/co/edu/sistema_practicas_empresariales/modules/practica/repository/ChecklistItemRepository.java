package co.edu.sistema_practicas_empresariales.modules.practica.repository;

import co.edu.sistema_practicas_empresariales.modules.practica.model.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {

    List<ChecklistItem> findByPracticaId(Long practicaId);

    Optional<ChecklistItem> findByPracticaIdAndClave(Long practicaId, String clave);

    boolean existsByPracticaIdAndCompletadoFalse(Long practicaId);
}
