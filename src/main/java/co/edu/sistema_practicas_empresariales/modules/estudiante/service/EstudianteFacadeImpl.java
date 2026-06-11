package co.edu.sistema_practicas_empresariales.modules.estudiante.service;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.Programa;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.ProgramaRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteRequest;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.EstudianteResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.PracticaResponse;
import co.edu.sistema_practicas_empresariales.modules.estudiante.event.AptitudEvaluadaEvent;
import co.edu.sistema_practicas_empresariales.modules.estudiante.event.EstudianteRegistradoEvent;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.ProgramaRequisito;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.ProgramaRequisitoRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain.CreditosHandler;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain.DocumentosHandler;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain.PracticaAnteriorHandler;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain.PromedioHandler;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.chain.ValidadorAptitudHandler;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Rol;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.RolRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del patrón Facade para el módulo de Estudiante.
 * Orquesta la lógica de negocio coordinando repositorios, cadena de validación
 * (Chain of Responsibility) y publicación de eventos (Observer).
 */
@Service
@RequiredArgsConstructor
public class EstudianteFacadeImpl implements EstudianteFacade {

    private static final String ESTUDIANTE_NO_ENCONTRADO_MSG = "Estudiante no encontrado con ID: ";

    private final EstudianteRepository estudianteRepository;
    private final ProgramaRequisitoRepository programaRequisitoRepository;
    private final PracticaRepository practicaRepository;
    private final ProgramaRepository programaRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public EstudianteResponse registrarEstudiante(EstudianteRequest request) {
        if (estudianteRepository.existsByIdentificacion(request.getIdentificacion())) {
            throw new IllegalArgumentException("Ya existe un estudiante con la identificación: " + request.getIdentificacion());
        }

        Programa programa = programaRepository.findById(request.getProgramaId())
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado con ID: " + request.getProgramaId()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    Rol rolEstudiante = rolRepository.findByNombre(Rol.Nombre.ESTUDIANTE)
                            .orElseThrow(() -> new IllegalStateException("Rol ESTUDIANTE no encontrado"));
                    
                    Usuario nuevoUsuario = Usuario.builder()
                            .email(request.getEmail())
                            .nombre(request.getNombre())
                            .password(passwordEncoder.encode(request.getIdentificacion())) // Contraseña por defecto: Identificación
                            .rol(rolEstudiante)
                            .activo(true)
                            .build();
                    return usuarioRepository.save(nuevoUsuario);
                });

        if (request.getTipoIdentificacion() == null || request.getTipoIdentificacion().isBlank()) {
            throw new IllegalArgumentException("tipoIdentificacion es obligatorio");
        }

        Estudiante estudiante = Estudiante.builder()
                .usuario(usuario)
                .tipoIdentificacion(request.getTipoIdentificacion())
                .identificacion(request.getIdentificacion())
                .contactoEmergencia(request.getContactoEmergencia())
                .programa(programa)
                .semestre(request.getSemestre())
                .creditosAprobados(request.getCreditosAprobados())
                .promedioAcumulado(request.getPromedioAcumulado())
                .build();

        estudiante = estudianteRepository.save(estudiante);

        // Patrón Observer: publicar evento de registro
        eventPublisher.publishEvent(new EstudianteRegistradoEvent(this, estudia        return mapToResponse(estudiante);
    }

    @Override
    @Transactional
    public List<EstudianteResponse> registrarEstudiantesMasivo(MultipartFile file) {
        List<EstudianteResponse> responses = new ArrayList<>();
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            boolean firstRow = true;
            for (Row row : sheet) {
                if (firstRow) {
                    firstRow = false;
                } else if (esFilaValida(row)) {
                    procesarFila(row, responses);
                }
            }
        } catch (java.io.IOException e) {
            throw new IllegalArgumentException("Error al leer el archivo Excel: " + e.getMessage(), e);
        }
        return responses;
    }

    private boolean esFilaValida(Row row) {
        return row.getCell(0) != null && row.getCell(1) != null && row.getCell(2) != null && row.getCell(3) != null &&
               row.getCell(6) != null && row.getCell(7) != null && row.getCell(8) != null && row.getCell(9) != null;
    }

    private void procesarFila(Row row, List<EstudianteResponse> responses) {
        try {
            EstudianteRequest req = EstudianteRequest.builder()
                .nombre(getCellValueAsString(row.getCell(0)))
                .email(getCellValueAsString(row.getCell(1)))
                .tipoIdentificacion(getCellValueAsString(row.getCell(2)))
                .identificacion(getCellValueAsString(row.getCell(3)))
                .telefono(getCellValueAsString(row.getCell(4)))
                .contactoEmergencia(getCellValueAsString(row.getCell(5)))
                .programaId((long) row.getCell(6).getNumericCellValue())
                .semestre((int) row.getCell(7).getNumericCellValue())
                .creditosAprobados((int) row.getCell(8).getNumericCellValue())
                .promedioAcumulado(java.math.BigDecimal.valueOf(row.getCell(9).getNumericCellValue()))
                .build();
                
            responses.add(((EstudianteFacade)org.springframework.aop.framework.AopContext.currentProxy()).registrarEstudiante(req));
        } catch (Exception e) {
            java.util.logging.Logger.getLogger(EstudianteFacadeImpl.class.getName())
                    .log(java.util.logging.Level.WARNING, e, () -> "Error procesando fila " + row.getRowNum());
        }
    }
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        String value = new DataFormatter().formatCellValue(cell).trim();
        return value.isEmpty() ? null : value;
    }

    @Override
    @Transactional(readOnly = true)
    public EstudianteResponse obtenerPorId(Long id) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(ESTUDIANTE_NO_ENCONTRADO_MSG + id));
        return mapToResponse(estudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public EstudianteResponse obtenerPorUsuarioId(Long usuarioId) {
        Estudiante estudiante = estudianteRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado para el usuario ID: " + usuarioId));
        return mapToResponse(estudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteResponse> listarTodos() {
        return estudianteRepository.findByActivoTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteResponse> listarPorPrograma(Long programaId) {
        return estudianteRepository.findByProgramaIdAndActivoTrue(programaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstudianteResponse> listarAptos() {
        return estudianteRepository.findAptos().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EstudianteResponse actualizarEstudiante(Long id, EstudianteRequest request) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(ESTUDIANTE_NO_ENCONTRADO_MSG + id));

        if (request.getTelefono() != null) {
            estudiante.setTelefono(request.getTelefono());
        }
        if (request.getContactoEmergencia() != null) {
            estudiante.setContactoEmergencia(request.getContactoEmergencia());
        }
        if (request.getSemestre() > 0) {
            estudiante.setSemestre(request.getSemestre());
        }
        if (request.getCreditosAprobados() > 0) {
            estudiante.setCreditosAprobados(request.getCreditosAprobados());
        }
        if (request.getPromedioAcumulado() != null) {
            estudiante.setPromedioAcumulado(request.getPromedioAcumulado());
        }

        estudiante = estudianteRepository.save(estudiante);
        return mapToResponse(estudiante);
    }

    /**
     * Evalúa la aptitud del estudiante para una práctica específica.
     * Utiliza el patrón Chain of Responsibility para ejecutar las validaciones
     * y el patrón Strategy dentro de cada handler para aplicar las reglas
     * configurables por programa.
     */
    @Override
    @Transactional
    public EstudianteResponse evaluarAptitud(Long estudianteId, int numeroPractica) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new IllegalArgumentException(ESTUDIANTE_NO_ENCONTRADO_MSG + estudianteId));

        ProgramaRequisito requisito = programaRequisitoRepository
                .findByProgramaIdAndNumeroPractica(estudiante.getPrograma().getId(), numeroPractica)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontraron requisitos para la práctica " + numeroPractica +
                        " del programa " + estudiante.getPrograma().getNombre()));

        List<Practica> historial = practicaRepository
                .findByEstudianteIdOrderByNumeroPracticaAsc(estudianteId);

        // Construir la cadena de validación (Chain of Responsibility)
        ValidadorAptitudHandler cadena = construirCadenaValidacion();

        List<String> errores = new ArrayList<>();
        cadena.procesar(estudiante, requisito, historial, errores);

        boolean esApto = errores.isEmpty();
        if (esApto) {
            estudiante.setEstadoAptitud(Estudiante.EstadoAptitud.APTO);
        } else {
            estudiante.setEstadoAptitud(Estudiante.EstadoAptitud.NO_APTO);
        }

        estudianteRepository.save(estudiante);

        // Patrón Observer: publicar evento de aptitud evaluada
        String motivo = esApto ? "Cumple todos los requisitos" : String.join("; ", errores);
        eventPublisher.publishEvent(new AptitudEvaluadaEvent(this, estudiante, esApto, motivo));

        return mapToResponse(estudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticaResponse> obtenerHistorialPracticas(Long estudianteId) {
        estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new IllegalArgumentException(ESTUDIANTE_NO_ENCONTRADO_MSG + estudianteId));

        return practicaRepository.findByEstudianteIdOrderByNumeroPracticaAsc(estudianteId).stream()
                .map(this::mapToPracticaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarEstudiante(Long id) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado con ID: " + id));
        estudiante.setActivo(false); // Soft delete
        estudianteRepository.save(estudiante);
    }

    // ========== Métodos privados ==========

    /**
     * Construye la cadena de validación con los handlers correspondientes.
     * El orden importa: créditos → promedio → documentos → práctica anterior.
     */
    private ValidadorAptitudHandler construirCadenaValidacion() {
        ValidadorAptitudHandler creditosHandler = new CreditosHandler();
        ValidadorAptitudHandler promedioHandler = new PromedioHandler();
        ValidadorAptitudHandler documentosHandler = new DocumentosHandler();
        ValidadorAptitudHandler practicaAnteriorHandler = new PracticaAnteriorHandler();

        creditosHandler.setNext(promedioHandler);
        promedioHandler.setNext(documentosHandler);
        documentosHandler.setNext(practicaAnteriorHandler);

        return creditosHandler;
    }

    private EstudianteResponse mapToResponse(Estudiante e) {
        return EstudianteResponse.builder()
                .id(e.getId())
                .nombre(e.getUsuario().getNombre())
                .email(e.getUsuario().getEmail())
                .tipoIdentificacion(e.getTipoIdentificacion())
                .identificacion(e.getIdentificacion())
                .telefono(e.getTelefono())
                .contactoEmergencia(e.getContactoEmergencia())
                .programaId(e.getPrograma().getId())
                .nombrePrograma(e.getPrograma().getNombre())
                .nombreFacultad(e.getPrograma().getFacultad() != null ? e.getPrograma().getFacultad().getNombre() : null)
                .semestre(e.getSemestre())
                .creditosAprobados(e.getCreditosAprobados())
                .promedioAcumulado(e.getPromedioAcumulado())
                .estadoAptitud(e.getEstadoAptitud().name())
                .estadoPractica(e.getEstadoPractica())
                .activo(e.isActivo())
                .fechaCreacion(e.getFechaCreacion())
                .build();
    }

    private PracticaResponse mapToPracticaResponse(Practica p) {
        return PracticaResponse.builder()
                .id(p.getId())
                .numeroPractica(p.getNumeroPractica())
                .nombre(p.getNombre())
                .materiaNucleo(p.getMateriaNucleo())
                .materiaNucleoCodigo(p.getMateriaNucleoCodigo())
                .duracionSemanas(p.getDuracionSemanas())
                .estado(p.getEstado().name())
                .nombreEmpresa(p.getEmpresaId() != null ? "Empresa ID: " + p.getEmpresaId() : null)
                .nombreDocenteAsesor(p.getDocenteAsesor() != null ? p.getDocenteAsesor().getNombre() : null)
                .nombreTutorEmpresarial(p.getTutorEmpresarialId() != null ? "Tutor ID: " + p.getTutorEmpresarialId() : null)
                .notaFinal(p.getNotaFinal())
                .resultado(p.getResultado())
                .fechaInicio(p.getFechaInicio())
                .fechaFin(p.getFechaFin())
                .build();
    }
}
