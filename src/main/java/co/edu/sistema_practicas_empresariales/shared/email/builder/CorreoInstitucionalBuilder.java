package co.edu.sistema_practicas_empresariales.shared.email.builder;

import java.util.ArrayList;
import java.util.List;

/**
 * Patrón Builder: Se usa para construir el objeto complejo CorreoInstitucional.
 */
public class CorreoInstitucionalBuilder {
    private String destinatario;
    private String copia;
    private String asunto;
    private String cuerpoHtml;
    private List<String> adjuntos = new ArrayList<>();

    public CorreoInstitucionalBuilder destinatario(String destinatario) {
        this.destinatario = destinatario;
        return this;
    }

    public CorreoInstitucionalBuilder conCopia(String copia) {
        this.copia = copia;
        return this;
    }

    public CorreoInstitucionalBuilder asunto(String asunto) {
        this.asunto = asunto;
        return this;
    }

    public CorreoInstitucionalBuilder cuerpoHtml(String cuerpoHtml) {
        this.cuerpoHtml = cuerpoHtml;
        return this;
    }

    public CorreoInstitucionalBuilder adjuntar(String urlAdjunto) {
        this.adjuntos.add(urlAdjunto);
        return this;
    }

    public CorreoInstitucional build() {
        if (destinatario == null || destinatario.isEmpty()) {
            throw new IllegalArgumentException("El destinatario es obligatorio");
        }
        if (asunto == null || asunto.isEmpty()) {
            throw new IllegalArgumentException("El asunto es obligatorio");
        }
        return new CorreoInstitucional(destinatario, copia, asunto, cuerpoHtml, adjuntos);
    }
}
