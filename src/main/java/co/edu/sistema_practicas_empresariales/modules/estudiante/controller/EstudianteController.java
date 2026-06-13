package co.edu.sistema_practicas_empresariales.modules.estudiante.controller;

import co.edu.sistema_practicas_empresariales.modules.estudiante.dto.*;
import co.edu.sistema_practicas_empresariales.modules.estudiante.service.EstudianteFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controlador REST para el módulo de Gestión de Estudiantes.
 * <p>
 * Facilita operaciones CRUD y flujos de negocio (como evaluación de aptitud)
 * relacionados con los estudiantes de la institución.
 * <p>
 * <b>Roles y Permisos:</b> Registros, actualizaciones y borrados lógicos están
 * restringidos a Administradores y Coordinadores Académicos. Las consultas de 
 * aptitud y listados están disponibles también para Coordinadores de Práctica.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link EstudianteFacade}).
 * Este controlador delega todas las orquestaciones complejas (como la validación
 * de aptitud mediante Chain of Responsibility y Strategy) a su fachada.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/estudiantes")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteFacade estudianteFacade;

    /**
     * Registra un nuevo estudiante en el sistema.
     * Crea automáticamente el usuario asociado con el rol respectivo.
     * Permitido para Administradores y Coordinadores Académicos.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<EstudianteResponse> registrar(@RequestBody EstudianteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estudianteFacade.registrarEstudiante(request));
    }

    /**
     * Registra estudiantes masivamente desde un archivo Excel.
     * Permitido para Administradores y Coordinadores Académicos.
     */
    @PostMapping(value = "/masivo", consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<List<EstudianteResponse>> registrarMasivo(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estudianteFacade.registrarEstudiantesMasivo(file));
    }

    /**
     * Lista todos los estudiantes activos en el sistema.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO', 'COORDINADOR_PRACTICA', 'SECRETARIA_COORDINACION')")
    public ResponseEntity<List<EstudianteResponse>> listarTodos() {
        return ResponseEntity.ok(estudianteFacade.listarTodos());
    }

    /**
     * Obtiene la información de un estudiante por su ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO', 'COORDINADOR_PRACTICA', 'DOCENTE_ASESOR', 'EMPRESA_VINCULADA')")
    public ResponseEntity<EstudianteResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteFacade.obtenerPorId(id));
    }

    /**
     * Obtiene la información de un estudiante filtrando por su Usuario ID asociado.
     */
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO', 'ESTUDIANTE')")
    public ResponseEntity<EstudianteResponse> obtenerPorUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudianteFacade.obtenerPorUsuarioId(usuarioId));
    }

    /**
     * Lista estudiantes filtrados por programa académico.
     */
    @GetMapping("/programa/{programaId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<EstudianteResponse>> listarPorPrograma(@PathVariable Long programaId) {
        return ResponseEntity.ok(estudianteFacade.listarPorPrograma(programaId));
    }

    /**
     * Lista todos los estudiantes cuyo estado de aptitud sea APTO.
     */
    @GetMapping("/aptos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'TUTOR_EMPRESARIAL')")
    public ResponseEntity<List<EstudianteResponse>> listarAptos() {
        return ResponseEntity.ok(estudianteFacade.listarAptos());
    }

    /**
     * Actualiza la información de un estudiante existente.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<EstudianteResponse> actualizar(
            @PathVariable Long id,
            @RequestBody EstudianteRequest request) {
        return ResponseEntity.ok(estudianteFacade.actualizarEstudiante(id, request));
    }

    /**
     * Realiza un borrado lógico (desactivación) de un estudiante en el sistema.
     * Nunca se elimina físicamente para mantener integridad.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        estudianteFacade.eliminarEstudiante(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Ejecuta el motor de reglas (Chain of Responsibility + Strategy) para
     * determinar si el estudiante cumple los requisitos del programa para iniciar práctica.
     */
    @PostMapping("/{estudianteId}/evaluar-aptitud/{numeroPractica}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<EstudianteResponse> evaluarAptitud(
            @PathVariable Long estudianteId,
            @PathVariable int numeroPractica) {
        return ResponseEntity.ok(estudianteFacade.evaluarAptitud(estudianteId, numeroPractica));
    }

    /**
     * Obtiene el historial de prácticas (anteriores y actuales) de un estudiante.
     */
    @GetMapping("/{estudianteId}/practicas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'COORDINADOR_ACADEMICO', 'DOCENTE_ASESOR')")
    public ResponseEntity<List<PracticaResponse>> obtenerHistorialPracticas(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(estudianteFacade.obtenerHistorialPracticas(estudianteId));
    }

    /**
     * Reactiva un estudiante previamente desactivado.
     */
    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_ACADEMICO')")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        estudianteFacade.activarEstudiante(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista estudiantes con información de clasificación (aptitud, práctica activa,
     * docente y empresa asignados). Usado por coordinación académica.
     */
    @GetMapping("/clasificacion")
    public ResponseEntity<List<EstudianteClasificacionDto>> listarParaClasificacion() {
        return ResponseEntity.ok(estudianteFacade.listarParaClasificacion());
    }

    /**
     * Actualiza manualmente el estado de aptitud de un estudiante
     * (override de coordinación académica).
     */
    @PatchMapping("/{id}/aptitud")
    public ResponseEntity<EstudianteResponse> actualizarAptitudManual(
            @PathVariable Long id,
            @RequestBody AptitudManualRequest request) {
        return ResponseEntity.ok(estudianteFacade.actualizarAptitudManual(id, request.getEstadoAptitud()));
    }

    /**
     * Lista estudiantes de los programas asignados al coordinador autenticado.
     * Incluye solo APTOS o EN_PRACTICA (ya clasificados por el coordinador).
     */
    @GetMapping("/por-coordinador")
    @PreAuthorize("hasAnyRole('COORDINADOR_PRACTICA', 'ADMINISTRADOR')")
    public ResponseEntity<List<EstudianteResponse>> listarPorCoordinador(
            @org.springframework.security.core.annotation.AuthenticationPrincipal
            org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity.ok(estudianteFacade.listarPorCoordinadorPractica(userDetails.getUsername()));
    }
}
