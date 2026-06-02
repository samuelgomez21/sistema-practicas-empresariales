package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.*;
import co.edu.sistema_practicas_empresariales.modules.empresa.event.EmpresaRegistradaEvent;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmpresaFacadeImpl implements EmpresaFacade {

    private final EmpresaRepository empresaRepository;
    private final TutorEmpresarialRepository tutorRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public EmpresaResponse registrarEmpresa(EmpresaRequest request) {
        String passwordTemporal = UUID.randomUUID().toString().substring(0, 8);
        
        Usuario usuario = usuarioRepository.findByEmail(request.getContactoPrincipalEmail())
                .orElseGet(() -> {
                    Rol rolEmpresa = rolRepository.findByNombre(Rol.Nombre.EMPRESA_VINCULADA.name())
                            .orElseThrow(() -> new IllegalStateException("Rol EMPRESA_VINCULADA no encontrado"));
                    
                    Usuario nuevoUsuario = Usuario.builder()
                            .email(request.getContactoPrincipalEmail())
                            .nombre(request.getContactoPrincipalNombre())
                            .password(passwordEncoder.encode(passwordTemporal))
                            .rol(rolEmpresa)
                            .activo(true)
                            .build();
                    return usuarioRepository.save(nuevoUsuario);
                });

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
        
        eventPublisher.publishEvent(new EmpresaRegistradaEvent(this, empresa, passwordTemporal));
        
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


}
