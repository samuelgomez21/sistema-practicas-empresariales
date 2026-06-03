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

/**
 * Controlador REST para la gestión de documentos.
 * Todas las operaciones utilizan soft‑delete; nunca se elimina físicamente un registro.
 */
@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoFacade documentoFacade;

    /**
     * Crea un nuevo documento.
     */
    @PostMapping
    public ResponseEntity<DocumentoResponse> crear(@RequestBody DocumentoCreateDto dto) {
        DocumentoResponse resp = documentoFacade.crearDocumento(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    /**
     * Obtiene un documento por su id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(documentoFacade.obtenerDocumento(id));
    }

    /**
     * Actualiza los campos de un documento existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DocumentoResponse> actualizar(@PathVariable Long id,
                                                         @RequestBody DocumentoUpdateDto dto) {
        return ResponseEntity.ok(documentoFacade.actualizarDocumento(id, dto));
    }

    /**
     * Soft‑delete de un documento.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        documentoFacade.softDeleteDocumento(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista todos los documentos no eliminados.
     */
    @GetMapping
    public ResponseEntity<List<DocumentoResponse>> listarTodos() {
        return ResponseEntity.ok(documentoFacade.listarTodos());
    }
}
