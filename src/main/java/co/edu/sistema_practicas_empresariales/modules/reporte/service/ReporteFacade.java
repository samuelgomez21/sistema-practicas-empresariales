package co.edu.sistema_practicas_empresariales.modules.reporte.service;

import co.edu.sistema_practicas_empresariales.modules.reporte.dto.*;
import java.util.List;

public interface ReporteFacade {
    List<ReporteEstadoProcesoDto> reporteEstadoProceso(
            Long programaId, Long facultadId, String periodo, Integer numeroPractica);

    List<ReporteNotasDto> reporteNotas(
            Long programaId, String periodo, Long docenteId, Long empresaId, String resultado);

    List<ReporteEmpresaVacanteDto> reporteEmpresasVacantes(
            String sector, Long programaId, String periodo);

    ReporteEncuestasDto reporteEncuestas(Long programaId, String periodo, String tipo);
}