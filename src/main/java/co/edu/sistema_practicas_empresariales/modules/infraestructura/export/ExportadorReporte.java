package co.edu.sistema_practicas_empresariales.modules.infraestructura.export;

import co.edu.sistema_practicas_empresariales.modules.reporte.builder.ReporteBuilder.Reporte;

public interface ExportadorReporte {
    byte[] exportar(Reporte reporte);
}
