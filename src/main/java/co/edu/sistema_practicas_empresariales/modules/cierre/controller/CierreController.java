package co.edu.sistema_practicas_empresariales.modules.cierre.controller;

import co.edu.sistema_practicas_empresariales.modules.cierre.service.CierrePracticaFacade;
import co.edu.sistema_practicas_empresariales.modules.practica.dto.PracticaDetalleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el módulo de Cierre de Práctica.
 * <p>
 * Gestiona el proceso formal de finalización de una práctica empresarial.
 * <p>
 * <b>Roles y Permisos:</b> Sólo los Administradores y Coordinadores de Práctica
 * pueden ejecutar el cierre formal de una práctica.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link CierrePracticaFacade})
 * y Chain of Responsibility para validar notas y documentos antes de permitir el cierre.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/cierre-practica")
@RequiredArgsConstructor
public class CierreController {

    private final CierrePracticaFacade cierrePracticaFacade;

    /**
     * Valida y cierra formalmente una práctica.
     * Evalúa que la nota final esté registrada y que se cuente con paz y salvo.
     */
    @PostMapping("/{practicaId}/cerrar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR_PRACTICA')")
    public ResponseEntity<PracticaDetalleDto> cerrarPractica(@PathVariable Long practicaId) {
        return ResponseEntity.ok(cierrePracticaFacade.cerrarPractica(practicaId));
    }
}
