package co.edu.sistema_practicas_empresariales.modules.practica.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PracticaDocumentoDto {
    private Long          id;
    private String        nombre;
    private String        url;
    private String        categoria;
    private LocalDateTime fechaCarga;
    private String        cargadoPorEmail;
    private String        estado;
}