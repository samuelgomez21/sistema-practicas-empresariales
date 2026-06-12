package co.edu.sistema_practicas_empresariales.modules.practica.builder;

import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.EmpresaRepository;
import co.edu.sistema_practicas_empresariales.modules.empresa.repository.TutorEmpresarialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Patrón Builder para extraer y preparar las variables necesarias para el Contrato.
 */
@Component
@RequiredArgsConstructor
public class ContratoBuilder {

    private final EmpresaRepository empresaRepository;
    private final TutorEmpresarialRepository tutorEmpresarialRepository;

    public Map<String, Object> construirVariablesContrato(Practica practica) {
        Map<String, Object> variables = new HashMap<>();

        // Datos del estudiante
        if (practica.getEstudiante() != null && practica.getEstudiante().getUsuario() != null) {
            variables.put("estudiante_nombre", practica.getEstudiante().getUsuario().getNombre());
        }

        // Datos de la empresa
        if (practica.getEmpresaId() != null) {
            empresaRepository.findById(practica.getEmpresaId()).ifPresent(empresa -> {
                variables.put("empresa_nombre", empresa.getRazonSocial());
            });
        }
        
        // Datos del tutor
        if (practica.getTutorEmpresarialId() != null) {
            tutorEmpresarialRepository.findById(practica.getTutorEmpresarialId()).ifPresent(tutor -> {
                variables.put("tutor_nombre", tutor.getNombreCompleto()); // O tutor.getNombre() dependiendo del modelo
            });
        }

        // Datos de la práctica (Vacante / Postulacion)
        variables.put("vacante_area", practica.getMateriaNucleo());
        variables.put("modalidad", "Por definir");
        variables.put("salario", "Por definir");
        variables.put("fecha_inicio", practica.getFechaInicio() != null ? practica.getFechaInicio().toString() : "[Pendiente]");

        return variables;
    }
}
