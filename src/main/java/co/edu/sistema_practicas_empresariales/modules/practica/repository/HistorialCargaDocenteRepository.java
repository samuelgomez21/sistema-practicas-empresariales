package co.edu.sistema_practicas_empresariales.modules.practica.repository;

import co.edu.sistema_practicas_empresariales.modules.practica.model.HistorialCargaDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistorialCargaDocenteRepository extends JpaRepository<HistorialCargaDocente, Long> {
    List<HistorialCargaDocente> findByDocenteId(Long docenteId);
    List<HistorialCargaDocente> findByPracticaId(Long practicaId);
    Optional<HistorialCargaDocente> findByPracticaIdAndEstado(Long practicaId, String estado);
}
