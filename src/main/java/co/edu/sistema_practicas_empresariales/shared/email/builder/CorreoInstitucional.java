package co.edu.sistema_practicas_empresariales.shared.email.builder;

import lombok.Getter;
import java.util.List;

@Getter
public class CorreoInstitucional {
    private final String destinatario;
    private final String copia;
    private final String asunto;
    private final String cuerpoHtml;
    private final List<String> adjuntos;

    // Solo accesible por el Builder
    protected CorreoInstitucional(String destinatario, String copia, String asunto, String cuerpoHtml, List<String> adjuntos) {
        this.destinatario = destinatario;
        this.copia = copia;
        this.asunto = asunto;
        this.cuerpoHtml = cuerpoHtml;
        this.adjuntos = adjuntos;
    }
}
