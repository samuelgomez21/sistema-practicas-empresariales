package co.edu.sistema_practicas_empresariales.modules.documento.service;

import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoCreateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoResponse;
import java.util.List;

/**
 * Fachada (service) para la gestión de documentos.
 * - Operaciones CRUD con soft‑delete.
 * - Aplica principios SOLID y patrón Facade.
 */
public interface DocumentoFacade {

    /**
     * Crea un nuevo documento.
     */
    DocumentoResponse crearDocumento(DocumentoCreateDto dto);

    /**
     * Actualiza un documento existente.
     */
    DocumentoResponse actualizarDocumento(Long id, DocumentoUpdateDto dto);

    /**
     * Elimina lógicamente (soft‑delete) un documento.
     */
    void softDeleteDocumento(Long id);

    /**
     * Obtiene un documento por su identificador.
     */
    DocumentoResponse obtenerDocumento(Long id);

    /**
     * Lista todos los documentos que no están eliminados.
     */
    List<DocumentoResponse> listarTodos();
}
