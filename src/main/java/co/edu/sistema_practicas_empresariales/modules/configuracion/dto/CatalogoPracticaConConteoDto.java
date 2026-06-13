package co.edu.sistema_practicas_empresariales.modules.configuracion.dto;

import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogoPracticaConConteoDto {
    private Long id;
    private int numeroPractica;
    private String nombre;
    private String materiaNucleo;
    private String materiaNucleoCodigo;
    private String descripcion;
    private Long programaId;
    private String nombrePrograma;
    private int cortesPorPractica;
    private int duracionSemanas;
    private boolean activo;
    private String documentosRequeridos;
    private LocalDateTime fechaCreacion;
    private long practicasActivas;

    public static CatalogoPracticaConConteoDto from(CatalogoPractica c, long practicasActivas) {
        return CatalogoPracticaConConteoDto.builder()
                .id(c.getId())
                .numeroPractica(c.getNumeroPractica())
                .nombre(c.getNombre())
                .materiaNucleo(c.getMateriaNucleo())
                .materiaNucleoCodigo(c.getMateriaNucleoCodigo())
                .descripcion(c.getDescripcion())
                .programaId(c.getPrograma().getId())
                .nombrePrograma(c.getPrograma().getNombre())
                .cortesPorPractica(c.getCortesPorPractica())
                .duracionSemanas(c.getDuracionSemanas())
                .activo(c.isActivo())
                .documentosRequeridos(c.getDocumentosRequeridos())
                .fechaCreacion(c.getFechaCreacion())
                .practicasActivas(practicasActivas)
                .build();
    }
}