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
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(from);
            mensaje.setTo(to);
            mensaje.setSubject(subject);
            mensaje.setText(body);
            mailSender.send(mensaje);

            log.info("Correo enviado correctamente a {}", to);
        } catch (Exception e) {
            // No relanzamos la excepción: el flujo principal (crear usuario,
            // estudiante, empresa) no debe fallar si el correo no se pudo enviar.
            log.error("Error al enviar correo a {}: {}", to, e.getMessage(), e);
        }
    }
}