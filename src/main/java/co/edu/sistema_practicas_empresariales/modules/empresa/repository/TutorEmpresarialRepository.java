package co.edu.sistema_practicas_empresariales.modules.empresa.repository;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorEmpresarialRepository extends JpaRepository<TutorEmpresarial, Long> {
    Optional<TutorEmpresarial> findByCorreo(String correo);
    List<TutorEmpresarial> findByEmpresaId(Long empresaId);
}
