package co.edu.sistema_practicas_empresariales.modules.cierre.facade;

import co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDetalleDto;

/**
 * Patrn Facade: Coordina los servicios relacionados con el cierre formal de una prǭctica.
 */
public interface CierrePracticaFacade {
    PracticaDetalleDto ejecutarCierre(Long practicaId);
}
