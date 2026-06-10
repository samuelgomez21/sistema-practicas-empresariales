package co.edu.sistema_practicas_empresariales.shared.email.adapter;

import co.edu.sistema_practicas_empresariales.shared.email.builder.CorreoInstitucional;

/**
 * Puerto que define las operaciones que nuestra aplicación necesita para envíos.
 * Desacopla la lógica de negocio de la tecnología externa (Adapter).
 */
public interface EmailPort {
    void enviarCorreo(CorreoInstitucional correo);
}
