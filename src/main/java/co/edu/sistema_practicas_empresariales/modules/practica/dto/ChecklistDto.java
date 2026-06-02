package co.edu.sistema_practicas_empresariales.modules.practica.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChecklistDto {
    private Long    id;
    private String  clave;
    private String  label;
    private Boolean completado;
}
