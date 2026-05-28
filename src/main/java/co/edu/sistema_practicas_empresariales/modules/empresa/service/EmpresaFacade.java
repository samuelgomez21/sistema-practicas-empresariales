package co.edu.sistema_practicas_empresariales.modules.empresa.service;

import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.EmpresaResponse;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialRequest;
import co.edu.sistema_practicas_empresariales.modules.empresa.dto.TutorEmpresarialResponse;

import java.util.List;

public interface EmpresaFacade {
    EmpresaResponse registrarEmpresa(EmpresaRequest request);
    TutorEmpresarialResponse registrarTutor(TutorEmpresarialRequest request);
}
