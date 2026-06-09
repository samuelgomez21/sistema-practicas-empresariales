package co.edu.sistema_practicas_empresariales.modules.documento.controller;

import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoCreateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoResponse;
import co.edu.sistema_practicas_empresariales.modules.documento.service.DocumentoFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Controlador REST para la gestión de documentos.
 * Todas las operaciones utilizan soft‑delete; nunca se elimina físicamente un registro.
 * <p>
 * <b>Roles y Permisos:</b> Solo Coordinadores o Administradores pueden gestionar documentos a nivel general.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link DocumentoFacade}).
 */
@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoFacade documentoFacade;

    /**
     * Crea un nuevo documento en el sistema.
     * Permitido para Administradores y Coordinadores de Práctica.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<DocumentoResponse> crear(@RequestBody DocumentoCreateDto dto) {
        DocumentoResponse resp = documentoFacade.crearDocumento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    /**
     * Obtiene un documento por su id.
     * Permitido para Administradores, Coordinadores, Estudiantes y Empresas.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA', 'ESTUDIANTE', 'TUTOR_EMPRESARIAL')")
    public ResponseEntity<DocumentoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(documentoFacade.obtenerDocumento(id));
    }

    /**
     * Actualiza los campos de un documento existente.
     * Permitido para Administradores y Coordinadores de Práctica.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<DocumentoResponse> actualizar(@PathVariable Long id,
                                                         @RequestBody DocumentoUpdateDto dto) {
        return ResponseEntity.ok(documentoFacade.actualizarDocumento(id, dto));
    }

    /**
     * Realiza un soft‑delete de un documento.
     * Permitido para Administradores y Coordinadores de Práctica.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        documentoFacade.softDeleteDocumento(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista todos los documentos no eliminados en el sistema.
     * Permitido para Administradores y Coordinadores de Práctica.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<List<DocumentoResponse>> listarTodos() {
        return ResponseEntity.ok(documentoFacade.listarTodos());
    }
}
