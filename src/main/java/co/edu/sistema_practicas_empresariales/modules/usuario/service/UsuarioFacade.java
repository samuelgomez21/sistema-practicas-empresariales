package co.edu.sistema_practicas_empresariales.modules.usuario.service;

import co.edu.sistema_practicas_empresariales.modules.usuario.dto.DocenteCargaDto;
import co.edu.sistema_practicas_empresariales.modules.usuario.dto.UsuarioDto;
import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.ProgramaResumenDto;
import java.util.List;

public interface UsuarioFacade {
    List<UsuarioDto> obtenerTodos();

    UsuarioDto obtenerPorId(Long id);

    UsuarioDto crear(UsuarioDto usuarioDto);

    UsuarioDto actualizar(Long id, UsuarioDto usuarioDto);

    void eliminar(Long id);

    void activar(Long id);

    List<ProgramaResumenDto> obtenerProgramas(Long usuarioId);

    void asignarProgramas(Long usuarioId, List<Long> programaIds);

    List<DocenteCargaDto> listarDocentesConCarga();

    void actualizarMaxEstudiantes(Long docenteId, int max);

    UsuarioDto obtenerPorEmail(String email);
}
