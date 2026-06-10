package co.edu.sistema_practicas_empresariales.modules.vinculacion.event;

/**
 * Evento disparado (Observer Pattern) cuando una vinculación cambia su estado a APROBADA.
 */
public record VinculacionAprobadaEvent(Long vinculacionId) {}
