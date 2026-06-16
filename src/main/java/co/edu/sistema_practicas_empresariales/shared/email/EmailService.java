package co.edu.sistema_practicas_empresariales.shared.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.from-name}")
    private String fromName;

    public void sendEmail(String to, String subject, String body) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String url = "https://script.google.com/macros/s/AKfycbzCCShRG98o6L17kw_3cWp9mYNhIujJXKUZlPeZMCt57W2dZ4S_hVuEq8t9zfDYO1U3pQ/exec";
            
            java.util.Map<String, String> payload = new java.util.HashMap<>();
            payload.put("to", to);
            payload.put("subject", subject);
            payload.put("htmlBody", body);

            org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(url, payload, String.class);
            log.info("Correo enviado a {} vía Google Apps Script HTTP bridge. Status: {}", to, response.getStatusCode());
        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", to, e.getMessage(), e);
        }
    }
}