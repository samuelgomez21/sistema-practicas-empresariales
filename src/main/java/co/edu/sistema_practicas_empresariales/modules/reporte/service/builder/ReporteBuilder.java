package co.edu.sistema_practicas_empresariales.modules.reporte.service.builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ReporteBuilder {
    private String titulo;
    private LocalDateTime fechaGeneracion = LocalDateTime.now();
    private String generadoPor;
    private List<String> columnas;
    private List<Map<String, Object>> filas;

    public ReporteBuilder conTitulo(String titulo) {
        this.titulo = titulo;
        return this;
    }

    public ReporteBuilder generadoPor(String usuario) {
        this.generadoPor = usuario;
        return this;
    }

    public ReporteBuilder conColumnas(List<String> columnas) {
        this.columnas = columnas;
        return this;
    }

    public ReporteBuilder conFilas(List<Map<String, Object>> filas) {
        this.filas = filas;
        return this;
    }

    public Reporte construir() {
        if (titulo == null || columnas == null || filas == null) {
            throw new IllegalStateException("Faltan datos obligatorios para construir el reporte.");
        }
        return new Reporte(titulo, fechaGeneracion, generadoPor, columnas, filas);
    }
}
