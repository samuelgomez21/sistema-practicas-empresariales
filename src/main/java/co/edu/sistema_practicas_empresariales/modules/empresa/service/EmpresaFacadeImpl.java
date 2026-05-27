package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.*;
import co.edu.sistema_practicas_empresariales.modules.empresa.event.VacanteAprobadaEvent;
import co.edu.sistema_practicas_empresariales.modules.empresa.event.VacanteCreadaEvent;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Vacante;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.VacanteRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.state.EstadoVacante;
import co.edu.sistema_practicas_empresariales.modules.empresa.state.EstadoVacanteFactory;
import co.edu.sistema_practicas_empresariales.modules.empresa.state.EstadoVacanteTipo;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaFacadeImpl implements EmpresaFacade {

    private final EmpresaRepository empresaRepository;
    private final TutorEmpresarialRepository tutorRepository;
    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoVacanteFactory estadoVacanteFactory;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public EmpresaResponse registrarEmpresa(EmpresaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Empresa empresa = Empresa.builder()
                .usuario(usuario)
                .nit(request.getNit())
                .razonSocial(request.getRazonSocial())
                .sectorEconomico(request.getSectorEconomico())
                .direccion(request.getDireccion())
                .municipio(request.getMunicipio())
                .telefono(request.getTelefono())
                .contactoPrincipalNombre(request.getContactoPrincipalNombre())
                .contactoPrincipalEmail(request.getContactoPrincipalEmail())
                .build();

        empresa = empresaRepository.save(empresa);
        return mapToEmpresaResponse(empresa);
    }

    @Override
    @Transactional
    public TutorEmpresarialResponse registrarTutor(TutorEmpresarialRequest request) {
        Empresa empresa = empresaRepository.findById(request.getEmpresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        TutorEmpresarial tutor = TutorEmpresarial.builder()
                .empresa(empresa)
                .nombreCompleto(request.getNombre())
                .correo(request.getCorreo())
                .telefono(request.getTelefono())
                .cargo(request.getCargo())
                .build();

        tutor = tutorRepository.save(tutor);
        return mapToTutorResponse(tutor);
    }

    @Override
    @Transactional
    public VacanteResponse crearVacante(VacanteRequest request) {
        Empresa empresa = empresaRepository.findById(request.getEmpresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        Vacante vacante = Vacante.builder()
                .empresa(empresa)
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .perfilRequerido(request.getPerfilRequerido())
                .requisitos(request.getRequisitos())
                .cuposTotales(request.getCuposTotales())
                .cuposDisponibles(request.getCuposTotales())
                .build();

        vacante = vacanteRepository.save(vacante);
        
        eventPublisher.publishEvent(new VacanteCreadaEvent(vacante.getId(), empresa.getId(), vacante.getTitulo()));
        
        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional
    public VacanteResponse aprobarVacante(Long vacanteId) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada"));

        EstadoVacante estado = estadoVacanteFactory.getEstado(vacante.getEstado());
        estado.aprobar(vacante);
        
        vacante = vacanteRepository.save(vacante);
        
        eventPublisher.publishEvent(new VacanteAprobadaEvent(vacante.getId(), vacante.getEmpresa().getId()));
        
        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional
    public VacanteResponse rechazarVacante(Long vacanteId, String motivo) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada"));

        EstadoVacante estado = estadoVacanteFactory.getEstado(vacante.getEstado());
        estado.rechazar(vacante, motivo);
        
        vacante = vacanteRepository.save(vacante);
        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional
    public VacanteResponse cerrarVacante(Long vacanteId) {
        Vacante vacante = vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new IllegalArgumentException("Vacante no encontrada"));

        EstadoVacante estado = estadoVacanteFactory.getEstado(vacante.getEstado());
        estado.cerrar(vacante);
        
        vacante = vacanteRepository.save(vacante);
        return mapToVacanteResponse(vacante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacanteResponse> listarVacantesPorEmpresa(Long empresaId) {
        return vacanteRepository.findByEmpresaId(empresaId).stream()
                .map(this::mapToVacanteResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacanteResponse> listarVacantesPendientes() {
        return vacanteRepository.findByEstado(EstadoVacanteTipo.PENDIENTE).stream()
                .map(this::mapToVacanteResponse)
                .collect(Collectors.toList());
    }

    private EmpresaResponse mapToEmpresaResponse(Empresa empresa) {
        return EmpresaResponse.builder()
                .id(empresa.getId())
                .nit(empresa.getNit())
                .razonSocial(empresa.getRazonSocial())
                .sectorEconomico(empresa.getSectorEconomico())
                .direccion(empresa.getDireccion())
                .municipio(empresa.getMunicipio())
                .telefono(empresa.getTelefono())
                .contactoPrincipalNombre(empresa.getContactoPrincipalNombre())
                .contactoPrincipalEmail(empresa.getContactoPrincipalEmail())
                .activo(empresa.isActivo())
                .fechaCreacion(empresa.getFechaCreacion())
                .build();
    }

    private TutorEmpresarialResponse mapToTutorResponse(TutorEmpresarial tutor) {
        return TutorEmpresarialResponse.builder()
                .id(tutor.getId())
                .nombre(tutor.getNombreCompleto())
                .correo(tutor.getCorreo())
                .telefono(tutor.getTelefono())
                .cargo(tutor.getCargo())
                .empresaId(tutor.getEmpresa().getId())
                .fechaRegistro(tutor.getFechaCreacion())
                .build();
    }

    private VacanteResponse mapToVacanteResponse(Vacante vacante) {
        return VacanteResponse.builder()
                .id(vacante.getId())
                .empresaId(vacante.getEmpresa().getId())
                .nombreEmpresa(vacante.getEmpresa().getRazonSocial())
                .titulo(vacante.getTitulo())
                .descripcion(vacante.getDescripcion())
                .perfilRequerido(vacante.getPerfilRequerido())
                .requisitos(vacante.getRequisitos())
                .cuposTotales(vacante.getCuposTotales())
                .cuposDisponibles(vacante.getCuposDisponibles())
                .estado(vacante.getEstado())
                .motivoRechazo(vacante.getMotivoRechazo())
                .fechaCreacion(vacante.getFechaCreacion())
                .build();
    }
}
