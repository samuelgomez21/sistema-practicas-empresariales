package co.edu.sistema_practicas_empresariales.modules.visita.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.practica.exception.BusinessException;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.modules.visita.dto.VisitaDto;
import co.edu.sistema_practicas_empresariales.modules.visita.model.Visita;
import co.edu.sistema_practicas_empresariales.modules.visita.repository.VisitaRepository;
import co.edu.sistema_practicas_empresariales.modules.visita.request.RegistrarVisitaRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Fachada (Facade) que orquesta múltiples servicios para cumplir casos de uso complejos de Visita.
 * Actúa como intermediario entre los controladores y los servicios subyacentes, ocultando la complejidad del sistema.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VisitaFacadeImpl implements VisitaFacade {

    private final VisitaRepository   visitaRepository;
    private final EmpresaRepository  empresaRepository;
    private final UsuarioRepository  usuarioRepository;

    @Override
    @Transactional
    public VisitaDto registrar(RegistrarVisitaRequest req, String emailUsuario) {
        var empresa = empresaRepository.findById(req.getEmpresaId())
                .orElseThrow(() -> new BusinessException("Empresa no encontrada"));

        var usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        // Determinar tipo de visitante por rol
        Visita.TipoVisitante tipo = usuario.getRol().getNombre().name().contains("DOCENTE")
                ? Visita.TipoVisitante.DOCENTE_ASESOR
                : Visita.TipoVisitante.COORDINADOR;

        Visita visita = Visita.builder()
                .empresa(empresa)
                .registradoPor(usuario)
                .fecha(req.getFecha())
                .horaInicio(req.getHoraInicio())
                .horaFin(req.getHoraFin())
                .motivo(req.getMotivo())
                .observaciones(req.getObservaciones())
                .tipoVisitante(tipo)
                .build();

        return toDto(visitaRepository.save(visita));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitaDto> listarTodas() {
        return visitaRepository.findByActivoTrueOrderByFechaDesc()
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitaDto> listarMias(String emailUsuario) {
        var usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        return visitaRepository.findByRegistradoPorId(usuario.getId())
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitaDto> listarPorEmpresa(Long empresaId) {
        return visitaRepository.findByEmpresaId(empresaId)
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public void eliminar(Long id, String emailUsuario) {
        Visita visita = visitaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Visita no encontrada"));

        var usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        // Solo puede eliminar quien la creó, o un administrador/coordinador
        boolean esDuenio = visita.getRegistradoPor().getId().equals(usuario.getId());
        boolean esAdmin  = usuario.getRol().getNombre().name().contains("ADMINISTRADOR")
                || usuario.getRol().getNombre().name().contains("COORDINADOR");

        if (!esDuenio && !esAdmin) {
            throw new BusinessException("No tienes permiso para eliminar esta visita");
        }

        visita.setActivo(false);
        visitaRepository.save(visita);
        log.info("Visita {} eliminada por {}", id, emailUsuario);
    }

    private VisitaDto toDto(Visita v) {
        return VisitaDto.builder()
                .id(v.getId())
                .empresaId(v.getEmpresa().getId())
                .empresaNombre(v.getEmpresa().getRazonSocial())
                .registradoPorId(v.getRegistradoPor().getId())
                .registradoPorNombre(v.getRegistradoPor().getNombre())
                .tipoVisitante(v.getTipoVisitante().name())
                .fecha(v.getFecha())
                .horaInicio(v.getHoraInicio())
                .horaFin(v.getHoraFin())
                .motivo(v.getMotivo())
                .observaciones(v.getObservaciones())
                .createdAt(v.getCreatedAt())
                .build();
    }
}