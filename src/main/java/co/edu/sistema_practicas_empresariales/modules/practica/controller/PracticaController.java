package co.edu.sistema_practicas_empresariales.modules.practica.controller;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.*;
import co.edu.sistema_practicas_empresariales.modules.practica.request.AsignarDocenteRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.FechaSustentacionRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.request.NotaFinalRequest;
import co.edu.sistema_practicas_empresariales.modules.practica.service.PracticaService;
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

@RestController
@RequestMapping("/api/practicas")
@RequiredArgsConstructor
public class PracticaController {

    private final PracticaService practicaService;

    // ── Listados ────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINACION_ACADEMICA','COORDINADOR_PRACTICA','SECRETARIA')")
    public ResponseEntity<List<PracticaResumenDto>> listarTodas() {
        return ResponseEntity.ok(practicaService.listarTodas());
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','SECRETARIA')")
    public ResponseEntity<List<PracticaResumenDto>> listarPorEstado(
            @PathVariable EstadoPracticaTipo estado) {
        return ResponseEntity.ok(practicaService.listarPorEstado(estado));
    }

    @GetMapping("/docente/{docenteId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINACION_ACADEMICA','DOCENTE_ASESOR')")
    public ResponseEntity<List<PracticaResumenDto>> listarPorDocente(
            @PathVariable Long docenteId) {
        return ResponseEntity.ok(practicaService.listarPorDocente(docenteId));
    }

    @GetMapping("/estudiante/{estudianteId}/activa")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','ESTUDIANTE','EMPRESA_VINCULADA')")
    public ResponseEntity<PracticaDetalleDto> practicaActivaEstudiante(
            @PathVariable Long estudianteId) {
        return ResponseEntity.ok(
                practicaService.obtenerPracticaActivaEstudiante(estudianteId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINACION_ACADEMICA','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA','ESTUDIANTE','EMPRESA_VINCULADA','TUTOR_EMPRESARIAL')")
    public ResponseEntity<PracticaDetalleDto> detalle(@PathVariable Long id) {
        return ResponseEntity.ok(practicaService.obtenerDetalle(id));
    }

    // ── Creación automática ─────────────────────────────────────────

    @PostMapping("/crear-automatica")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINACION_ACADEMICA')")
    public ResponseEntity<PracticaDetalleDto> crearAutomatica(
            @RequestParam Long estudianteId,
            @RequestParam Long catalogoId) {
        return ResponseEntity.ok(
                practicaService.crearPracticaAutomatica(estudianteId, catalogoId));
    }

    // ── Transiciones de estado ──────────────────────────────────────

    @PatchMapping("/{id}/iniciar-vinculacion")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> iniciarVinculacion(@PathVariable Long id) {
        return ResponseEntity.ok(practicaService.iniciarVinculacion(id));
    }

    @PatchMapping("/{id}/registrar-convenio")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> registrarConvenio(@PathVariable Long id) {
        return ResponseEntity.ok(practicaService.registrarConvenio(id));
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> activar(@PathVariable Long id) {
        return ResponseEntity.ok(practicaService.activarPractica(id));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> cancelar(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        return ResponseEntity.ok(practicaService.cancelar(id, motivo));
    }

    // ── Asignaciones ────────────────────────────────────────────────

    @PatchMapping("/{id}/asignar-docente")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINACION_ACADEMICA')")
    public ResponseEntity<PracticaDetalleDto> asignarDocente(
            @PathVariable Long id,
            @RequestBody @Valid AsignarDocenteRequest req) {
        return ResponseEntity.ok(practicaService.asignarDocente(id, req.getDocenteId()));
    }

    @PatchMapping("/{id}/asignar-empresa")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> asignarEmpresa(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(practicaService.asignarEmpresa(id, body.get("empresaId")));
    }

    @PatchMapping("/{id}/asignar-tutor")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','EMPRESA_VINCULADA')")
    public ResponseEntity<PracticaDetalleDto> asignarTutor(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(practicaService.asignarTutor(id, body.get("tutorId")));
    }

    @PatchMapping("/{id}/fecha-sustentacion")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','ESTUDIANTE')")
    public ResponseEntity<PracticaDetalleDto> fechaSustentacion(
            @PathVariable Long id,
            @RequestBody @Valid FechaSustentacionRequest req) {
        return ResponseEntity.ok(practicaService.registrarFechaSustentacion(id, req));
    }

    // ── Documentos ──────────────────────────────────────────────────

    @PostMapping(value = "/{id}/documentos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','ESTUDIANTE')")
    public ResponseEntity<PracticaDetalleDto> subirDocumento(
            @PathVariable Long id,
            @RequestParam String categoria,
            @RequestPart("archivo") MultipartFile archivo,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                practicaService.subirDocumento(id, categoria, archivo, userDetails.getUsername()));
    }

    // ── Nota final ──────────────────────────────────────────────────

    @PatchMapping("/{id}/nota-final")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR')")
    public ResponseEntity<PracticaDetalleDto> notaFinal(
            @PathVariable Long id,
            @RequestBody @Valid NotaFinalRequest req) {
        return ResponseEntity.ok(practicaService.registrarNotaFinal(id, req));
    }

    // ── Checklist ───────────────────────────────────────────────────

    @GetMapping("/{id}/checklist")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','DOCENTE_ASESOR','SECRETARIA','ESTUDIANTE')")
    public ResponseEntity<List<ChecklistDto>> checklist(@PathVariable Long id) {
        return ResponseEntity.ok(practicaService.obtenerChecklist(id));
    }

    @GetMapping("/{id}/paz-y-salvo")
    public ResponseEntity<Map<String, Boolean>> tienePazYSalvo(@PathVariable Long id) {
        return ResponseEntity.ok(
                Map.of("tienePazYSalvo", practicaService.tienePazYSalvo(id)));
    }
}