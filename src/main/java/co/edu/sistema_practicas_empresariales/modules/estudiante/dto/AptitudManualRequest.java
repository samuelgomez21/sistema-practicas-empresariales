package co.edu.sistema_practicas_empresariales.modules.estudiante.dto;

import lombok.Data;

@Data
public class AptitudManualRequest {
    private String estadoAptitud; // APTO | EN_REVISION | NO_APTO
}