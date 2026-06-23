package co.edu.sistema_practicas_empresariales.modules.infraestructura.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SmtpEmailAdapter implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(SmtpEmailAdapter.class);

    public SmtpEmailAdapter() {
    }

    @Override
    public void enviarCorreo(String destinatario, String asunto, String cuerpoHtml) {
        logger.info("Enviando correo a: {}, Asunto: {}", destinatario, asunto);
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String url = "https://script.google.com/macros/s/AKfycbzCCShRG98o6L17kw_3cWp9mYNhIujJXKUZlPeZMCt57W2dZ4S_hVuEq8t9zfDYO1U3pQ/exec";
            
            java.util.Map<String, String> payload = new java.util.HashMap<>();
            payload.put("to", destinatario);
            payload.put("subject", asunto);
            payload.put("htmlBody", cuerpoHtml);

            org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(url, payload, String.class);
            logger.info("Correo enviado a {} vía Google Apps Script HTTP bridge. Status: {}", destinatario, response.getStatusCode());
        } catch (Exception e) {
            logger.error("Error al enviar el correo a {}: {}", destinatario, e.getMessage(), e);
        }
    }
}
