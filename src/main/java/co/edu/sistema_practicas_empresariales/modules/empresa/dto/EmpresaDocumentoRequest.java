// EmpresaDocumentoRequest.java
package co.edu.sistema_practicas_empresariales.modules.empresa.dto;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmpresaDocumentoRequest {
    private String    tipo;          // CAMARA_COMERCIO | NIT | CEDULA_RL | CONVENIO
    private String    url;
    private String    nombreArchivo;
    private LocalDate fechaVigencia; // opcional
}