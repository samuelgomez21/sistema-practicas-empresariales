package co.edu.sistema_practicas_empresariales.modules.documento.service;

import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoCreateDto;
import co.edu.sistema_practicas_empresariales.modules.documento.dto.DocumentoResponse;
import co.edu.sistema_practicas_empresariales.modules.documento.model.Documento;
import co.edu.sistema_practicas_empresariales.modules.documento.repository.DocumentoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DocumentoFacadeImplTest {

    @Mock
    private DocumentoRepository documentoRepository;

    @InjectMocks
    private DocumentoFacadeImpl documentoFacade;

    @Test
    void crearDocumento_ShouldSaveAndReturnResponse() {
        DocumentoCreateDto dto = new DocumentoCreateDto();
        dto.setTitulo("Contrato ARL");
        dto.setDescripcion("Contrato inicial");
        
        when(documentoRepository.save(any(Documento.class))).thenAnswer(i -> {
            Documento d = i.getArgument(0);
            d.setId(1L);
            return d;
        });

        DocumentoResponse result = documentoFacade.crearDocumento(dto);

        assertNotNull(result);
        assertEquals("Contrato ARL", result.getTitulo());
        verify(documentoRepository).save(any(Documento.class));
    }

    @Test
    void softDeleteDocumento_ShouldCallSoftDelete() {
        Documento doc = new Documento();
        doc.setId(1L);
        when(documentoRepository.findByIdAndEliminadoFalse(1L)).thenReturn(Optional.of(doc));

        documentoFacade.softDeleteDocumento(1L);

        verify(documentoRepository).softDelete(1L);
    }
}
