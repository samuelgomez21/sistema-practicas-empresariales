package co.edu.sistema_practicas_empresariales.modules.practica.controller;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.*;
import co.edu.sistema_practicas_empresariales.modules.practica.request.AsignarDocenteRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.FechaSustentacionRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.NotaFinalRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaFacade;
import co.edu.sistema_practicas_empresariales.modules.practica.state.EstadoPracticaTipo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con la entidad Practica.
 * Maneja las peticiones HTTP y orquesta la respuesta delegando la lógica de negocio al servicio o facade correspondiente.
 * 
 * <p>Esta clase ha sido documentada para proveer una comprensión clara
 * de su responsabilidad dentro de la arquitectura del sistema de prácticas empresariales.</p>
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/practicas")
@RequiredArgsConstructor
public class PracticaController {

    private final PracticaFacade practicaFacade;

    // ── Listados ────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINACION_ACADEMICA','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION', 'ESTUDIANTE')")
    public ResponseEntity<List<PracticaResumenDto>> listarTodas() {
        return ResponseEntity.ok(practicaFacade.listarTodas());
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<PracticaResumenDto>> listarPorEstado(
            @PathVariable EstadoPracticaTipo estado) {
        return ResponseEntity.ok(practicaFacade.listarPorEstado(estado));
    }

    @GetMapping("/docente/{docenteId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_ACADEMICO','DOCENTE_ASESOR')")
    public ResponseEntity<List<PracticaResumenDto>> listarPorDocente(
            @PathVariable Long docenteId) {
        return ResponseEntity.ok(practicaFacade.listarPorDocente(docenteId));
    }

    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','EMPRESA_VINCULADA', 'TUTOR_EMPRESARIAL','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<PracticaResumenDto>> listarPorEmpresa(
            @PathVariable Long empresaId) {
        return ResponseEntity.ok(practicaFacade.listarPorEmpresa(empresaId));
    }

    @GetMapping("/estudiante/{estudianteId}/activa")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','ESTUDIANTE','EMPRESA_VINCULADA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> practicaActivaEstudiante(
            @PathVariable Long estudianteId) {
        return ResponseEntity.ok(
                practicaFacade.obtenerPracticaActivaEstudiante(estudianteId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_ACADEMICO','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA_COORDINACION','ESTUDIANTE','EMPRESA_VINCULADA','TUTOR_EMPRESARIAL')")
    public ResponseEntity<PracticaDetalleDto> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.obtenerDetalle(id));
    }

    @GetMapping("/mis-practicas")
    @PreAuthorize("hasRole('DOCENTE_ASESOR')")
    public ResponseEntity<List<PracticaResumenDto>> misPracticas(
            @org.springframework.security.core.annotation.AuthenticationPrincipal
            org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity.ok(practicaFacade.listarMisPracticasDocente(userDetails.getUsername()));
    }

    // ── Creación automática ─────────────────────────────────────────

    @PostMapping("/crear-automatica")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_ACADEMICO')")
    public ResponseEntity<PracticaDetalleDto> crearAutomatica(
            @RequestParam Long estudianteId,
            @RequestParam Long catalogoId) {
        return ResponseEntity.ok(
                practicaFacade.crearPracticaAutomatica(estudianteId, catalogoId));
    }

    // ── Transiciones de estado ──────────────────────────────────────

    @PatchMapping("/{id}/iniciar-vinculacion")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> iniciarVinculacion(@PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.iniciarVinculacion(id));
    }

    @PatchMapping("/{id}/registrar-convenio")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> registrarConvenio(@PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.registrarConvenio(id));
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.activarPractica(id));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> cancelar(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        return ResponseEntity.ok(practicaFacade.cancelar(id, motivo));
    }

    // ── Asignaciones ────────────────────────────────────────────────

    @PatchMapping("/{id}/asignar-docente")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_ACADEMICO')")
    public ResponseEntity<PracticaDetalleDto> asignarDocente(
            @PathVariable Long id,
            @RequestBody @Valid AsignarDocenteRequest req) {
        return ResponseEntity.ok(practicaFacade.asignarDocente(id, req.getDocenteId()));
    }

    @PatchMapping("/{id}/asignar-empresa")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> asignarEmpresa(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(practicaFacade.asignarEmpresa(id, body.get("empresaId")));
    }

    @PatchMapping("/{id}/asignar-tutor")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','EMPRESA_VINCULADA','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> asignarTutor(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(practicaFacade.asignarTutor(id, body.get("tutorId")));
    }

    @PatchMapping("/{id}/fecha-sustentacion")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','ESTUDIANTE','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> fechaSustentacion(
            @PathVariable Long id,
            @RequestBody @Valid FechaSustentacionRequest req) {
        return ResponseEntity.ok(practicaFacade.registrarFechaSustentacion(id, req));
    }

    // ── Documentos ──────────────────────────────────────────────────

    @PostMapping(value = "/{id}/documentos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','ESTUDIANTE','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> subirDocumento(
            @PathVariable Long id,
            @RequestParam String categoria,
            @RequestPart("archivo") MultipartFile archivo,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                practicaFacade.subirDocumento(id, categoria, archivo, userDetails.getUsername()));
    }

    @GetMapping("/{id}/documentos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','ESTUDIANTE','SECRETARIA_COORDINACION')")
    public ResponseEntity<List<co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDocumentoDto>> listarDocumentos(
            @PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.listarDocumentos(id));
    }

    @PatchMapping("/{practicaId}/documentos/{documentoId}/aprobar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA_COORDINACION')")
    public ResponseEntity<Void> aprobarDocumento(
            @PathVariable Long practicaId,
            @PathVariable Long documentoId) {
        practicaFacade.aprobarDocumento(practicaId, documentoId);
        return ResponseEntity.noContent().build();
    }

    // ── Nota final ──────────────────────────────────────────────────

    @PatchMapping("/{id}/nota-final")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA_COORDINACION')")
    public ResponseEntity<PracticaDetalleDto> notaFinal(
            @PathVariable Long id,
            @RequestBody @Valid NotaFinalRequest req) {
        return ResponseEntity.ok(practicaFacade.registrarNotaFinal(id, req));
    }

    // ── Checklist ───────────────────────────────────────────────────

    @GetMapping("/{id}/checklist")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA_COORDINACION','ESTUDIANTE')")
    public ResponseEntity<List<ChecklistDto>> checklist(@PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.obtenerChecklist(id));
    }

    @GetMapping("/{id}/paz-y-salvo")
    public ResponseEntity<Map<String, Boolean>> tienePazYSalvo(@PathVariable Long id) {
        return ResponseEntity.ok(
                Map.of("tienePazYSalvo", practicaFacade.tienePazYSalvo(id)));
    }

    // ── Acta de Cierre (Builder Pattern) ───────────────────────────────────────────────────

    @PostMapping("/{id}/acta-cierre")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA_COORDINACION','ESTUDIANTE')")
    public ResponseEntity<?> generarActaCierre(@PathVariable Long id) {
        return ResponseEntity.ok(practicaFacade.generarActaCierre(id));
    }

    // ============================================================================================================
    // Contrato PDF (Adapter / Builder)
    // ============================================================================================================

    @GetMapping("/{id}/contrato/pdf")
    public ResponseEntity<byte[]> descargarContratoPdf(@PathVariable Long id) {
        byte[] pdfContent = practicaFacade.descargarContratoPdf(id);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Contrato_Practica_" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return ResponseEntity.ok().headers(headers).body(pdfContent);
    }
}