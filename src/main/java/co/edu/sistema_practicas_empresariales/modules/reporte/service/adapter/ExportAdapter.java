package co.edu.sistema_practicas_empresariales.modules.reporte.service.adapter;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.Reporte;

public interface ExportAdapter {
    byte[] exportar(Reporte reporte);
    String getExtension();
    String getContentType();
}
