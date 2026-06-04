package co.edu.sistema_practicas_empresariales.modules.practica.state;

public class EstadoPracticaResolver {

    public static EstadoPractica getEstado(EstadoPracticaTipo tipo) {
        if (tipo == null) {
            return new EstadoAsignada();
        }
        switch (tipo) {
            case ASIGNADA_PENDIENTE_INICIO:
                return new EstadoAsignada();
            case EN_PROCESO_VINCULACION:
                return new EstadoEnProcesoVinculacion();
            case VINCULADA:
                return new EstadoVinculada();
            case EN_PRACTICA:
                return new EstadoEnPractica();
            case COMPLETADA:
                return new EstadoCompletada();
            case REPROBADA:
                return new EstadoReprobada();
            case CANCELADA:
                return new EstadoCancelada();
            default:
                throw new IllegalArgumentException("Estado de práctica no soportado: " + tipo);
        }
    }
}
