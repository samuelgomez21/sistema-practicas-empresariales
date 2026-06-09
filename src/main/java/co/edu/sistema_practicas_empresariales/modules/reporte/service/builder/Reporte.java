package co.edu.sistema_practicas_empresariales.modules.reporte.service.builder;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
public class Reporte {
    private String titulo;
    private LocalDateTime fechaGeneracion;
    private String generadoPor;
    private List<String> columnas;
    private List<Map<String, Object>> filas;

    Reporte(String titulo, LocalDateTime fechaGeneracion, String generadoPor, List<String> columnas, List<Map<String, Object>> filas) {
        this.titulo = titulo;
        this.fechaGeneracion = fechaGeneracion;
        this.generadoPor = generadoPor;
        this.columnas = columnas;
        this.filas = filas;
    }
}
