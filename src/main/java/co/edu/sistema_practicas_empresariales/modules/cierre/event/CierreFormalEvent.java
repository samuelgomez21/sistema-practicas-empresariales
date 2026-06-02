package co.edu.sistema_practicas_empresariales.modules.cierre.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CierreFormalEvent {
    private final Long practicaId;
    private final String resultado;
    private final String coordinadorEmail;
}
