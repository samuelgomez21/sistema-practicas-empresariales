package co.edu.sistema_practicas_empresariales.modules.empresa.repository;

import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    Optional<Empresa> findByNit(String nit);
    Optional<Empresa> findByUsuarioId(Long usuarioId);
}
