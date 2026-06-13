package co.edu.sistema_practicas_empresariales.modules.configuracion.controller;

import co.edu.sistema_practicas_empresariales.modules.configuracion.dto.*;
import co.edu.sistema_practicas_empresariales.modules.configuracion.model.CatalogoPractica;
import co.edu.sistema_practicas_empresariales.modules.configuracion.service.ConfiguracionFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

/**
 * Controlador REST para la gestión de la configuración global del sistema.
 * <p>
 * Este controlador actúa como la puerta de entrada (Endpoint) para las peticiones HTTP
 * relacionadas con la configuración, programas y catálogos de práctica.
 * <p>
 * <b>Patrón de Diseño aplicado:</b> Facade (a través de {@link ConfiguracionFacade}).
 * El controlador es intencionalmente "tonto", delegando toda la lógica de negocio,
 * coordinación de repositorios y validaciones a la fachada.
 * 
 * @author Equipo de Desarrollo
 * @version 1.0
 */
@RestController
@RequestMapping("/api/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionFacade configuracionFacade;

    /**
     * Obtiene la información global del sistema consultando el Singleton de configuración.
     *
     * @return ResponseEntity con un mapa que contiene el nombre y la versión de la aplicación.
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> obtenerInfoSistema() {
        return ResponseEntity.ok(
            Map.of(
                "nombre", configuracionFacade.getNombreAplicacion(),
                "version", configuracionFacade.getVersion()
            )
        );
    }

    /**
     * Lista todos los catálogos de práctica activos asociados a un programa académico específico.
     *
     * @param programaId El ID del programa académico a consultar.
     * @return ResponseEntity con la lista de catálogos pertenecientes al programa.
     */
    @GetMapping("/programas/{programaId}/catalogos")
    public ResponseEntity<List<CatalogoPracticaDto>> listarCatalogos(@PathVariable Long programaId) {
        return ResponseEntity.ok(configuracionFacade.listarCatalogosPorPrograma(programaId));
    }

    /**
     * Crea un nuevo catálogo de práctica con las reglas específicas de un programa.
     *
     * @param request DTO que contiene la información requerida para el catálogo (duración, cortes, etc.).
     * @return ResponseEntity con el catálogo creado y el código HTTP 201 (CREATED).
     */
    @PostMapping("/catalogos")
    public ResponseEntity<CatalogoPractica> crearCatalogo(@RequestBody CatalogoPracticaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(configuracionFacade.crearCatalogo(request));
    }

    /**
     * Activa o desactiva un catálogo de práctica existente.
     *
     * @param id El ID del catálogo a modificar.
     * @param activo El nuevo estado (true para activar, false para desactivar).
     * @return ResponseEntity con un mensaje de éxito.
     */
    @PatchMapping("/catalogos/{id}/estado")
    public ResponseEntity<String> cambiarEstadoCatalogo(@PathVariable Long id, @RequestParam boolean activo) {
        configuracionFacade.activarDesactivarCatalogo(id, activo);
        return ResponseEntity.ok("Estado actualizado exitosamente");
    }


    /**
     * Obtiene los parámetros académicos configurados para un programa.
     * Si no existen, se crean con valores por defecto.
     */
    @GetMapping("/programas/{programaId}/parametros")
    public ResponseEntity<ProgramaParametroDto> obtenerParametros(@PathVariable Long programaId) {
        return ResponseEntity.ok(configuracionFacade.obtenerParametrosPrograma(programaId));
    }

    /**
     * Actualiza los parámetros académicos de un programa.
     * Los cambios solo aplican a prácticas futuras.
     */
    @PutMapping("/programas/{programaId}/parametros")
    public ResponseEntity<ProgramaParametroDto> actualizarParametros(
            @PathVariable Long programaId,
            @RequestBody ProgramaParametroRequest request) {
        return ResponseEntity.ok(configuracionFacade.actualizarParametrosPrograma(programaId, request));
    }

    /**
     * Actualiza una práctica del catálogo.
     * Nota: solo afecta a prácticas futuras; las instancias activas
     * mantienen su configuración original.
     */
    @PutMapping("/catalogos/{id}")
    public ResponseEntity<CatalogoPractica> actualizarCatalogo(
            @PathVariable Long id,
            @RequestBody CatalogoPracticaRequest request) {
        return ResponseEntity.ok(configuracionFacade.actualizarCatalogo(id, request));
    }


    /**
     * Lista los catálogos de práctica de un programa, incluyendo el
     * conteo de prácticas activas vinculadas a cada uno.
     */
    @GetMapping("/programas/{programaId}/catalogos-con-conteo")
    public ResponseEntity<List<CatalogoPracticaConConteoDto>> listarCatalogosConConteo(@PathVariable Long programaId) {
        return ResponseEntity.ok(configuracionFacade.listarCatalogosPorProgramaConConteo(programaId));
    }
}
