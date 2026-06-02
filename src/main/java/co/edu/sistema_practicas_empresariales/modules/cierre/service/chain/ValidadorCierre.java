package co.edu.sistema_practicas_empresariales.modules.cierre.service.chain;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;

public interface ValidadorCierre {
    void setSiguiente(ValidadorCierre siguiente);
    void validar(Practica practica);
}
