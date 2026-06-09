package co.edu.sistema_practicas_empresariales.modules.practica.service.impl;

import co.edu.sistema_practicas_empresariales.modules.infraestructura.storage.ArchivoStorageService;
import co.edu.sistema_practicas_empresariales.modules.practica.dto.*;
import co.edu.sistema_practicas_empresariales.modules.practica.model.*;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.*;
import co.edu.sistema_practicas_empresariales.modules.practica.request.FechaSustentacionRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.NotaFinalRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaFacade;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.configuracion.repository.CatalogoPracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import co.edu.sistema_practicas_empresariales.modules.usuario.model.Usuario;
import co.edu.sistema_practicas_empresariales.modules.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio principal de prÃ¡cticas.
 *
 * Patrones aplicados:
 * - State:                el modelo Practica delega comportamiento segÃºn su estado
 * - estrategia:       crearCortesAutomaticos y crearChecklistInicial
 * - Chain of Responsibility: checklist de paz y salvo
 * - Observer:             actualizaciÃ³n automÃ¡tica del checklist por eventos
 * - Adapter:              Firebase a travÃ©s de ArchivoStorageService
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PracticaFacadeImpl implements PracticaFacade {

    private final PracticaRepository         practicaRepository;
    private final ChecklistItemRepository    checklistRepository;
    private final PracticaDocumentoRepository documentoRepository;
    private final CatalogoPracticaRepository catalogoRepository;
    private final EstudianteRepository       estudianteRepository;
    private final UsuarioRepository          usuarioRepository;
    private final ArchivoStorageService      storageService;

    // Claves del checklist
    private static final String CK_NOTA_FINAL     = "nota_final";
    private static final String CK_ENCUESTA_TUTOR = "encuesta_tutor";
    private static final String CK_ENCUESTA_EST   = "encuesta_estudiante";
    private static final String CK_DOCUMENTOS     = "documentos_completos";
    private static final String CK_INFORME        = "informe_final";

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // CONSULTAS
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    @Transactional(readOnly = true)
    public List<PracticaResumenDto> listarTodas() {
        return practicaRepository.findAll().stream()
                .map(this::toResumen).toList();
    }

    @Transactional(readOnly = true)
    public List<PracticaResumenDto> listarPorEstado(EstadoPracticaTipo estado) {
        return practicaRepository.findByEstado(estado).stream()
                .map(this::toResumen).toList();
    }

    @Transactional(readOnly = true)
    public List<PracticaResumenDto> listarPorDocente(Long docenteId) {
        return practicaRepository.findPracticasActivasByDocente(docenteId).stream()
                .map(this::toResumen).toList();
    }

    @Transactional(readOnly = true)
    public PracticaDetalleDto obtenerDetalle(Long id) {
        return toDetalle(buscar(id));
    }

    @Transactional(readOnly = true)
    public PracticaDetalleDto obtenerPracticaActivaEstudiante(Long estudianteId) {
        Practica p = practicaRepository.findPracticaActivaByEstudiante(estudianteId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No hay prÃ¡ctica activa para el estudiante " + estudianteId));
        return toDetalle(p);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // CREACIÃ“N AUTOMÃTICA
    // PatrÃ³n estrategia
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Crea la instancia de prÃ¡ctica automÃ¡ticamente cuando el coordinador
     * acadÃ©mico marca al estudiante como APTO y asigna nÃºmero de prÃ¡ctica.
     * PatrÃ³n estrategia: inicializa cortes y checklist automÃ¡ticamente.
     */
    public PracticaDetalleDto crearPracticaAutomatica(Long estudianteId, Long catalogoId) {

        Estudiante      estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado"));
        CatalogoPractica catalogo  = catalogoRepository.findById(catalogoId)
                .orElseThrow(() -> new IllegalArgumentException("CatÃ¡logo no encontrado"));

        // Verificar que no haya prÃ¡ctica activa del mismo nÃºmero
        boolean existe = practicaRepository.existsByEstudianteIdAndEstadoNotIn(
                estudianteId,
                List.of(EstadoPracticaTipo.COMPLETADA,
                        EstadoPracticaTipo.REPROBADA,
                        EstadoPracticaTipo.CANCELADA)
        );
        if (existe) {
            throw new IllegalStateException("El estudiante ya tiene una prÃ¡ctica activa");
        }

        // PatrÃ³n State: estado inicial ASIGNADA_PENDIENTE_INICIO
        Practica practica = Practica.builder()
                .estudiante(estudiante)
                .catalogoPractica(catalogo)
                .numeroPractica(catalogo.getNumeroPractica())
                .nombre(catalogo.getNombre())
                .materiaNucleo(catalogo.getMateriaNucleo())
                .materiaNucleoCodigo(catalogo.getMateriaNucleoCodigo())
                .duracionSemanas(catalogo.getDuracionSemanas())
                .build();

        practica = practicaRepository.save(practica);


        // estrategia: checklist inicial
        crearChecklistInicial(practica);

        log.info("PrÃ¡ctica creada â€” estudianteId={} catalogoId={}", estudianteId, catalogoId);
        return toDetalle(practica);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // TRANSICIONES DE ESTADO
    // PatrÃ³n State: delegado al modelo
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Inicia el proceso de vinculaciÃ³n con la empresa.
     * PatrÃ³n State: delega al comportamiento del estado actual.
     */
    public PracticaDetalleDto iniciarVinculacion(Long practicaId) {
        Practica p = buscar(practicaId);
        p.iniciarVinculacion(); // PatrÃ³n State
        return toDetalle(practicaRepository.save(p));
    }

    /**
     * Registra el convenio con la empresa.
     * PatrÃ³n State: delega al comportamiento del estado actual.
     */
    public PracticaDetalleDto registrarConvenio(Long practicaId) {
        Practica p = buscar(practicaId);
        p.registrarConvenio(); // PatrÃ³n State
        return toDetalle(practicaRepository.save(p));
    }

    /**
     * Activa la prÃ¡ctica â€” cambia a EN_PRACTICA.
     * PatrÃ³n State: delega al comportamiento del estado actual.
     */
    public PracticaDetalleDto activarPractica(Long practicaId) {
        Practica p = buscar(practicaId);
        if (p.getDocenteAsesor() == null) {
            throw new IllegalStateException("No se puede activar sin docente asesor asignado");
        }
        p.activarPractica(); // PatrÃ³n State
        return toDetalle(practicaRepository.save(p));
    }

    /**
     * Cancela la prÃ¡ctica.
     * PatrÃ³n State: delega al comportamiento del estado actual.
     */
    public PracticaDetalleDto cancelar(Long practicaId, String motivo) {
        Practica p = buscar(practicaId);
        p.cancelar(motivo); // PatrÃ³n State
        return toDetalle(practicaRepository.save(p));
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // ASIGNACIONES
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public PracticaDetalleDto asignarDocente(Long practicaId, Long docenteId) {
        Practica p  = buscar(practicaId);
        Usuario doc = usuarioRepository.findById(docenteId)
                .orElseThrow(() -> new IllegalArgumentException("Docente no encontrado"));
        p.setDocenteAsesor(doc);
        return toDetalle(practicaRepository.save(p));
    }

    public PracticaDetalleDto asignarEmpresa(Long practicaId, Long empresaId) {
        Practica p = buscar(practicaId);
        p.setEmpresaId(empresaId);
        return toDetalle(practicaRepository.save(p));
    }

    public PracticaDetalleDto asignarTutor(Long practicaId, Long tutorId) {
        Practica p = buscar(practicaId);
        p.setTutorEmpresarialId(tutorId);
        return toDetalle(practicaRepository.save(p));
    }

    public PracticaDetalleDto registrarFechaSustentacion(Long practicaId,
                                                         FechaSustentacionRequest req) {
        Practica p = buscar(practicaId);
        p.setFechaSustentacion(req.getFechaSustentacion());
        return toDetalle(practicaRepository.save(p));
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // DOCUMENTOS â€” Firebase Storage
    // PatrÃ³n Adapter
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Sube un documento a Firebase Storage y lo registra en BD.
     * PatrÃ³n Adapter: ArchivoStorageService abstrae Firebase.
     * @param categoria ARL | PLANEADOR | INFORME_EJECUTIVO | PRESENTACION | DOCUMENTO_FINAL
     */
    public PracticaDetalleDto subirDocumento(Long practicaId,
                                             String categoria,
                                             MultipartFile archivo,
                                             String emailUsuario) {
        Practica p = buscar(practicaId);

        String carpeta = "practicas/" + practicaId + "/" + categoria.toLowerCase();
        String nombre  = categoria.toLowerCase() + "_" + practicaId;
        String url     = storageService.subirArchivo(archivo, carpeta, nombre);

        PracticaDocumento doc = PracticaDocumento.builder()
                .practica(p)
                .nombre(archivo.getOriginalFilename())
                .url(url)
                .categoria(categoria)
                .fechaCarga(LocalDateTime.now())
                .cargadoPorEmail(emailUsuario)
                .estado("PENDIENTE")
                .build();

        documentoRepository.save(doc);

        // Observer: actualizar checklist segÃºn la categorÃ­a
        if ("ARL".equals(categoria)) {
            verificarYActualizarDocumentos(p);
        }
        if ("DOCUMENTO_FINAL".equals(categoria) || "INFORME_EJECUTIVO".equals(categoria)) {
            actualizarChecklist(p.getId(), CK_INFORME);
        }

        log.info("Documento {} subido â€” practicaId={}", categoria, practicaId);
        return toDetalle(practicaRepository.save(p));
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // NOTA FINAL
    @Override
    @Transactional
    public void eliminarPractica(Long practicaId) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new IllegalArgumentException("Práctica no encontrada con id: " + practicaId));
        practica.setActivo(false); // Soft delete
        practicaRepository.save(practica);
    }
    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

    /**
     * Registra la nota final y determina el resultado.
     * Patr├│n State: delega al modelo para cambiar estado seg├║n nota.
     */
    public PracticaDetalleDto registrarNotaFinal(Long practicaId, NotaFinalRequest req) {
        Practica p = buscar(practicaId);

        // Obtener nota m├¡nima del programa (desde par├ímetros)
        BigDecimal notaMinima = BigDecimal.valueOf(3.0); // valor por defecto
        // Nota: obtener del programa_parametros cuando est├® disponible el repo

        p.registrarNotaFinal(req.getNota(), notaMinima); // Patr├│n State
        actualizarChecklist(practicaId, CK_NOTA_FINAL);

        return toDetalle(practicaRepository.save(p));
    }

    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    // CHECKLIST PAZ Y SALVO
    // Patr├│n Chain of Responsibility
    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

    @Transactional(readOnly = true)
    public List<ChecklistDto> obtenerChecklist(Long practicaId) {
        return checklistRepository.findByPracticaId(practicaId).stream()
                .map(i -> ChecklistDto.builder()
                        .id(i.getId())
                        .clave(i.getClave())
                        .label(i.getLabel())
                        .completado(i.getCompletado())
                        .build())
                .toList();
    }

    public boolean tienePazYSalvo(Long practicaId) {
        return !checklistRepository.existsByPracticaIdAndCompletadoFalse(practicaId);
    }

    public void marcarEncuestaEstudianteCompletada(Long practicaId) {
        actualizarChecklist(practicaId, CK_ENCUESTA_EST);
    }

    public void marcarEncuestaTutorCompletada(Long practicaId) {
        actualizarChecklist(practicaId, CK_ENCUESTA_TUTOR);
    }

    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    // PRIVADOS
    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ



    /**
     * Patr├│n estrategia: crea el checklist inicial.
     * Patr├│n Chain of Responsibility: cada ├¡tem es un eslab├│n.
     */
    private void crearChecklistInicial(Practica practica) {
        List.of(
                new String[]{CK_NOTA_FINAL,     "Nota final registrada"},
                new String[]{CK_ENCUESTA_TUTOR, "Encuesta del tutor completada"},
                new String[]{CK_ENCUESTA_EST,   "Encuesta del estudiante completada"},
                new String[]{CK_DOCUMENTOS,     "Documentos completos (ARL + planeador)"},
                new String[]{CK_INFORME,        "Informe final cargado"}
        ).forEach(item ->
                checklistRepository.save(
                        ChecklistItem.builder()
                                .practica(practica)
                                .clave(item[0])
                                .label(item[1])
                                .completado(false)
                                .build()
                )
        );
    }

    /**
     * Patr├│n Observer: actualiza el checklist cuando ocurre un evento.
     */
    private void actualizarChecklist(Long practicaId, String clave) {
        checklistRepository.findByPracticaIdAndClave(practicaId, clave)
                .ifPresent(item -> {
                    item.setCompletado(true);
                    checklistRepository.save(item);
                });
    }

    /** Verifica si todos los documentos requeridos est├ín cargados */
    private void verificarYActualizarDocumentos(Practica practica) {
        List<String> categoriasRequeridas = List.of("ARL", "PLANEADOR");
        List<String> categoriasActuales   = documentoRepository
                .findByPracticaId(practica.getId())
                .stream()
                .map(PracticaDocumento::getCategoria)
                .toList();

        boolean completo = categoriasRequeridas.stream()
                .allMatch(categoriasActuales::contains);

        if (completo) {
            actualizarChecklist(practica.getId(), CK_DOCUMENTOS);
        }
    }

    private Practica buscar(Long id) {
        return practicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pr├íctica no encontrada: " + id));
    }

    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    // MAPPERS
    // ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

    private PracticaResumenDto toResumen(Practica p) {
        return PracticaResumenDto.builder()
                .id(p.getId())
                .nombrePractica(p.getNombre())
                .materiaNucleo(p.getMateriaNucleo())
                .estudianteId(p.getEstudiante().getId())
                .nombreEstudiante(p.getEstudiante().getUsuario().getNombre())
                .empresaId(p.getEmpresaId())
                .docenteId(p.getDocenteAsesor() != null ? p.getDocenteAsesor().getId() : null)
                .nombreDocente(p.getDocenteAsesor() != null ? p.getDocenteAsesor().getNombre() : null)
                .estado(p.getEstado())
                .fechaInicio(p.getFechaInicio())
                .fechaFin(p.getFechaFin())
                .tienePazYSalvo(tienePazYSalvo(p.getId()))
                .build();
    }

    private PracticaDetalleDto toDetalle(Practica p) {

        List<ChecklistDto> checklist = checklistRepository
                .findByPracticaId(p.getId())
                .stream()
                .map(i -> ChecklistDto.builder()
                        .id(i.getId())
                        .clave(i.getClave())
                        .label(i.getLabel())
                        .completado(i.getCompletado())
                        .build())
                .toList();


        return PracticaDetalleDto.builder()
                .id(p.getId())
                .estado(p.getEstado())
                .catalogoPracticaId(p.getCatalogoPractica() != null
                        ? p.getCatalogoPractica().getId() : null)
                .nombrePractica(p.getNombre())
                .materiaNucleo(p.getMateriaNucleo())
                .materiaNucleoCodigo(p.getMateriaNucleoCodigo())
                .numeroPractica(p.getNumeroPractica())
                .duracionSemanas(p.getDuracionSemanas())
                .estudianteId(p.getEstudiante().getId())
                .nombreEstudiante(p.getEstudiante().getUsuario().getNombre())
                .empresaId(p.getEmpresaId())
                .docenteId(p.getDocenteAsesor() != null ? p.getDocenteAsesor().getId() : null)
                .nombreDocente(p.getDocenteAsesor() != null ? p.getDocenteAsesor().getNombre() : null)
                .tutorId(p.getTutorEmpresarialId())
                .fechaInicio(p.getFechaInicio())
                .fechaFin(p.getFechaFin())
                .fechaSustentacion(p.getFechaSustentacion())
                .notaFinal(p.getNotaFinal())
                .resultado(p.getResultado())
                .checklist(checklist)
                .tienePazYSalvo(tienePazYSalvo(p.getId()))
                .build();
    }


    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public co.edu.sistema_practicas_empresariales.modules.documento.builder.ActaCierre generarActaCierre(Long practicaId) {
        Practica practica = practicaRepository.findById(practicaId)
                .orElseThrow(() -> new IllegalArgumentException("Practica no encontrada"));
                
        int inactividadMaxima = co.edu.sistema_practicas_empresariales.config.ConfiguracionGlobalSingleton.getInstance().getDiasInactividadMaximos();
                
        String resolucion = "RES-" + java.time.LocalDate.now().getYear() + "-" + practica.getId();
        
        String nombreEmpresa = "Empresa No Asignada";
        if (practica.getEmpresaId() != null) {
            nombreEmpresa = "ID Empresa: " + practica.getEmpresaId();
        }

        return new co.edu.sistema_practicas_empresariales.modules.documento.builder.ActaCierreBuilder()
                .paraEstudiante(practica.getEstudiante().getIdentificacion())
                .enEmpresa(nombreEmpresa)
                .conCalificacion(practica.getNotaFinal() != null ? practica.getNotaFinal().doubleValue() : 0.0)
                .agregarFirma("Firma Coordinador")
                .agregarFirma("Firma " + (practica.getDocenteAsesor() != null ? practica.getDocenteAsesor().getNombre() : "Docente"))
                .establecerResolucion(resolucion)
                .construir();
    }
}