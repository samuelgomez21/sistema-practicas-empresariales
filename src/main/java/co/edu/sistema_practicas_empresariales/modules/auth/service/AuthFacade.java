package co.edu.sistema_practicas_empresariales.modules.auth.service;

import co.edu.sistema_practicas_empresariales.modules.auth.dto.LoginRequest;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.JwtResponse;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.RecuperarPasswordDto;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.ResetPasswordDto;
import co.edu.sistema_practicas_empresariales.modules.auth.dto.CambiarPasswordInicialDto;

public interface AuthFacade {
    JwtResponse login(LoginRequest request);
    void registerSemillaAdmin();
    void solicitarRecuperacionPassword(RecuperarPasswordDto request);
    void resetearPassword(ResetPasswordDto request);
    void cambiarPasswordPrimerIngreso(CambiarPasswordInicialDto request);
}
