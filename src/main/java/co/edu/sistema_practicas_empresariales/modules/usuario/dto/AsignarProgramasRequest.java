package co.edu.sistema_practicas_empresariales.modules.usuario.dto;

import lombok.Data;
import java.util.List;

@Data
public class AsignarProgramasRequest {
    private List<Long> programaIds;
}