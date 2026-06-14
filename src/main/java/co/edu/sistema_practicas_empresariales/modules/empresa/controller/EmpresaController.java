package co.edu.sistema_practicas_empresariales.modules.empresa.controller;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.*;
import co.edu.sistema_practicas_empresariales.modules.empresa.service.EmpresaFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para el módulo de Gestión de Empresas y Tutores.
 * <p>
 * Facilita operaciones CRUD de empresas aliadas y tutores empresariales.
 * <p>
 * <b>Roles y Permisos:</b> Administradores y Coordinadores de Práctica pueden gestionar 
 * (crear, editar, eliminar) empresas y tutores. Las empresas vinculadas pueden ver sus 
 * datos. Los estudiantes pueden consultar empresas.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link EmpresaFacade}).
 * Delega toda la lógica de negocio, validación y control transaccional a la fachada.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaFacade empresaFacade;

    /**
     * Registra una nueva empresa en el sistema.
     * Crea automáticamente el usuario asociado para el contacto principal.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<EmpresaResponse> registrarEmpresa(@RequestBody EmpresaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaFacade.registrarEmpresa(request));
    }

    /**
     * Lista todas las empresas activas en el sistema.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'ESTUDIANTE', 'COORDINADOR_ACADEMICO', 'DOCENTE_ASESOR')")
    public ResponseEntity<List<EmpresaResponse>> listarTodas() {
        return ResponseEntity.ok(empresaFacade.listarTodas());
    }

    /**
     * Obtiene la información de una empresa por su ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'ESTUDIANTE', 'TUTOR_EMPRESARIAL','EMPRESA_VINCULADA')")
    public ResponseEntity<EmpresaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(empresaFacade.obtenerPorId(id));
    }

    /**
     * Actualiza la información de una empresa existente.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'TUTOR_EMPRESARIAL', 'EMPRESA_VINCULADA')")
    public ResponseEntity<EmpresaResponse> actualizarEmpresa(
            @PathVariable Long id,
            @RequestBody EmpresaRequest request) {
        return ResponseEntity.ok(empresaFacade.actualizarEmpresa(id, request));
    }

    /**
     * Realiza un borrado lógico (desactivación) de una empresa en el sistema.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable Long id) {
        empresaFacade.eliminarEmpresa(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Registra un nuevo tutor asociado a una empresa específica.
     */
    @PostMapping("/{empresaId}/tutores")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA','EMPRESA_VINCULADA')")
    public ResponseEntity<TutorEmpresarialResponse> registrarTutor(
            @PathVariable Long empresaId,
            @RequestBody TutorEmpresarialRequest request) {
        request.setEmpresaId(empresaId);
        return ResponseEntity.status(HttpStatus.CREATED).body(empresaFacade.registrarTutor(request));
    }

    /**
     * Lista los tutores activos de una empresa.
     */
    @GetMapping("/{empresaId}/tutores")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'TUTOR_EMPRESARIAL','EMPRESA_VINCULADA')")
    public ResponseEntity<List<TutorEmpresarialResponse>> listarTutores(@PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaFacade.listarTutoresPorEmpresa(empresaId));
    }

    /**
     * Realiza un borrado lógico (desactivación) de un tutor en el sistema.
     */
    @DeleteMapping("/tutores/{tutorId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'TUTOR_EMPRESARIAL','EMPRESA_VINCULADA')")
    public ResponseEntity<Void> eliminarTutor(@PathVariable Long tutorId) {
        empresaFacade.eliminarTutor(tutorId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Perfil de la empresa del usuario autenticado (rol EMPRESA_VINCULADA).
     */
    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('EMPRESA_VINCULADA')")
    public ResponseEntity<EmpresaResponse> miPerfil(
            @org.springframework.security.core.annotation.AuthenticationPrincipal
            org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity.ok(empresaFacade.obtenerPorUsuarioEmail(userDetails.getUsername()));
    }

    /**
     * Actualiza los datos de un tutor existente.
     */
    @PutMapping("/tutores/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'EMPRESA_VINCULADA')")
    public ResponseEntity<TutorEmpresarialResponse> actualizarTutor(
            @PathVariable Long id,
            @RequestBody TutorEmpresarialRequest request) {
        return ResponseEntity.ok(empresaFacade.actualizarTutor(id, request));
    }

    /**
     * Reactiva un tutor previamente desactivado.
     */
    @PatchMapping("/tutores/{id}/activar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'EMPRESA_VINCULADA')")
    public ResponseEntity<Void> activarTutor(@PathVariable Long id) {
        empresaFacade.activarTutor(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista todos los tutores activos del sistema (todas las empresas).
     */
    @GetMapping("/tutores/todos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'EMPRESA_VINCULADA', 'TUTOR_EMPRESARIAL')")
    public ResponseEntity<List<TutorEmpresarialResponse>> listarTodosLosTutores() {
        return ResponseEntity.ok(empresaFacade.listarTodosLosTutores());
    }

    /**
     * Lista los documentos de una empresa.
     */
    @GetMapping("/{empresaId}/documentos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','EMPRESA_VINCULADA')")
    public ResponseEntity<List<EmpresaDocumentoResponse>> listarDocumentos(
            @PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaFacade.listarDocumentos(empresaId));
    }

    /**
     * Guarda o reemplaza un documento de empresa (la URL viene del frontend tras subir a Cloudinary).
     */
    @PostMapping("/{empresaId}/documentos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA','EMPRESA_VINCULADA')")
    public ResponseEntity<EmpresaDocumentoResponse> guardarDocumento(
            @PathVariable Long empresaId,
            @RequestBody EmpresaDocumentoRequest request) {
        return ResponseEntity.ok(empresaFacade.guardarDocumento(empresaId, request));
    }

    /**
     * Lista todos los documentos de todas las empresas — para coordinador.
     */
    @GetMapping("/documentos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','COORDINADOR_PRACTICA')")
    public ResponseEntity<List<EmpresaDocumentoResponse>> listarTodosLosDocumentos() {
        return ResponseEntity.ok(empresaFacade.listarTodosLosDocumentos());
    }
}
