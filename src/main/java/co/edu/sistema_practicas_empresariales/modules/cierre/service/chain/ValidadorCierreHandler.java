package co.edu.sistema_practicas_empresariales.modules.cierre.service.chain;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;

public interface ValidadorCierreHandler {
    void setNext(ValidadorCierreHandler next);
    void validar(Practica practica);
}
