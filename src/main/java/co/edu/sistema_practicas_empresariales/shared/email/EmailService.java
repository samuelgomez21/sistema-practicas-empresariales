package co.edu.sistema_practicas_empresariales.shared.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSenderImpl mailSender;

    public EmailService() {
        this.mailSender = new JavaMailSenderImpl();
        this.mailSender.setHost("smtp.gmail.com");
        this.mailSender.setPort(587);
        this.mailSender.setUsername("notificacionespracticas71@gmail.com");
        this.mailSender.setPassword("kgxldwdiiouyquga");

        Properties props = this.mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom("notificacionespracticas71@gmail.com");
            mensaje.setTo(to);
            mensaje.setSubject(subject);
            mensaje.setText(body);
            mailSender.send(mensaje);

            log.info("Correo enviado correctamente a {}", to);
        } catch (Exception e) {
            log.error("Error al enviar correo a {}: {}", to, e.getMessage(), e);
        }
    }
}