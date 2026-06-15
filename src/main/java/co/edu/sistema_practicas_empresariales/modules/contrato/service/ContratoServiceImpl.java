package co.edu.sistema_practicas_empresariales.modules.contrato.service;

import co.edu.sistema_practicas_empresariales.modules.contrato.dto.*;
import co.edu.sistema_practicas_empresariales.modules.contrato.model.Contrato;
import co.edu.sistema_practicas_empresariales.modules.contrato.repository.ContratoRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.Empresa;
import co.edu.sistema_practicas_empresariales.modules.empresa.model.TutorEmpresarial;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import co.edu.sistema_practicas_empresariales.modules.estudiante.model.Estudiante;
import co.edu.sistema_practicas_empresariales.modules.estudiante.repository.EstudianteRepository;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.export.GeneradorDocumentoPlantilla;
import co.edu.sistema_practicas_empresariales.modules.infraestructura.storage.ArchivoStorageService;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.practica.repository.PracticaRepository;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.Postulacion;
import co.edu.sistema_practicas_empresariales.modules.postulacion.model.EstadoPostulacionTipo;
import co.edu.sistema_practicas_empresariales.modules.postulacion.repository.PostulacionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio de lógica de negocio para la gestión de Contrato.
 * Implementa las operaciones principales, reglas de negocio y transacciones directamente relacionadas con la base de datos.
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
public class ContratoServiceImpl implements ContratoService {

    private final ContratoRepository       contratoRepository;
    private final PracticaRepository       practicaRepository;
    private final EstudianteRepository     estudianteRepository;
    private final EmpresaRepository        empresaRepository;
    private final TutorEmpresarialRepository tutorRepository;
    private final PostulacionRepository    postulacionRepository;

    private final GeneradorDocumentoPlantilla generador;
    private final ArchivoStorageService    archivoStorageService;

    // ── Generar contrato ───────────────────────────────────────────────────────

    @Transactional
    public ContratoResponse generarContrato(ContratoRequest req) {

        // Obtener datos completos si viene practicaId
        Practica   practica  = null;
        Estudiante estudiante = null;
        Empresa    empresa    = null;
        TutorEmpresarial tutor = null;

        if (req.getPracticaId() != null) {
            practica   = practicaRepository.findById(req.getPracticaId()).orElse(null);
        }
        if (req.getEstudianteId() != null) {
            estudiante = estudianteRepository.findById(req.getEstudianteId()).orElse(null);
        }
        if (req.getEmpresaId() != null) {
            empresa = empresaRepository.findById(req.getEmpresaId()).orElse(null);
        }
        if (practica != null && practica.getTutorEmpresarialId() != null) {
            tutor = tutorRepository.findById(practica.getTutorEmpresarialId()).orElse(null);
        }

        // Construir variables para la plantilla PDF
        Map<String, Object> vars = new LinkedHashMap<>();
        vars.put("empresa_nombre",    empresa != null ? empresa.getRazonSocial() : req.getEmpresaNombre());
        vars.put("empresa_nit",       empresa != null ? empresa.getNit() : "—");
        vars.put("tutor_nombre",      tutor   != null ? tutor.getNombreCompleto() : empresa != null ? empresa.getContactoPrincipalNombre() : "—");
        vars.put("tutor_cedula",      "—");
        vars.put("estudiante_nombre", estudiante != null ? estudiante.getUsuario().getNombre() : req.getEstudianteNombre());
        vars.put("estudiante_cedula", estudiante != null ? estudiante.getIdentificacion() : "—");
        vars.put("semestre_estudiante", estudiante != null ? String.valueOf(estudiante.getSemestre()) : "último");
        vars.put("programa_academico",  estudiante != null ? estudiante.getPrograma().getNombre() : "—");
        vars.put("salario",           req.getValorMensual() != null
                ? "$" + req.getValorMensual().toPlainString()
                : "$0");
        vars.put("fecha_inicio",      req.getFechaInicio() != null ? req.getFechaInicio() : "—");
        vars.put("fecha_fin",         req.getFechaFin()    != null ? req.getFechaFin()    : "—");
        vars.put("tipo_contrato",     req.getTipoContrato() != null ? req.getTipoContrato() : "—");

        // Generar PDF
        byte[] pdfBytes = generador.generarDesdePlantilla("contrato", vars);

        // Subir a Firebase/Cloudinary
        String nombreArchivo = "contrato_" + (req.getEstudianteId() != null ? req.getEstudianteId() : "est")
                + "_" + System.currentTimeMillis();
        String pdfUrl = archivoStorageService.subirArchivoBytes(
                pdfBytes,
                "contratos/" + nombreArchivo,
                nombreArchivo + ".pdf"
        );

        // Guardar registro en BD
        Contrato contrato = Contrato.builder()
                .practicaId(req.getPracticaId())
                .estudianteId(req.getEstudianteId())
                .empresaId(req.getEmpresaId())
                .estudianteNombre(req.getEstudianteNombre() != null
                        ? req.getEstudianteNombre()
                        : (estudiante != null ? estudiante.getUsuario().getNombre() : "—"))
                .empresaNombre(req.getEmpresaNombre() != null
                        ? req.getEmpresaNombre()
                        : (empresa != null ? empresa.getRazonSocial() : "—"))
                .tipoContrato(req.getTipoContrato())
                .fechaInicio(req.getFechaInicio() != null ? LocalDate.parse(req.getFechaInicio()) : null)
                .fechaFin(req.getFechaFin()       != null ? LocalDate.parse(req.getFechaFin())    : null)
                .valorMensual(req.getValorMensual())
                .pdfUrl(pdfUrl)
                .estado("GENERADO")
                .build();

        return mapToResponse(contratoRepository.save(contrato));
    }

    // ── Listar contratos ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ContratoResponse> listarTodos() {
        return contratoRepository.findByActivoTrueOrderByFechaGeneracionDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Empresas con seleccionados (para el formulario de contratos) ───────────

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getEmpresasConSeleccionados() {
        // Obtener todas las postulaciones SELECCIONADO
        List<Postulacion> seleccionadas = postulacionRepository.findAll().stream()
                .filter(p -> p.getEstado() == EstadoPostulacionTipo.SELECCIONADO)
                .toList();

        if (seleccionadas.isEmpty()) return List.of();

        Map<Long, Map<String, Object>> porEmpresa = new LinkedHashMap<>();

        for (Postulacion post : seleccionadas) {
            Estudiante est     = post.getEstudiante();
            Long       empId   = post.getVacante().getEmpresa().getId();
            Empresa    empresa = post.getVacante().getEmpresa();

            // Verificar si ya tiene contrato generado
            boolean tieneContrato = contratoRepository
                    .existsByPracticaIdAndActivoTrue(
                            practicaRepository
                                    .findPracticaActivaByEstudiante(est.getId())
                                    .map(Practica::getId)
                                    .orElse(-1L)
                    );
            if (tieneContrato) continue;

            // Verificar si ya tiene empresa asignada en práctica

            porEmpresa.computeIfAbsent(empId, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("empresaId",      empresa.getId());
                m.put("razonSocial",    empresa.getRazonSocial());
                m.put("nit",            empresa.getNit());
                m.put("nombreContacto", empresa.getContactoPrincipalNombre());
                m.put("cedulaContacto", "—");
                m.put("municipio",      empresa.getMunicipio());
                m.put("seleccionados",  new ArrayList<>());
                return m;
            });

            Long practicaId = practicaRepository
                    .findPracticaActivaByEstudiante(est.getId())
                    .map(Practica::getId)
                    .orElse(null);

            Map<String, Object> seleccionado = new LinkedHashMap<>();
            seleccionado.put("estudianteId",   est.getId());
            seleccionado.put("nombre",         est.getUsuario().getNombre());
            seleccionado.put("programa",       est.getPrograma().getNombre());
            seleccionado.put("programaId",     est.getPrograma().getId());
            seleccionado.put("semestre",       est.getSemestre());
            seleccionado.put("correo",         est.getUsuario().getEmail());
            seleccionado.put("numeroPractica", 1);
            seleccionado.put("vacanteTitulo",  post.getVacante().getTitulo());
            seleccionado.put("salarioVacante", post.getVacante().getSalario());
            seleccionado.put("practicaId",     practicaId);
            seleccionado.put("empresaId",      empId);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> seleccionados = (List<Map<String, Object>>) porEmpresa.get(empId).get("seleccionados");
            seleccionados.add(seleccionado);
        }

        // Filtrar empresas que quedaron sin seleccionados
        return porEmpresa.values().stream()
                .filter(e -> !((List<?>) e.get("seleccionados")).isEmpty())
                .collect(Collectors.toList());
    }

    // ── Mapper ─────────────────────────────────────────────────────────────────

    private ContratoResponse mapToResponse(Contrato c) {
        return ContratoResponse.builder()
                .id(c.getId())
                .practicaId(c.getPracticaId())
                .estudianteId(c.getEstudianteId())
                .estudianteNombre(c.getEstudianteNombre())
                .empresaId(c.getEmpresaId())
                .empresaNombre(c.getEmpresaNombre())
                .tipoContrato(c.getTipoContrato())
                .fechaInicio(c.getFechaInicio())
                .fechaFin(c.getFechaFin())
                .valorMensual(c.getValorMensual())
                .pdfUrl(c.getPdfUrl())
                .estado(c.getEstado())
                .fechaGeneracion(c.getFechaGeneracion())
                .build();
    }
}