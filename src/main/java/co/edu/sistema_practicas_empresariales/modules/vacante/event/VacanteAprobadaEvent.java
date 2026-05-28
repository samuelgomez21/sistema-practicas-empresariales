package co.edu.sistema_practicas_empresariales.modules.vacante.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VacanteAprobadaEvent {
    private final Long vacanteId;
    private final Long empresaId;
}
