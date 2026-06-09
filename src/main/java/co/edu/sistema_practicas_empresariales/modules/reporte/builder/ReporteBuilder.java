package co.edu.sistema_practicas_empresariales.modules.reporte.builder;

import lombok.Data;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ReporteBuilder {

    private final Reporte reporte = new Reporte();

    public ReporteBuilder(String titulo) {
        reporte.setTitulo(titulo);
        reporte.setHeaders(new ArrayList<>());
        reporte.setFilas(new ArrayList<>());
        reporte.setFiltros(new LinkedHashMap<>());
        reporte.setTotales(new ArrayList<>());
    }

    public ReporteBuilder header(String header) {
        reporte.getHeaders().add(header);
        return this;
    }

    public ReporteBuilder headers(List<String> headers) {
        reporte.getHeaders().addAll(headers);
        return this;
    }

    public ReporteBuilder filtro(String clave, String valor) {
        reporte.getFiltros().put(clave, valor);
        return this;
    }

    public ReporteBuilder fila(List<Object> fila) {
        reporte.getFilas().add(fila);
        return this;
    }

    public ReporteBuilder total(Object total) {
        reporte.getTotales().add(total);
        return this;
    }

    public ReporteBuilder totales(List<Object> totales) {
        reporte.getTotales().addAll(totales);
        return this;
    }

    public Reporte build() {
        return this.reporte;
    }

    @Data
    public static class Reporte {
        private String titulo;
        private List<String> headers;
        private List<List<Object>> filas;
        private Map<String, String> filtros;
        private List<Object> totales;
    }
}
