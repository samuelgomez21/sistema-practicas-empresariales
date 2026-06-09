package co.edu.sistema_practicas_empresariales.modules.infraestructura.email;

public interface EmailService {
    void enviarCorreo(String destinatario, String asunto, String cuerpoHtml);
}
