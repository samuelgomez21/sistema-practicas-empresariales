package co.edu.sistema_practicas_empresariales.modules.empresa.state;

import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class EstadoVacanteFactory {

    private final Map<EstadoVacanteTipo, EstadoVacante> estadosMap = new EnumMap<>(EstadoVacanteTipo.class);

    public EstadoVacanteFactory(List<EstadoVacante> estados) {
        for (EstadoVacante estado : estados) {
            estadosMap.put(estado.getTipo(), estado);
        }
    }

    public EstadoVacante getEstado(EstadoVacanteTipo tipo) {
        EstadoVacante estado = estadosMap.get(tipo);
        if (estado == null) {
            throw new IllegalArgumentException("Estado de vacante no soportado: " + tipo);
        }
        return estado;
    }
}
