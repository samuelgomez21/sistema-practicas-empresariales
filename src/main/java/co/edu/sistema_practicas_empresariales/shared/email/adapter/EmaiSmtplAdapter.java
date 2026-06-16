package co.edu.sistema_practicas_empresariales.shared.email.adapter;

import co.edu.sistema_practicas_empresariales.shared.email.builder.CorreoInstitucional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Patrón Adapter: Conecta servicios externos como correos SMTP con la interfaz interna.
 */
@Service
@Slf4j
public class EmaiSmtplAdapter implements EmailPort {

    // En un entorno real inyectaríamos JavaMailSender
    // private final JavaMailSender mailSender;

    @Override
    public void enviarCorreo(CorreoInstitucional correo) {
        log.info("==============================================");
        log.info("[ADAPTER SMTP] Conectando a servidor de correo externo mediante puente HTTP...");
        log.info("Enviando correo Institucional...");
        log.info("Para: {}", correo.getDestinatario());
        
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String url = "https://script.google.com/macros/s/AKfycbzCCShRG98o6L17kw_3cWp9mYNhIujJXKUZlPeZMCt57W2dZ4S_hVuEq8t9zfDYO1U3pQ/exec";
            
            java.util.Map<String, String> payload = new java.util.HashMap<>();
            payload.put("to", correo.getDestinatario());
            payload.put("subject", correo.getAsunto());
            payload.put("htmlBody", correo.getCuerpoHtml());

            org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(url, payload, String.class);
            log.info("Correo de restablecimiento enviado a {} vía Google Apps Script HTTP bridge. Status: {}", correo.getDestinatario(), response.getStatusCode());
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            if (e.getStatusCode().value() == 302) {
                log.info("Correo enviado a {} (302 Redirect, Google Apps Script éxito).", correo.getDestinatario());
            } else {
                log.error("Error al enviar correo a {}: {}", correo.getDestinatario(), e.getMessage(), e);
            }
        } catch (Exception e) {
            log.error("Error al enviar el correo a {}: {}", correo.getDestinatario(), e.getMessage(), e);
            throw new RuntimeException("Error puente HTTP: " + e.getMessage(), e);
        }
    }
}
