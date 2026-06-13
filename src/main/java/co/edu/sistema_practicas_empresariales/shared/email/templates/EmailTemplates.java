package co.edu.sistema_practicas_empresariales.shared.email.templates;


public class EmailTemplates {

    public static String credencialesAcceso(String nombre, String email, String passwordTemporal, String frontendUrl) {
        return """
                Hola %s,

                Se ha creado una cuenta para ti en el Sistema de Gestión de Prácticas Empresariales UAH.

                Tus credenciales de acceso son:
                  Correo: %s
                  Contraseña temporal: %s

                Por seguridad, debes cambiar esta contraseña la primera vez que inicies sesión en:
                %s

                Si no esperabas este correo, por favor contacta al administrador del sistema.

                Saludos,
                Sistema de Prácticas Empresariales UAH
                """.formatted(nombre, email, passwordTemporal, frontendUrl);
    }
}