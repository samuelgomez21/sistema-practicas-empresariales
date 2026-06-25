package co.edu.sistema_practicas_empresariales;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

public class MailTest {
    public static void main(String[] args) {
        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost("smtp.gmail.com");
            mailSender.setPort(587);
            mailSender.setUsername("notificacionespracticas71@gmail.com");
            mailSender.setPassword("kgxldwdiiouyquga");

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.debug", "true");

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("notificacionespracticas71@gmail.com");
            message.setTo("notificacionespracticas71@gmail.com");
            message.setSubject("Test Email from Java");
            message.setText("This is a test email sent from Java");

            System.out.println("Enviando correo...");
            mailSender.send(message);
            System.out.println("Correo enviado exitosamente.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
