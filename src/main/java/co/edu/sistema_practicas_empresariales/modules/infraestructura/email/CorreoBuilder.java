package co.edu.sistema_practicas_empresariales.modules.infraestructura.email;

import java.util.HashMap;
import java.util.Map;

public class CorreoBuilder {
    private String destinatario;
    private String asunto;
    private String cuerpoHtml;
    private final Map<String, Object> variables = new HashMap<>();

    public CorreoBuilder destinatario(String destinatario) {
        this.destinatario = destinatario;
        return this;
    }

    public CorreoBuilder asunto(String asunto) {
        this.asunto = asunto;
        return this;
    }

    public CorreoBuilder cuerpoHtml(String cuerpoHtml) {
        this.cuerpoHtml = cuerpoHtml;
        return this;
    }

    public CorreoBuilder variable(String clave, Object valor) {
        this.variables.put(clave, valor);
        return this;
    }

    public String buildHtml() {
        if (cuerpoHtml != null) {
            return cuerpoHtml;
        }
        
        // Simple HTML template renderer replacing {{variable}} with value
        String template = "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>" +
                "<h2 style='color: #1F4E79; border-bottom: 2px solid #1F4E79; padding-bottom: 10px;'>{{asunto}}</h2>" +
                "<p>{{mensaje}}</p>" +
                "<div style='margin-top: 20px; font-size: 0.9em; color: #777; border-top: 1px solid #eee; padding-top: 10px;'>" +
                "Este es un correo automático generado por el Sistema de Prácticas Empresariales. Por favor, no respondas a este mensaje." +
                "</div></div></body></html>";
                
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String valStr = entry.getValue() != null ? entry.getValue().toString() : "";
            template = template.replace("{{" + entry.getKey() + "}}", valStr);
        }
        return template;
    }

    public void enviar(EmailService emailService) {
        emailService.enviarCorreo(this.destinatario, this.asunto, buildHtml());
    }
}
