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
        log.info("[ADAPTER SMTP] Conectando a servidor de correo externo...");
        log.info("Enviando correo Institucional...");
        log.info("Para: {}", correo.getDestinatario());
        if (correo.getCopia() != null) {
            log.info("CC: {}", correo.getCopia());
        }
        log.info("Asunto: {}", correo.getAsunto());
        log.info("Adjuntos: {}", correo.getAdjuntos().size());
        log.info("Cuerpo (HTML):\n{}", correo.getCuerpoHtml());
        log.info("==============================================");
        // mailSender.send(message); -> Código real de conexión externa
    }
}
