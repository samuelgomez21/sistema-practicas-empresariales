package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.*;
import co.edu.sistema_practicas_empresariales.modules.empresa.event.EmpresaRegistradaEvent;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.EmpresaDocumento;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaDocumentoRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import co.edu.sistema_practicas_empresariales.shared.email.EmailService;
import co.edu.sistema_practicas_empresariales.shared.email.templates.EmailTemplates;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Fachada (Facade) que orquesta múltiples servicios para cumplir casos de uso complejos de Empresa.
 * Actúa como intermediario entre los controladores y los servicios subyacentes, ocultando la complejidad del sistema.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class EmpresaFacadeImpl implements EmpresaFacade {

    private final EmpresaRepository empresaRepository;
    private final TutorEmpresarialRepository tutorRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final EmailService emailService;
    private final EmpresaDocumentoRepository documentoRepository;


    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    @Transactional
    public EmpresaResponse registrarEmpresa(EmpresaRequest request) {
        String passwordTemporal = UUID.randomUUID().toString().substring(0, 8);

        boolean usuarioYaExistia = usuarioRepository.existsByEmail(request.getContactoPrincipalEmail());

        Usuario usuario = usuarioRepository.findByEmail(request.getContactoPrincipalEmail())
                .orElseGet(() -> {
                    Rol rolEmpresa = rolRepository.findByNombre(Rol.Nombre.EMPRESA_VINCULADA)
                            .orElseThrow(() -> new IllegalStateException("Rol EMPRESA_VINCULADA no encontrado"));

                    Usuario nuevoUsuario = Usuario.builder()
                            .email(request.getContactoPrincipalEmail())
                            .nombre(request.getContactoPrincipalNombre())
                            .password(passwordEncoder.encode(passwordTemporal))
                            .rol(rolEmpresa)
                            .activo(true)
                            .debeCambiarPassword(true)
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

        // Solo enviamos credenciales si el usuario se creó en este momento
        // (si ya existía, su contraseña no cambió).
        if (!usuarioYaExistia) {
            emailService.sendEmail(
                    usuario.getEmail(),
                    "Bienvenido al Sistema de Prácticas UAH — Credenciales de acceso",
                    EmailTemplates.credencialesAcceso(usuario.getNombre(), usuario.getEmail(), passwordTemporal, frontendUrl)
            );
        }

        eventPublisher.publishEvent(new EmpresaRegistradaEvent(this, empresa, passwordTemporal));

        return mapToEmpresaResponse(empresa);
    }

    @Override
    @Transactional
    public TutorEmpresarialResponse registrarTutor(TutorEmpresarialRequest request) {
        Empresa empresa = empresaRepository.findById(request.getEmpresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        String passwordTemporal = UUID.randomUUID().toString().substring(0, 8);

        boolean usuarioYaExistia = usuarioRepository.existsByEmail(request.getCorreo());

        Usuario usuarioTutor = usuarioRepository.findByEmail(request.getCorreo())
                .orElseGet(() -> {
                    Rol rolTutor = rolRepository.findByNombre(Rol.Nombre.TUTOR_EMPRESARIAL)
                            .orElseThrow(() -> new IllegalStateException("Rol TUTOR_EMPRESARIAL no encontrado"));

                    Usuario nuevoUsuario = Usuario.builder()
                            .email(request.getCorreo())
                            .nombre(request.getNombre())
                            .password(passwordEncoder.encode(passwordTemporal))
                            .rol(rolTutor)
                            .activo(true)
                            .debeCambiarPassword(true)
                            .build();
                    return usuarioRepository.save(nuevoUsuario);
                });

        TutorEmpresarial tutor = TutorEmpresarial.builder()
                .usuario(usuarioTutor)
                .empresa(empresa)
                .nombreCompleto(request.getNombre())
                .correo(request.getCorreo())
                .telefono(request.getTelefono())
                .cargo(request.getCargo())
                .build();

        tutor = tutorRepository.save(tutor);

        if (!usuarioYaExistia) {
            emailService.sendEmail(
                    usuarioTutor.getEmail(),
                    "Bienvenido al Sistema de Prácticas UAH — Credenciales de acceso",
                    EmailTemplates.credencialesAcceso(usuarioTutor.getNombre(), usuarioTutor.getEmail(), passwordTemporal, frontendUrl)
            );
        }

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

    @Override
    @Transactional(readOnly = true)
    public java.util.List<EmpresaResponse> listarTodas() {
        return empresaRepository.findAll().stream()
                .map(this::mapToEmpresaResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmpresaResponse obtenerPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));
        return mapToEmpresaResponse(empresa);
    }

    @Override
    @Transactional
    public EmpresaResponse actualizarEmpresa(Long id, EmpresaRequest request) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        if (request.getRazonSocial() != null) empresa.setRazonSocial(request.getRazonSocial());
        if (request.getSectorEconomico() != null) empresa.setSectorEconomico(request.getSectorEconomico());
        if (request.getDireccion() != null) empresa.setDireccion(request.getDireccion());
        if (request.getMunicipio() != null) empresa.setMunicipio(request.getMunicipio());
        if (request.getTelefono() != null) empresa.setTelefono(request.getTelefono());
        if (request.getContactoPrincipalNombre() != null) empresa.setContactoPrincipalNombre(request.getContactoPrincipalNombre());
        if (request.getContactoPrincipalEmail() != null) empresa.setContactoPrincipalEmail(request.getContactoPrincipalEmail());

        empresa = empresaRepository.save(empresa);
        return mapToEmpresaResponse(empresa);
    }

    @Override
    @Transactional
    public void eliminarEmpresa(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));
        empresa.setActivo(false); // Soft delete
        empresaRepository.save(empresa);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<TutorEmpresarialResponse> listarTutoresPorEmpresa(Long empresaId) {
        return tutorRepository.findByEmpresaIdAndActivoTrue(empresaId).stream()
                .map(this::mapToTutorResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarTutor(Long id) {
        TutorEmpresarial tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado"));
        tutor.setActivo(false); // Soft delete
        tutorRepository.save(tutor);
    }

    private TutorEmpresarialResponse mapToTutorResponse(TutorEmpresarial tutor) {
        return TutorEmpresarialResponse.builder()
                .id(tutor.getId())
                .nombre(tutor.getNombreCompleto())
                .correo(tutor.getCorreo())
                .telefono(tutor.getTelefono())
                .cargo(tutor.getCargo())
                .empresaId(tutor.getEmpresa().getId())
                .activo(tutor.isActivo())
                .fechaRegistro(tutor.getFechaCreacion())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EmpresaResponse obtenerPorUsuarioEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Empresa empresa = empresaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("No hay una empresa asociada a este usuario"));
        return mapToEmpresaResponse(empresa);
    }

    @Override
    @Transactional
    public TutorEmpresarialResponse actualizarTutor(Long id, TutorEmpresarialRequest request) {
        TutorEmpresarial tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado"));

        if (request.getNombre() != null)   tutor.setNombreCompleto(request.getNombre());
        if (request.getTelefono() != null) tutor.setTelefono(request.getTelefono());
        if (request.getCargo() != null)    tutor.setCargo(request.getCargo());

        tutor = tutorRepository.save(tutor);
        return mapToTutorResponse(tutor);
    }

    @Override
    @Transactional
    public void activarTutor(Long id) {
        TutorEmpresarial tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado"));
        tutor.setActivo(true);
        tutorRepository.save(tutor);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<TutorEmpresarialResponse> listarTodosLosTutores() {
        return tutorRepository.findAll().stream()
                .filter(TutorEmpresarial::isActivo)
                .map(this::mapToTutorResponse)
                .collect(java.util.stream.Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public List<EmpresaDocumentoResponse> listarDocumentos(Long empresaId) {
        return documentoRepository.findByEmpresaIdAndActivoTrue(empresaId).stream()
                .map(this::mapToDocResponse)
                .collect(java.util.stream.Collectors.toList());
    }
    @Override
    @Transactional(readOnly = true)
    public List<EmpresaDocumentoResponse> listarTodosLosDocumentos() {
        return documentoRepository.findAllByActivoTrueOrderByFechaCargaDesc().stream()
                .map(this::mapToDocResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public EmpresaDocumentoResponse guardarDocumento(Long empresaId, EmpresaDocumentoRequest request) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));

        // Si ya existe un documento de este tipo, lo desactiva (soft replace)
        documentoRepository.findByEmpresaIdAndTipoAndActivoTrue(empresaId, request.getTipo())
                .ifPresent(d -> {
                    d.setActivo(false);
                    documentoRepository.save(d);
                });

        EmpresaDocumento doc = EmpresaDocumento.builder()
                .empresa(empresa)
                .tipo(request.getTipo())
                .url(request.getUrl())
                .nombreArchivo(request.getNombreArchivo())
                .fechaVigencia(request.getFechaVigencia())
                .build();

        doc = documentoRepository.save(doc);
        return mapToDocResponse(doc);
    }

    private EmpresaDocumentoResponse mapToDocResponse(EmpresaDocumento d) {
        return EmpresaDocumentoResponse.builder()
                .id(d.getId())
                .tipo(d.getTipo())
                .url(d.getUrl())
                .nombreArchivo(d.getNombreArchivo())
                .fechaVigencia(d.getFechaVigencia())
                .fechaCarga(d.getFechaCarga())
                .build();
    }

}