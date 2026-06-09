package co.edu.sistema_practicas_empresariales.modules.vinculacion.event;

/**
 * Evento disparado (Observer Pattern) cuando se crea una nueva vinculación.
 */
public record VinculacionCreadaEvent(Long vinculacionId, Long vacanteId) {}
