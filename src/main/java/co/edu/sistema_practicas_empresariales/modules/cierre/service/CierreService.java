package co.edu.sistema_practicas_empresariales.modules.cierre.service;

import co.edu.sistema_practicas_empresariales.modules.cierre.dto.CierreDto;

public interface CierreService {
    CierreDto ejecutarCierre(Long practicaId);
    CierreDto verificarEstadoCierre(Long practicaId);

}
