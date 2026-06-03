package co.edu.sistema_practicas_empresariales.modules.documento.service;

import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoCreateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoUpdateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoResponse;
import co.edu.sistema_practicas_empresariales.modules.documento.model.Documento;
import co.edu.sistema_practicas_empresariales.modules.documento.repository.DocumentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del facade para la gestión de documentos.
 * - Todas las operaciones respetan el patrón de soft‑delete.
 * - Se aplican los principios SOLID: SRP (cada método una única responsabilidad),
 *   DIP (inyección de dependencias) y LSP (las sub‑clases cumplen el contrato de la interfaz).
 */
@Service
@RequiredArgsConstructor
public class DocumentoFacadeImpl implements DocumentoFacade {

    private final DocumentoRepository documentoRepository;

    @Override
    @Transactional
    public DocumentoResponse crearDocumento(DocumentoCreateDto dto) {
        Documento documento = Documento.builder()
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .build();
        documento = documentoRepository.save(documento);
        return mapToResponse(documento);
    }

    @Override
    @Transactional
    public DocumentoResponse actualizarDocumento(Long id, DocumentoUpdateDto dto) {
        Documento documento = documentoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado o eliminado"));
        if (dto.getTitulo() != null) {
            documento.setTitulo(dto.getTitulo());
        }
        if (dto.getDescripcion() != null) {
            documento.setDescripcion(dto.getDescripcion());
        }
        documento = documentoRepository.save(documento);
        return mapToResponse(documento);
    }

    @Override
    @Transactional
    public void softDeleteDocumento(Long id) {
        // Verificar existencia antes de marcar eliminado
        documentoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado o ya eliminado"));
        documentoRepository.softDelete(id);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentoResponse obtenerDocumento(Long id) {
        Documento documento = documentoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado o eliminado"));
        return mapToResponse(documento);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoResponse> listarTodos() {
        return documentoRepository.findAllByEliminadoFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DocumentoResponse mapToResponse(Documento d) {
        return DocumentoResponse.builder()
                .id(d.getId())
                .titulo(d.getTitulo())
                .descripcion(d.getDescripcion())
                .fechaCreacion(d.getFechaCreacion())
                .fechaActualizacion(d.getFechaActualizacion())
                .build();
    }
}
