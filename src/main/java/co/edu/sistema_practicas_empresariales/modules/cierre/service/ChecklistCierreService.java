package co.edu.sistema_practicas_empresariales.modules.cierre.service;

import co.edu.sistema_practicas_empresariales.modules.cierre.service.chain.*;
import co.edu.sistema_practicas_empresariales.modules.practica.model.Practica;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChecklistCierreService {

    private final ValidadorNotaDocente validadorNotaDocente;
    private final ValidadorNotaTutor validadorNotaTutor;
    private final ValidadorNotaFinal validadorNotaFinal;
    private final ValidadorEncuestaTutor validadorEncuestaTutor;
    private final ValidadorEncuestaEstudiante validadorEncuestaEstudiante;
    private final ValidadorDocumentos validadorDocumentos;

    public void validarChecklistCierre(Practica practica) {
        // Asignar los eslabones de la cadena de responsabilidad
        validadorNotaDocente.setSiguiente(validadorNotaTutor);
        validadorNotaTutor.setSiguiente(validadorNotaFinal);
        validadorNotaFinal.setSiguiente(validadorEncuestaTutor);
        validadorEncuestaTutor.setSiguiente(validadorEncuestaEstudiante);
        validadorEncuestaEstudiante.setSiguiente(validadorDocumentos);
        validadorDocumentos.setSiguiente(null);

        // Iniciar la validación secuencial
        validadorNotaDocente.validar(practica);
    }
}
