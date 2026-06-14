// EmpresaDocumentoResponse.java
package co.edu.sistema_practicas_empresariales.modules.empresa.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmpresaDocumentoResponse {
    private Long          id;
    private String        tipo;
    private String        url;
    private String        nombreArchivo;
    private LocalDate     fechaVigencia;
    private LocalDateTime fechaCarga;
}