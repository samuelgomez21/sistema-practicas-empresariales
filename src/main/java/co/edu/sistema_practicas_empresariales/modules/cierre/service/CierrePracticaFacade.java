package co.edu.sistema_practicas_empresariales.modules.cierre.service;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDetalleDto;

public interface CierrePracticaFacade {
    PracticaDetalleDto cerrarPractica(Long practicaId);
}
