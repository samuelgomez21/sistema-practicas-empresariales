package co.edu.sistema_practicas_empresariales.modules.reporte.service;

import co.edu.sistema_practicas_empresariales.modules.reporte.service.builder.Reporte;

public interface ReportesIndicadoresFacade {
    Reporte generarReportePracticas(String formato);
    byte[] exportarReporte(Reporte reporte, String formato);
    String getContentType(String formato);
}
