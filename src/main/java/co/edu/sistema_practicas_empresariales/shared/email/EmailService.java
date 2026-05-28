package co.edu.sistema_practicas_empresariales.shared.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendEmail(String to, String subject, String body) {
        log.info("==============================================");
        log.info("SIMULANDO ENVÍO DE CORREO...");
        log.info("Para: {}", to);
        log.info("Asunto: {}", subject);
        log.info("Cuerpo:\n{}", body);
        log.info("==============================================");
        // Aquí en el futuro se integrará JavaMailSender
    }
}
