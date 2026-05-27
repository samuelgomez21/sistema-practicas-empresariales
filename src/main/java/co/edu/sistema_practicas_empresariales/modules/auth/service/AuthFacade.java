package co.edu.sistema_practicas_empresariales.modules.auth.service;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.JwtResponse;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.LoginRequest;

public interface AuthFacade {
    JwtResponse login(LoginRequest loginRequest);
    void registerSemillaAdmin();
}
